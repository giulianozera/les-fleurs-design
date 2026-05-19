import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Les Fleurs Design — Luxury Eternal Roses',
    template: '%s | Les Fleurs Design',
  },
  description:
    'Preserved roses that last one year, presented in handcrafted ceramic vessels. For gifts, hotels, restaurants, and the spaces that demand distinction.',
  keywords: ['preserved roses', 'eternal roses', 'luxury flowers', 'ceramic pots', 'Les Fleurs Design'],
  metadataBase: new URL('https://lesfleursdesign.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lesfleursdesign.com',
    siteName: 'Les Fleurs Design',
    title: 'Les Fleurs Design — Luxury Eternal Roses',
    description: 'Preserved roses that last one year, presented in handcrafted ceramic vessels.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Les Fleurs Design',
    description: 'Quiet luxury, in full bloom.',
  },
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-ivory text-charcoal antialiased">
        {children}
      </body>
    </html>
  );
}
