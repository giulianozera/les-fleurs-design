export interface MailingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export const mailingAddress: MailingAddress = {
  // TODO: confirm exact street / registered agent address before launch.
  street: 'TODO: confirm mailing address / registered agent address',
  city: 'Miami',
  state: 'FL',
  zip: '',
  country: 'USA',
};

export function formatMailingAddress(addr: MailingAddress = mailingAddress): string {
  return [addr.street, [addr.city, addr.state, addr.zip].filter(Boolean).join(', '), addr.country]
    .filter(Boolean)
    .join(', ');
}

export const legalName = 'Les Fleurs MDR LLC';
export const supportEmail = 'hello@lesfleursdesign.com';

export const siteConfig = {
  legalName,
  mailingAddress,
  supportEmail,
  formatMailingAddress,
} as const;

export type SiteConfig = typeof siteConfig;
