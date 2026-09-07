import type { Metadata } from 'next';

// Set SITE_URL to the verified production origin before deployment.
const configuredUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
export const siteUrl = configuredUrl ? new URL(configuredUrl).origin : undefined;
export const absoluteUrl = (path: string) => siteUrl ? new URL(path, siteUrl).toString() : undefined;

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = absoluteUrl(path);
  const image = absoluteUrl('/landing%20page/front.png');
  return {
    title, description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: { title, description, type: 'website', siteName: 'Apple Valley', locale: 'en_IN',
      ...(url ? { url } : {}), ...(image ? { images: [{ url: image, alt: 'Apple Valley in Kodaikanal' }] } : {}) },
    twitter: { card: 'summary_large_image', title, description, ...(image ? { images: [image] } : {}) },
  };
}
export const publicPaths = ['/', '/rooms', '/dining', '/packages', '/attractions', '/contact', '/gallery', '/faq'];

