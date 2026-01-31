import { NextRequest, NextResponse } from "next/server";
import DropboxSign from "@dropbox/sign";
import { EmbeddedSignatureRequest } from "@/lib/models/signature-request.model";
import { connectDB } from "@/lib/utils/mongodbUtilities";
import { resendSignatureService } from "@/app/api/services/resend/resendSignature.service";
import { EmailInformation } from "@/lib/types/emailInformation.types";
import { env } from "@/env.mjs";
import { inspect } from "util";
import { logger } from "@/lib/utils/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    logger.info("send_emails called with body:", inspect(body, { depth: 3 }));
    const { signatureRequestId, signature_id } = body;

    if (!signatureRequestId && !signature_id) {
      return NextResponse.json(
        { error: "signatureRequestId or signature_id required" },
        { status: 400 },
      );
    }

    await connectDB();

    // Fetch stored embedded signature request from DB by signatureRequestId or by signature_id inside signatures
    let doc: any = null;
    try {
      if (signatureRequestId) {
        doc = await EmbeddedSignatureRequest.findOne({ signatureRequestId }).lean();
      }

      if (!doc && signature_id) {
        doc = await EmbeddedSignatureRequest.findOne({ "signaturesAll.signatureId": signature_id }).lean();
      }
    } catch (dbErr) {
      logger.error("DB lookup error:", inspect(dbErr, { depth: 5 }));
      throw dbErr;
    }

    logger.info("send_emails DB lookup result:", {
      found: !!doc,
      signatureRequestId: doc?.signatureRequestId,
      signaturesCount: doc?.signaturesAll?.length || 0,
    });

    if (!doc) {
      return NextResponse.json(
        { error: "Stored signature request not found" },
        { status: 404 },
      );
    }

    const signatures = doc.signaturesAll || [];
    const resendResults: Array<{ to: string; status: string; info?: any }> = [];

    const embeddedApi = new DropboxSign.EmbeddedApi();
    embeddedApi.username = env.NEXT_DROPBOX_SIGN_API_KEY;

    for (const sig of signatures) {
      try {
        const signatureId = sig.signatureId || sig.signature_id;
        const recipientEmail =
          sig.signerEmailAddress || sig.signer_email_address;
        const recipientName = sig.signerName || sig.signer_name || undefined;

        if (!recipientEmail) {
          resendResults.push({
            to: recipientEmail || "unknown",
            status: "skipped: no email",
          });
          continue;
        }

        // Try to build an embedded sign URL for this signature id (best-effort)
        let signUrl: string | undefined = undefined;
        if (signatureId) {
          try {
            const embedResp = await embeddedApi.embeddedSignUrl(signatureId);
            signUrl = embedResp?.body?.embedded?.signUrl;
          } catch (e) {
            // ignore failures to generate per-signer embed URL; emails can still be sent without it
            console.error("embeddedSignUrl error for", signatureId, e);
          }
        }

        // Build a friendly default body that includes the signature request expiry when available
        let defaultBody = `Please sign the document.`;
        if (doc.signatureRequestExpiresAt) {
          try {
            const expires = new Date(doc.signatureRequestExpiresAt * 1000);
            const pretty = expires.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
            defaultBody = `Please sign the document before ${pretty}.`;
          } catch (e) {
            // fallback to unix timestamp if formatting fails
            defaultBody = `Please sign the document before ${doc.signatureRequestExpiresAt}.`;
          }
        }

        const emailInfo: EmailInformation = {
          uid: doc.signatureRequestId || "",
          title: doc.title || "Document Signature Request",
          body: doc.message || doc.subject || defaultBody,
          to: recipientEmail,
          startDate: new Date().toISOString(),
          endDate: doc.signatureRequestExpiresAt
            ? new Date(doc.signatureRequestExpiresAt * 1000).toISOString()
            : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          description: doc.message || doc.subject || "Signature request",
          url: signUrl || "",
          signatureId: signatureId || undefined,
          order: typeof sig.order === 'number' ? sig.order : (sig.order ? Number(sig.order) : undefined),
          organizerEmail:
            signatures[0]?.signerEmailAddress ||
            signatures[0]?.signer_email_address ||
            "",
          organizerName:
            signatures[0]?.signerName ||
            signatures[0]?.signer_name ||
            undefined,
          participantName: recipientName,
          participantEmail: recipientEmail,
        };

        const sendResult = await resendSignatureService(emailInfo);
        resendResults.push({
          to: recipientEmail,
          status: "sent",
          info: sendResult,
        });
      } catch (err) {
        console.error("Failed to send email for signer", sig, err);
        resendResults.push({
          to: sig.signerEmailAddress || sig.signer_email_address || "unknown",
          status: "failed",
          info: err,
        });
      }
    }

    return NextResponse.json({ ok: true, results: resendResults });
  } catch (err) {
    console.error("send_emails route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
