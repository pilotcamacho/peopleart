import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Playfair_Display } from 'next/font/google';
import './globals.css';
import AmplifyProvider from '@/components/providers/AmplifyProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: {
    default: 'PeopleArt — Live Beauty',
    template: '%s | PeopleArt',
  },
  description:
    'PeopleArt transforms how enterprises operate by treating human interaction as an artistic discipline. Corporate HQ of the Propiología ecosystem.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={`${geistSans.variable} ${playfair.variable} font-sans antialiased`}>
        <AmplifyProvider>{children}</AmplifyProvider>
      </body>
    </html>
  );
}
