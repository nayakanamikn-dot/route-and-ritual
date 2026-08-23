import type { Metadata } from 'next';
import { Open_Sans, Poppins } from 'next/font/google';
import './globals.css';

const openSans = Open_Sans({
  variable: '--font-body',
  subsets: ['latin'],
});

const poppins = Poppins({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://route-and-ritual.netlify.app'),
  title: 'Route & Ritual | Travel Atelier',
  description: 'A considered package-building workspace for modern travel advisors.',
  openGraph: {
    title: 'Route & Ritual | Travel Atelier',
    description: 'Thoughtful journeys, shaped with care.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Route & Ritual luxury travel atelier' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Route & Ritual | Travel Atelier',
    description: 'Thoughtful journeys, shaped with care.',
    images: ['/og.png'],
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
        className={`${openSans.variable} ${poppins.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
