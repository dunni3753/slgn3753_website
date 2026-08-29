import mongoose, { Schema, models, model } from "mongoose";

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  emailVerified: boolean;
  avatarUrl?: string;
  createdAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    emailVerified: { type: Boolean, default: false },
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

export const User = models.User || model<UserDocument>("User", userSchema);
