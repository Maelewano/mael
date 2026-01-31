import React from 'react';
import { EmailInformation } from '@/lib/types/emailInformation.types';

export default function SignatureEmail(props: EmailInformation) {
  const { title, body, participantName, participantEmail, url, organizerName, order } = props as any;

  return (
    <html>
      <body style={{ fontFamily: 'Arial, sans-serif', color: '#111' }}>
        <h2>{title ?? 'Signature Request'}</h2>
        {organizerName && <p>From: {organizerName}</p>}
        <p>Hi {participantName ?? participantEmail ?? 'there'},</p>
        <p>{body ?? 'You have a document awaiting your signature.'}</p>
        <div>
          <p><strong>Signature ID:</strong> {props.signatureId ?? 'N/A'}</p>
          <p><strong>Order:</strong> {typeof order === 'number' ? order : 'N/A'}</p>
          {typeof order === 'number' ? (
            <>
              <p style={{ marginTop: 6 }}>
                {order === 0 ? 'You are signing first.' : order === 1 ? 'You are signing second.' : `You are signing at position ${order}.`}
              </p>
              <p style={{ marginTop: 6 }}>
                Use either the Signature ID above or this email address ({props.participantEmail ?? 'N/A'}) to sign the document.
              </p>
            </>
          ) : null}
        </div>
        <hr />
        <p>If you have questions, reply to this email.</p>
      </body>
    </html>
  );
}
