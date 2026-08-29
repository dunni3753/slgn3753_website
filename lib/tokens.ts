import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { VerificationToken } from "./models/VerificationToken";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createVerificationToken(email: string) {
  await connectToDatabase();

  await VerificationToken.deleteMany({ email: email.toLowerCase() });

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  await VerificationToken.create({
    email: email.toLowerCase(),
    tokenHash,
    expiresAt,
  });

  return rawToken;
}

export async function consumeVerificationToken(
  email: string,
  rawToken: string,
) {
  await connectToDatabase();

  const tokenHash = hashToken(rawToken);
  const record = await VerificationToken.findOne({
    email: email.toLowerCase(),
    tokenHash,
  });

  if (!record) return { valid: false as const, reason: "invalid" as const };
  if (record.expiresAt.getTime() < Date.now()) {
    await record.deleteOne();
    return { valid: false as const, reason: "expired" as const };
  }

  await record.deleteOne();
  return { valid: true as const };
}
