import mongoose, { Schema, models, model } from "mongoose";

export interface CategoryDocument extends mongoose.Document {
  name: string;
  slug: string;
  detail: string;
  icon: string;
  createdAt: Date;
}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    detail: { type: String, required: true, trim: true },
    icon: { type: String, default: "camera" },
  },
  { timestamps: true },
);

export const Category =
  models.Category || model<CategoryDocument>("Category", categorySchema);
