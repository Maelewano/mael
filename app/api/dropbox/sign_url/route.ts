/**
 * Server Side
 *
 * This endpoint retrieves the embedded object containing a signature URL that can be opened in an iFrame.
 * The sign URL is used to embed the signature request in our website
 * This URL expires after a short period, so it should be requested just before showing to the user
 */
import * as DropboxSign from "@dropbox/sign";
import { NextRequest, NextResponse } from "next/server";

import { env } from "@/env.mjs";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // This endpoint is used to retrieve the embedded sign URL for a signature request
  try {
    const { searchParams } = new URL(req.url);
    const signatureId = searchParams.get("signature_id");

    if (!signatureId) {
      return NextResponse.json(
        { success: false, error: "Missing signatureId parameter" },
        { status: 400 },
      );
    }

    // Initialize the Embedded API
    const embeddedApi = new DropboxSign.EmbeddedApi();
    embeddedApi.username = env.NEXT_DROPBOX_SIGN_API_KEY;

    // Call the Dropbox Sign API to get the sign URL
    const response = await embeddedApi.embeddedSignUrl(signatureId);

    console.log("Embedded sign URL response:", response.body);

    return NextResponse.json(
      {
        success: true,
        data: response.body,
        embedded: {
          // client_id: env.NEXT_PUBLIC_DROPBOX_SIGN_CLIENT_ID,
          sign_url: response.body.embedded?.signUrl,
          expires_at: response.body.embedded?.expiresAt,
        },
        warnings: response.body.warnings,
        signUrl: response.body.embedded?.signUrl,
        expiresAt: response.body.embedded?.expiresAt,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error retrieving embedded sign URL:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
