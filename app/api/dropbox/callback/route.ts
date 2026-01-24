/**
 * Api route for Dropbox callback
 * Requires a POST request with a form data object containing a json property
 * The server must be from a https:// domain
 * We are currently using NGROK to mirror our localhost as a https:// domain (See .env file)
 *
 * @param req - NextRequest
 * @returns NextResponse
 */
import { NextRequest, NextResponse } from "next/server";

interface SignatureRequest {
  signature_request: {
    [key: string]: any;
  };
  event: {
    event_type: string;
    event_time: string;
    event_hash: string;
    event_metadata: {
      related_signature_id: string;
      reported_for_app_id: string;
      reported_for_account_id: string;
      event_message: string;
    };
  };
}

interface DropboxCallback {
  signatureId: string;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const jsonData = formData.get("json");
    console.log("Received form data:", jsonData);

    if (typeof jsonData === "string") {
      const body = JSON.parse(jsonData);

      // Handle HelloSign webhook
      if (body.event) {
        const event = body as SignatureRequest;
        console.log("Processing HelloSign Event:", event);

        switch (event.event.event_type) {
          case "callback_test":
            return NextResponse.json({
              message: "Hello API Event Received",
            });
          case "signature_request_sent":
            console.log("Signature request sent:", event.signature_request);
            break;
          case "signature_request_signed":
            console.log("Signature request signed:", event.signature_request);
            break;
          case "signature_request_all_signed":
            console.log("All signatures completed:", event.signature_request);
            break;
          case "signature_request_declined":
            console.log("Signature request declined:", event.signature_request);
            break;
          case "signature_request_email_bounce":
            console.log(
              "Signature request email bounce:",
              event.signature_request,
            );
            break;
          case "signature_request_expired":
            console.log("Signature request expired:", event.signature_request);
            break;
          default:
            console.log("Unhandled event type:", event.event.event_type);
        }
      }

      // Handle Dropbox callback
      if ("signatureId" in body) {
        const dropboxRequest = body as DropboxCallback;
        const signUrl = `https://api.dropbox.com/sign/${dropboxRequest.signatureId}`;

        return NextResponse.json({
          embedded: {
            sign_url: signUrl,
          },
        });
      }
    }

    return NextResponse.json(
      { message: "Request processed successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Processing error:", error);
    return NextResponse.json(
      {
        message: "Error processing request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
