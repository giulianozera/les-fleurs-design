import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact — Les Fleurs Design',
  description: 'Get in touch with Les Fleurs Design.',
};

export default function ContactPage() {
  return <ContactForm />;
}
