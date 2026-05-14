import type { Metadata } from 'next';
import './globals.css';
import AmplifyProvider from '@/components/providers/AmplifyProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.peopleart.co'),
  title: {
    default: 'PeopleArt — Live Beauty',
    template: '%s | PeopleArt',
  },
  description:
    'PeopleArt transforms how enterprises operate by treating human interaction as an artistic discipline. Corporate HQ of the Propiología ecosystem.',
  openGraph: {
    siteName: 'PeopleArt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <AmplifyProvider>{children}</AmplifyProvider>;
}
