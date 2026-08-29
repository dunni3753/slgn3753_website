import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string,
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const verifyUrl = `${siteUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL as string,
    to: email,
    subject: "SLGN",
    html: `
      <div style="background-color:#f3f4f1;padding:40px 20px;font-family:Helvetica,Arial,sans-serif;">
        <div style="max-width:480px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #dee1dc;">
          <div style="padding:32px 32px 0 32px;">
            <p style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#5b6570;margin:0 0 8px 0;">
              Sniper Lens Global Networks
            </p>
            <h1 style="font-size:22px;color:#14181d;margin:0 0 16px 0;">
              Confirm your email address
            </h1>
            <p style="font-size:14px;line-height:1.6;color:#5b6570;margin:0 0 24px 0;">
              Hi ${name}, thanks for creating an account with us. Please confirm this is your email
              address to activate your account.
            </p>
          </div>
          <div style="padding:0 32px 32px 32px;">
            <a href="${verifyUrl}" style="display:inline-block;background-color:#fe5c04;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 28px;border-radius:999px;">
              Verify Email Address
            </a>
            <p style="font-size:12px;line-height:1.6;color:#96a0aa;margin:24px 0 0 0;">
              This link expires in 24 hours. If you did not create this account, you can safely
              ignore this email.
            </p>
          </div>
          <div style="padding:20px 32px;border-top:1px solid #dee1dc;">
            <p style="font-size:11px;color:#96a0aa;margin:0;">
              Sniper Lens Global Networks, Lagos, Nigeria.
            </p>
          </div>
        </div>
      </div>
    `,
  });
}
