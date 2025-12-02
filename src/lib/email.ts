import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// For production, change this to your verified domain email
// For testing, use 'onboarding@resend.dev'
const FROM_EMAIL = 'The Fiscal Wire <info@thefiscalwire.com>';

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${APP_URL}/api/auth/verify-email?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Verify your email for The Fiscal Wire',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; padding: 40px 20px; margin: 0;">
          <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="font-size: 24px; font-weight: 700; color: #18181b; margin: 0;">The Fiscal Wire</h1>
            </div>

            <h2 style="font-size: 20px; font-weight: 600; color: #18181b; margin: 0 0 16px;">Verify your email address</h2>

            <p style="font-size: 16px; color: #52525b; line-height: 1.6; margin: 0 0 24px;">
              Thanks for signing up! Please click the button below to verify your email address and activate your account.
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${verificationLink}" style="display: inline-block; background-color: #18181b; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 6px;">
                Verify Email
              </a>
            </div>

            <p style="font-size: 14px; color: #71717a; line-height: 1.6; margin: 0 0 16px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>

            <p style="font-size: 14px; color: #3b82f6; word-break: break-all; margin: 0 0 24px;">
              ${verificationLink}
            </p>

            <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 24px 0;">

            <p style="font-size: 12px; color: #a1a1aa; line-height: 1.5; margin: 0;">
              This verification link will expire in 24 hours. If you didn't create an account with The Fiscal Wire, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }

  return data;
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${APP_URL}/reset-password?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Reset your password for The Fiscal Wire',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; padding: 40px 20px; margin: 0;">
          <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="font-size: 24px; font-weight: 700; color: #18181b; margin: 0;">The Fiscal Wire</h1>
            </div>

            <h2 style="font-size: 20px; font-weight: 600; color: #18181b; margin: 0 0 16px;">Reset your password</h2>

            <p style="font-size: 16px; color: #52525b; line-height: 1.6; margin: 0 0 24px;">
              We received a request to reset your password. Click the button below to create a new password.
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetLink}" style="display: inline-block; background-color: #18181b; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 6px;">
                Reset Password
              </a>
            </div>

            <p style="font-size: 14px; color: #71717a; line-height: 1.6; margin: 0 0 16px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>

            <p style="font-size: 14px; color: #3b82f6; word-break: break-all; margin: 0 0 24px;">
              ${resetLink}
            </p>

            <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 24px 0;">

            <p style="font-size: 12px; color: #a1a1aa; line-height: 1.5; margin: 0;">
              This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }

  return data;
}
