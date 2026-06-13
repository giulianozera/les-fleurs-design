// Escape a string for safe interpolation into HTML (email bodies, etc.).
// User-supplied values — names, messages, emails — must never be dropped into
// HTML markup raw, or a bot can inject links, tracking pixels, or markup into
// the admin inbox / transactional mail.
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
