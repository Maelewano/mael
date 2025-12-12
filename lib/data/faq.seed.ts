import { IFAQDocument } from "@/lib/models/faq.model";

export const faqSeedData: Omit<IFAQDocument, "createdAt" | "updatedAt"> = {
  categories: [
    {
      name: "General Information",
      description:
        "Basic information about Mael",
      items: [
        {
          question: "What is Mael?",
          answer:
            "Mael is a platform that aims to harmonize secure document signing, and video conferencing into one platform.",
          category: "general",
          tags: ["platform", "integration", "legal", "management"],
        },
        {
          question: "Who can use Mael?",
          answer:
            "Mael is designed for users who want a unified platform for secure document signing and video conferencing. This includes legal professionals, businesses, and individuals seeking efficient solutions.",
          category: "general",
          tags: ["users", "professionals", "businesses", "individuals"],
        },
        {
            question: "How do I start using Mael?",
            answer:
              "To start using Mael, simply schedule a meeting, receive an invitation email, and follow the on-screen instructions to complete your meeting and utilize the platform.",
            category: "general",
            tags: ["signup", "account", "subscription", "getting started"],
        }
      ],
    },
    {
      name: "Document Signing",
      description:
        "Electronic signature process, DropboxSign integration, and security measures",
      items: [
        {
          question: "How do I sign a document?",
          answer:
            'You&apos;ll receive a unique Signature ID from your host. Enter this ID in the designated field, click "Retrieve Document" to load the signing interface, review the document, and follow the on-screen prompts to complete your signature.',
          category: "document-signing",
          tags: ["signing", "signature-id", "process", "dropboxsign"],
        },
        {
          question: "What signature methods are available?",
          answer:
            "You can sign documents by drawing your signature with a mouse or touchscreen, typing your name in a signature font, or uploading an image of your handwritten signature.",
          category: "document-signing",
          tags: ["signature", "methods", "draw", "type", "upload"],
        },
        {
          question: "What are the security measures for document signing?",
          answer:
            "Mael employs industry-standard encryption, secure access controls, and audit trails to ensure the integrity and confidentiality of your signed documents.",
          category: "document-signing",
          tags: ["security", "encryption", "access control", "audit trails"],
        },
        {
            question: "Is my electronic signature legally binding?",
            answer:
              "Yes, electronic signatures obtained through Mael comply with relevant legal standards and are considered legally binding in most jurisdictions.",
            category: "document-signing",
            tags: ["legal", "binding", "electronic signature"],
        }
      ],
    },
  ],
  lastUpdated: new Date(),
  updatedBy: "System Admin",
};
