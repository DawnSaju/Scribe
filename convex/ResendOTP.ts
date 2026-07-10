import Resend from "@auth/core/providers/resend";
import type { EmailUserConfig } from "@auth/core/providers/email";

export function ResendOTP(config: EmailUserConfig = {}) {
  return Resend({
    id: "resend-otp",
    apiKey: process.env.AUTH_RESEND_KEY,
    async generateVerificationToken() {
      const buffer = new Uint8Array(8);
      let token = "";
      while (token.length < 6) {
        crypto.getRandomValues(buffer);
        for (let i = 0; i < buffer.length && token.length < 6; i++) {
          if (buffer[i] < 250) {
            token += (buffer[i] % 10).toString();
          }
        }
      }
      return token;
    },
    async sendVerificationRequest({ identifier: email, provider, token }) {
      const fromEmail = process.env.AUTH_EMAIL_FROM;
      if (!fromEmail) {
        throw new Error(
          "AUTH_EMAIL_FROM environment variable is required to send emails."
        );
      }

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${provider.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: email,
          subject: "Sign in to Scribe",
          text: `Your verification code is ${token}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1E78FF;">Sign in to Scribe</h2>
              <p>Hi there,</p>
              <p>Please use the following verification code to securely log in to your Scribe account:</p>
              <div style="background-color: #f4f4f5; padding: 16px; border-radius: 8px; margin: 24px 0; text-align: center;">
                <span style="font-family: monospace; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #18181b;">
                  ${token}
                </span>
              </div>
              <p style="color: #71717a; font-size: 14px;">If you didn't request this code, you can safely ignore this email.</p>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Resend API error:", response.status, errorText);
        throw new Error(`Failed to send verification email: ${errorText}`);
      }
    },
    ...config,
  });
}
