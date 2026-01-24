/**
 * Server Side
 *
 * This is the server side code for creating an embed signature request
 * It takes in the form data from the Signature request form
 * and sends a new SignatureRequest with the submitted documents.
 *
 * If form_fields_per_document is not specified,
 * a signature page will be affixed where all signers will be required to add their signature,
 * signifying their agreement to all contained documents.
 */
import { Readable } from "stream";

import * as DropboxSign from "@dropbox/sign";
import { NextRequest, NextResponse } from "next/server";

import { env } from "@/env.mjs";
import { EmbeddedSignatureRequest } from "@/lib/models/signature-request.model";
import { connectDB } from "@/lib/utils/mongodbUtilities";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const signatureRequestApi = new DropboxSign.SignatureRequestApi();
    signatureRequestApi.username = env.NEXT_DROPBOX_SIGN_API_KEY;

    const signingOptions: DropboxSign.SubSigningOptions = {
      defaultType: DropboxSign.SubSigningOptions.DefaultTypeEnum.Draw,
      draw: true,
      type: true,
      upload: true,
      phone: true,
    };

    const fieldOptions: DropboxSign.SubFieldOptions = {
      dateFormat: DropboxSign.SubFieldOptions.DateFormatEnum.DDMMYYYY,
    };

    // Process the form data and files
    const files: any[] = [];

    // Extract files from formData
    for (let i = 0; formData.get(`file${i}`); i++) {
      const file = formData.get(`file${i}`) as File;
      if (file) {
        // Convert File to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Create a readable stream from the buffer
        const stream = Readable.from(buffer);
        // Add file name property to the stream for the SDK
        Object.defineProperty(stream, "name", {
          value: file.name,
        });

        files.push(stream);
      }
    }
    const clientId = formData.get("client_id") as string;
    const title = formData.get("title")?.toString();
    const subject = formData.get("subject")?.toString();
    const message = formData.get("message")?.toString();

    // Parse the signers properly
    const signers: DropboxSign.SubSignatureRequestSigner[] = [];
    let signerIndex = 0;
    while (formData.get(`signer[${signerIndex}][email_address]`)) {
      signers.push({
        emailAddress:
          formData.get(`signer[${signerIndex}][email_address]`)?.toString() ||
          "",
        name: formData.get(`signer[${signerIndex}][name]`)?.toString() || "",
        order: formData.get(`signer[${signerIndex}][order]`)
          ? parseInt(
              formData.get(`signer[${signerIndex}][order]`)?.toString() || "0"
            )
          : undefined,
      });
      signerIndex++;
    }

    const ccEmailAddresses = formData.getAll("ccEmailAddresses") as string[];
    const testMode = formData.get("testMode") === "true";

    // Calculate expiration timestamp for 2 day from now
    const DayFromNow = 2 * 24 * 60 * 60; // 2 day in seconds
    const expiresAt = Math.floor(Date.now() / 1000) + DayFromNow; // Current time in seconds + 2 days

    // Create data for signature request Api
    const data: DropboxSign.SignatureRequestCreateEmbeddedRequest = {
      clientId,
      title,
      subject,
      message,
      signers,
      ccEmailAddresses,
      files,
      signingOptions,
      fieldOptions,
      testMode,
      expiresAt,
    };

    // Call the Dropbox Sign API
    const result =
      await signatureRequestApi.signatureRequestCreateEmbedded(data);

    const responseData = {
      signatureRequestId: result.body.signatureRequest?.signatureRequestId,
      signingUrl: result.body.signatureRequest?.signingUrl,
      signatureRequestExpiresAt: result.body.signatureRequest?.expiresAt,
      signaturesAll: result.body.signatureRequest?.signatures,
      warnings: result.body.warnings,
    };

    // --- Store signature request in backend DB using Mongoose ---
    try {
      await connectDB();
      // Use the first signer's email as the owner identifier
      const userId = signers[0]?.emailAddress || "unknown";
      await EmbeddedSignatureRequest.create({
        userId,
        signatureRequestId: responseData.signatureRequestId,
        signatureRequestExpiresAt: responseData.signatureRequestExpiresAt,
        signaturesAll: responseData.signaturesAll,
        warnings: responseData.warnings,
      });
    } catch (err) {
      console.error("Failed to store signature request in DB:", err);
    }

    return NextResponse.json({ success: true, data: responseData });
  } catch (error) {
    console.error("Error creating signature request:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
