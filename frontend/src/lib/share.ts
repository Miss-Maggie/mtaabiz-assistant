/**
 * Generate a WhatsApp share URL
 * @param text - The text to share
 * @returns WhatsApp URL that opens with pre-filled text
 */
export function getWhatsAppShareUrl(text: string): string {
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/?text=${encodedText}`;
}

/**
 * Open WhatsApp with pre-filled text
 * @param text - The text to share
 */
export function shareToWhatsApp(text: string): void {
  const url = getWhatsAppShareUrl(text);
  window.open(url, '_blank', 'noopener,noreferrer');
}
