/**
 * Server Side
 *
 * GET endpoint to retrieve signature request status
 * Uses signature_request_id to fetch current status from Dropbox Sign API
 */
import * as DropboxSign from "@dropbox/sign";
import { NextRequest, NextResponse } from "next/server";

import { env } from "@/env.mjs";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const signatureRequestId = searchParams.get("signature_request_id");

    if (!signatureRequestId) {
      return NextResponse.json(
        { success: false, error: "Missing signature_request_id parameter" },
        { status: 400 },
      );
    }

    const signatureRequestApi = new DropboxSign.SignatureRequestApi();
    signatureRequestApi.username = env.NEXT_DROPBOX_SIGN_API_KEY;

    const result =
      await signatureRequestApi.signatureRequestGet(signatureRequestId);

    const statusInfo = {
      signatureRequestId: result.body.signatureRequest?.signatureRequestId,
      title: result.body.signatureRequest?.title,
      isComplete: result.body.signatureRequest?.isComplete,
      isDeclined: result.body.signatureRequest?.isDeclined,
      hasError: result.body.signatureRequest?.hasError,
      expiresAt: result.body.signatureRequest?.expiresAt,
      signatures: result.body.signatureRequest?.signatures?.map((sig) => ({
        signerEmail: sig.signerEmailAddress,
        status: sig.statusCode,
        signedAt: sig.signedAt,
        lastViewedAt: sig.lastViewedAt,
      })),
      responseData: result.body.signatureRequest?.responseData,
    };

    return NextResponse.json({ success: true, data: statusInfo });
  } catch (error) {
    console.error("Error retrieving signature request status:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
