/**
 * Sanitizer mirrors the Kotlin Sanitizer.kt implementation:
 * Masks OTPs, card numbers, and email fragments in notification preview text.
 */
export function sanitizeNotificationText(text: string): string {
  if (!text) return '';

  let sanitized = text;

  // Mask 4-8 digit OTPs / verification codes
  sanitized = sanitized.replace(/(?:code|otp|pin|verification)[\s:]*(\d{4,8})/gi, (match, digits) => {
    return match.replace(digits, '••••••');
  });

  // Mask credit card sequences
  sanitized = sanitized.replace(/\b(?:\d[ -]*?){13,16}\b/g, '••••-••••-••••-••••');

  // Mask email handles
  sanitized = sanitized.replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, (_m, user, domain) => {
    const visible = user.slice(0, 2);
    return `${visible}•••@${domain}`;
  });

  return sanitized;
}

export function maskPhoneNumber(phone: string): string {
  if (!phone || phone.length < 5) return '••••';
  const clean = phone.trim();
  const start = clean.slice(0, clean.indexOf(')') !== -1 ? clean.indexOf(')') + 2 : 4);
  const end = clean.slice(-4);
  return `${start} •••-${end}`;
}
