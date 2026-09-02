import mongoose, { Schema, models, model } from "mongoose";

export interface OrderItem {
  slug: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface OrderDocument extends mongoose.Document {
  userId?: mongoose.Types.ObjectId;
  reference: string;
  items: OrderItem[];
  subtotal: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  status: "pending" | "paid" | "failed";
  paystackReference?: string;
  createdAt: Date;
}

const orderItemSchema = new Schema<OrderItem>(
  {
    slug: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
  },
  { _id: false },
);

const orderSchema = new Schema<OrderDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    reference: { type: String, required: true, unique: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Order = models.Order || model<OrderDocument>("Order", orderSchema);
