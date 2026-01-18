import { Html } from "@react-email/html";
import { Text } from "@react-email/text";

import { EmailInformation } from "@/lib/types/emailInformation.types";

const emailButtonStyle: React.CSSProperties = {
  display: "inline-block",
  alignItems: "center",
  borderRadius: "0.375rem",
  background: "#6366f1",
  padding: "8px 12px",
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "#fff",
  boxShadow: "0 1px 2px 0 rgba(16,24,40,0.05)",
  transition: "all 0.2s",
  textDecoration: "none",
  margin: "12px 0",
};

export function Email(emailInformation: EmailInformation) {
  return (
    <Html lang="en">
      <Text>Hi there,</Text>
      <Text>
        You are invited to a Meeting scheduled on <strong>{emailInformation.startDate}</strong>.
      </Text>
      <Text><strong>Description: </strong>{emailInformation.description}</Text>
      <Text>
        <a href={emailInformation.url} style={emailButtonStyle}>
          Join Meeting
        </a>
      </Text>
      <Text>
        <small><strong>Open/Download the attached file to add this event to your calendar.</strong></small>
      </Text>
    </Html>
  );
}

export default Email;
