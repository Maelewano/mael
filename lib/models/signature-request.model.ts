// lib/models/signature-request.ts
import mongoose from "mongoose";

const EmbeddedSignatureRequestSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  signatureRequestId: { type: String, required: true },
  signatureRequestExpiresAt: { type: Number },
  signaturesAll: [
    {
      signatureId: String,
      signerEmailAddress: String,
      signerName: String,
      signerRole: String,
      order: Number,
      statusCode: String,
      signedAt: Number,
      lastViewedAt: Number,
      lastRemindedAt: Number,
      hasPin: Boolean,
      hasSmsAuth: Boolean,
      hasSmsDelivery: Boolean,
      smsPhoneNumber: String,
      error: String,
    },
  ],
  warnings: [
    {
      warningMsg: String,
      warningName: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const EmbeddedSignatureRequest =
  mongoose.models.EmbeddedSignatureRequest ||
  mongoose.model("EmbeddedSignatureRequest", EmbeddedSignatureRequestSchema);

export { EmbeddedSignatureRequestSchema, EmbeddedSignatureRequest };
