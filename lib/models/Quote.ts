import mongoose, { Schema, models, model } from "mongoose";

export interface QuoteDocument extends mongoose.Document {
  fullName: string;
  phone: string;
  email: string;
  serviceType: string;
  location: string;
  message?: string;
  status: "new" | "contacted" | "closed";
  createdAt: Date;
}

const quoteSchema = new Schema<QuoteDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    serviceType: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true },
);

export const Quote = models.Quote || model<QuoteDocument>("Quote", quoteSchema);
