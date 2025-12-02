import { prisma } from './prisma';
import crypto from 'crypto';

// Token expires in 24 hours
const VERIFICATION_TOKEN_EXPIRY_HOURS = 24;

// Password reset token expires in 1 hour
const PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 1;

/**
 * Generate a verification token for email verification
 */
export async function generateVerificationToken(email: string) {
  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  // Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  // Create new token
  const verificationToken = await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return verificationToken;
}

/**
 * Verify and consume a verification token
 * Returns the email if valid, null if invalid or expired
 */
export async function verifyToken(token: string) {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return null;
  }

  // Check if token has expired
  if (verificationToken.expires < new Date()) {
    // Delete expired token
    await prisma.verificationToken.delete({
      where: { token },
    });
    return null;
  }

  // Delete the token (one-time use)
  await prisma.verificationToken.delete({
    where: { token },
  });

  return verificationToken.identifier;
}

/**
 * Generate a password reset token
 */
export async function generatePasswordResetToken(email: string) {
  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  // Delete any existing password reset tokens for this email
  // We use a naming convention to distinguish: "reset:" prefix
  await prisma.verificationToken.deleteMany({
    where: { identifier: `reset:${email}` },
  });

  // Create new token
  const resetToken = await prisma.verificationToken.create({
    data: {
      identifier: `reset:${email}`,
      token,
      expires,
    },
  });

  return resetToken;
}

/**
 * Verify and consume a password reset token
 * Returns the email if valid, null if invalid or expired
 */
export async function verifyPasswordResetToken(token: string) {
  const resetToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    return null;
  }

  // Check if this is a password reset token
  if (!resetToken.identifier.startsWith('reset:')) {
    return null;
  }

  // Check if token has expired
  if (resetToken.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { token },
    });
    return null;
  }

  // Delete the token (one-time use)
  await prisma.verificationToken.delete({
    where: { token },
  });

  // Return email without the "reset:" prefix
  return resetToken.identifier.substring(6);
}

/**
 * Check if a verification token exists for an email (without consuming it)
 */
export async function hasValidVerificationToken(email: string) {
  const token = await prisma.verificationToken.findFirst({
    where: {
      identifier: email,
      expires: { gt: new Date() },
    },
  });

  return !!token;
}
