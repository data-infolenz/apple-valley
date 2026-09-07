import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata("Kodaikanal Stay Packages | Apple Valley", "Explore Apple Valley stay packages for couples and families in Kodaikanal. Review package details and enquire about availability for your dates.", '/packages');

export default function PackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
