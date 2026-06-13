// Single source of truth for the honeypot field name, shared by the client
// component and the server-side check. Kept in its own tiny module so client
// components can import it without pulling in the rest of the anti-spam code.
export const HONEYPOT_FIELD = 'company_website';
