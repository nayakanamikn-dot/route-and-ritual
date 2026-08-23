import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://route-and-ritual.netlify.app'),
  title: 'Route & Ritual | Travel Atelier',
  description: 'A considered package-building workspace for modern travel advisors.',
  openGraph: {
    title: 'Route & Ritual | Travel Atelier',
    description: 'Thoughtful journeys, shaped with care.',
    images: [{ url: '/og-github.jpg', width: 800, height: 533, alt: 'Route & Ritual travel atelier' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Route & Ritual | Travel Atelier',
    description: 'Thoughtful journeys, shaped with care.',
    images: ['/og-github.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${cormorant.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
