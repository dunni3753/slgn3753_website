import mongoose, { Schema, models, model } from "mongoose";

export interface ProductDocument extends mongoose.Document {
  name: string;
  slug: string;
  category: string;
  price: number;
  spec: string;
  description: string;
  stock: number;
  images: string[];
  active: boolean;
  createdAt: Date;
}

const productSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    spec: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.index({ name: "text", spec: "text" });

export const Product =
  models.Product || model<ProductDocument>("Product", productSchema);
