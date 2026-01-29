/**
 * Server Side
 *
 * This endpoint retrieves the embedded object containing a signature URL that can be opened in an iFrame.
 * The sign URL is used to embed the signature request in our website
 * This URL expires after a short period, so it should be requested just before showing to the user
 */
import * as DropboxSign from "@dropbox/sign";
import util from "util";
import { NextRequest, NextResponse } from "next/server";

import { env } from "@/env.mjs";
import { connectDB } from "@/lib/utils/mongodbUtilities";
import { EmbeddedSignatureRequest } from "@/lib/models/signature-request.model";

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

    const errAny = error as any;
    // Safely log the SDK error body for debugging (handles circular refs)
    try {
      const bodyToInspect = errAny?.response?.body || errAny?.body || errAny;
      console.error("DropboxSign error body:", util.inspect(bodyToInspect, { depth: 4 }));
    } catch (logErr) {
      console.error("Failed to inspect DropboxSign error body:", logErr);
    }

    // If the SDK returned a 409, surface a friendly message to the client.
    const statusCode =
      errAny?.statusCode || errAny?.response?.statusCode || errAny?.response?.status;

    if (statusCode === 409) {
      // Prefer to build a dynamic message by fetching the authoritative
      // signature request when possible (avoids circular error payloads).
      try {
        const respBody = errAny?.response?.body || errAny?.body || errAny?.response || errAny;

        // Try to extract a signatureRequestId from common locations in the payload
        const signatureRequestId =
          respBody?.signatureRequest?.signatureRequestId ||
          respBody?.signatureRequestId ||
          respBody?.signature_request_id ||
          respBody?.signatureRequest?.id ||
          respBody?.body?.signatureRequest?.signatureRequestId ||
          null;

        // If we have a signatureRequestId, call the SignatureRequest API to get signer info
        if (signatureRequestId) {
          const signatureRequestApi = new DropboxSign.SignatureRequestApi();
          signatureRequestApi.username = env.NEXT_DROPBOX_SIGN_API_KEY;

          try {
            const result = await signatureRequestApi.signatureRequestGet(signatureRequestId);
            const signatures = result.body.signatureRequest?.signatures || [];

            // Determine which signer is blocking based on order/status
            let waitingSigner: any = null;

            // If request includes signature_id param try to match it
            const { searchParams } = new URL(req.url);
            const requestedSignatureId = searchParams.get("signature_id");

            const currentSig = requestedSignatureId
              ? signatures.find((s: any) => (s.signatureId || s.signature_id) === requestedSignatureId)
              : null;

            if (currentSig && typeof currentSig.order === "number") {
              const currentOrder = currentSig.order;
              const earlier = signatures
                .slice()
                .filter((s: any) => typeof s.order === "number" && s.order < currentOrder)
                .sort((a: any, b: any) => a.order - b.order);

              waitingSigner = earlier.find((s: any) => !s.signedAt && s.statusCode !== "signed" && s.statusCode !== "completed");
            }

            if (!waitingSigner) {
              waitingSigner = signatures.find((s: any) => s.statusCode === "awaiting_signature");
            }

            if (waitingSigner) {
              const name = waitingSigner.signerName || waitingSigner.signer_name || waitingSigner.signerEmailAddress || waitingSigner.signer_email_address || waitingSigner.email || "signer";
              const order = typeof waitingSigner.order === "number" ? waitingSigner.order : "0";
              const message = `Conflict: Request cannot be signed yet — waiting for ${name} (signer ${order}) to sign.`;
              console.log("Returning 409 message:", message);
              return NextResponse.json({ success: false, error: message }, { status: 409 });
            }
          } catch (apiErr) {
            console.error("Error fetching signature request for dynamic message:", apiErr);
          }
        }

          // If we don't have a signatureRequestId in the SDK error payload,
          // try looking up the signature request stored in our DB by signatureId.
          try {
            // re-extract the signature_id from the incoming request URL (we're in the catch scope)
            const { searchParams: _searchParams } = new URL(req.url);
            const requestedSignatureId = _searchParams.get("signature_id");

            await connectDB();
            const dbEntry = await EmbeddedSignatureRequest.findOne({ 'signaturesAll.signatureId': requestedSignatureId }).lean() as { signaturesAll?: any[] } | null;
            if (dbEntry?.signaturesAll && Array.isArray(dbEntry.signaturesAll)) {
              const signatures = dbEntry.signaturesAll;
              // Find waiting signer similarly to above
              const currentSig = signatures.find((s: any) => (s.signatureId || s.signature_id) === requestedSignatureId);
              let waitingSigner: any = null;
              if (currentSig && typeof currentSig.order === 'number') {
                const earlier = signatures
                  .slice()
                  .filter((s: any) => typeof s.order === 'number' && s.order < currentSig.order)
                  .sort((a: any, b: any) => a.order - b.order);
                waitingSigner = earlier.find((s: any) => !s.signedAt && s.statusCode !== 'signed' && s.statusCode !== 'completed');
              }
              if (!waitingSigner) {
                waitingSigner = signatures.find((s: any) => s.statusCode === 'awaiting_signature');
              }
              if (waitingSigner) {
                const name = waitingSigner.signerName || waitingSigner.signerName || waitingSigner.signerEmailAddress || waitingSigner.signer_email_address || waitingSigner.email || 'signer';
                const order = typeof waitingSigner.order === 'number' ? waitingSigner.order : '0';
                const message = `Conflict: Request cannot be signed yet — waiting for ${name} (signer ${order}) to sign.`;
                console.log('Returning 409 message (db lookup):', message);
                return NextResponse.json({ success: false, error: message }, { status: 409 });
              }
            }
          } catch (dbErr) {
            console.error('DB lookup failed while building dynamic 409 message:', dbErr);
          }

        // If we couldn't fetch or compute a detailed message, attempt best-effort extraction
        try {
          const signatures =
            respBody?.signatureRequest?.signatures || respBody?.signaturesAll || respBody?.signatures || [];

          if (Array.isArray(signatures) && signatures.length > 0) {
            const waitingSigner = signatures.find((s: any) => s.statusCode === "awaiting_signature");
            if (waitingSigner) {
              const name = waitingSigner.signerName || waitingSigner.signer_name || waitingSigner.signerEmailAddress || waitingSigner.signer_email_address || waitingSigner.email || "signer";
              const order = typeof waitingSigner.order === "number" ? waitingSigner.order : "0";
              const message = `Conflict: Request cannot be signed yet — waiting for ${name} (signer ${order}) to sign.`;
              console.log("Returning 409 message (best-effort):", message);
              return NextResponse.json({ success: false, error: message }, { status: 409 });
            }
          }
        } catch (inner) {
          console.error("Best-effort parsing failed:", inner);
        }

        // Final fallback wording
        return NextResponse.json(
          {
            success: false,
            error: "Waiting for a priority signer to sign before unlocking your signature",
          },
          { status: 409 },
        );
      } catch (parseErr) {
        console.error("Failed to handle 409 payload for dynamic message:", parseErr);
        return NextResponse.json(
          {
            success: false,
            error: "Waiting for a priority signer to sign before unlocking your signature",
          },
          { status: 409 },
        );
      }
    }

    // Fall back to a safe message extraction without attempting to JSON.stringify
    const fallbackMessage =
      (errAny && (errAny.message || errAny?.response?.statusMessage)) ||
      "Error retrieving embedded sign URL";

    return NextResponse.json(
      { success: false, error: String(fallbackMessage) },
      { status: 500 },
    );
  }
}
