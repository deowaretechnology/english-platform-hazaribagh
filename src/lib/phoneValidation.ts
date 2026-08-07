// src/lib/phoneValidation.ts
//
// Single source of truth for Indian mobile number validation.
// A valid Indian mobile number is exactly 10 digits and starts with
// 6, 7, 8, or 9 (no Indian mobile number starts with 0-5).
// This does NOT confirm the number is active/reachable — only that it's
// a structurally valid Indian mobile number. Real verification would
// require OTP (SMS), which is intentionally not used here.

const INDIAN_MOBILE_RE = /^[6-9]\d{9}$/;

export function isValidIndianMobile(phone: string): boolean {
  return INDIAN_MOBILE_RE.test(phone.trim());
}

export function getPhoneValidationError(phone: string): string | null {
  const cleaned = phone.trim();

  if (!cleaned) {
    return 'Kripya apna 10-digit mobile number darj karein.';
  }
  if (cleaned.length < 10) {
    return 'Mobile number 10 digit ka hona chahiye.';
  }
  if (cleaned.length > 10) {
    return 'Mobile number sirf 10 digit ka hona chahiye.';
  }
  if (!/^[6-9]/.test(cleaned)) {
    return 'Invalid mobile number. Number 6, 7, 8, ya 9 se shuru hona chahiye.';
  }
  if (!INDIAN_MOBILE_RE.test(cleaned)) {
    return 'Kripya valid 10-digit mobile number darj karein.';
  }
  return null; // valid
}