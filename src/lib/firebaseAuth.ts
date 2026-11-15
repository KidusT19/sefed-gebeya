import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  UserCredential,
} from "firebase/auth";
import { auth } from "./firebase";

// Helper to format any Ethiopian phone input to E.164 (+251...)
export function formatEthiopianPhone(input: string): string {
  const clean = input.replace(/\D/g, "").replace(/^0/, "").replace(/^251/, "");
  return `+251${clean}`;
}

// Validate whether a number is a valid 9-digit Ethiopian mobile (9... for Ethio Tel, 7... for Safaricom)
export function isValidEthiopianMobile(input: string): boolean {
  const clean = input.replace(/\D/g, "").replace(/^0/, "").replace(/^251/, "");
  return clean.length === 9 && (clean.startsWith("9") || clean.startsWith("7"));
}

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

// Initialize reCAPTCHA verifier on a container element
export function setupRecaptcha(containerId = "recaptcha-container"): RecaptchaVerifier {
  if (typeof window === "undefined") {
    throw new Error("reCAPTCHA can only be initialized in the browser.");
  }

  // Clear existing verifier if any
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch {
      // ignore
    }
  }

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved
    },
    "expired-callback": () => {
      // Response expired
    },
  });

  window.recaptchaVerifier = verifier;
  return verifier;
}

// Send OTP code via Firebase Phone Auth
export async function sendFirebasePhoneOtp(
  phoneNumberE164: string,
  containerId = "recaptcha-container"
): Promise<{ success: boolean; confirmationResult?: ConfirmationResult; error?: string }> {
  try {
    const appVerifier = setupRecaptcha(containerId);
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumberE164, appVerifier);
    window.confirmationResult = confirmationResult;
    return { success: true, confirmationResult };
  } catch (err: any) {
    console.warn("Firebase Phone Auth SMS attempt:", err?.message || err);
    return {
      success: false,
      error: err?.message || "Failed to send verification SMS via Firebase.",
    };
  }
}

// Confirm OTP code entered by the user
export async function verifyFirebaseOtp(
  code: string,
  customConfirmation?: ConfirmationResult
): Promise<{ success: boolean; user?: UserCredential["user"]; error?: string }> {
  try {
    const confirmation = customConfirmation || window.confirmationResult;
    if (!confirmation) {
      return { success: false, error: "No active verification session. Please request a new code." };
    }

    const result = await confirmation.confirm(code);
    return { success: true, user: result.user };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Invalid or expired verification code.",
    };
  }
}
