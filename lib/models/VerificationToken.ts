import mongoose, { Schema, models, model } from "mongoose";

export interface VerificationTokenDocument extends mongoose.Document {
  email: string;
  tokenHash: string;
  expiresAt: Date;
}

const verificationTokenSchema = new Schema<VerificationTokenDocument>({
  email: { type: String, required: true, lowercase: true, trim: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

verificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const VerificationToken =
  models.VerificationToken ||
  model<VerificationTokenDocument>(
    "VerificationToken",
    verificationTokenSchema,
  );
