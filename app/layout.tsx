import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { pageMetadata, siteUrl, absoluteUrl } from '@/lib/seo';
import StructuredData from '@/components/public/StructuredData';

const defaults = pageMetadata('Apple Valley Kodaikanal | Rooms, Dining & Hill Station Stays',
  'Plan your stay at Apple Valley in Kodaikanal. Explore rooms and suites, in-house dining, property photos, and answers to common booking questions.', '/');
export const metadata: Metadata = {
  ...defaults,
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  // Route layouts supply their own canonical; never inherit the home URL.
  alternates: undefined,
  openGraph: { ...defaults.openGraph, url: undefined },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body className="min-h-screen font-body antialiased">
        <StructuredData data={{ '@context': 'https://schema.org', '@type': 'Hotel',
          name: 'Apple Valley', url: absoluteUrl('/'), image: absoluteUrl('/landing%20page/front.png'),
          address: { '@type': 'PostalAddress', streetAddress: 'Anna Salai, Opposite the Police Station, Municipal Colony',
            addressLocality: 'Kodaikanal', addressRegion: 'Tamil Nadu', postalCode: '624101', addressCountry: 'IN' } }} />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
