import type { Metadata } from 'next';
import { Lora, Playfair_Display } from 'next/font/google';
import '../styles/globals.css';

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Graduate Programs Office',
  description: 'Graduate Programs Office landing page',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lora.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
