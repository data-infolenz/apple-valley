import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata("Restaurant & Dining in Kodaikanal | Apple Valley", "Explore Apple Valley’s in-house restaurant, candlelight dinners, BBQ experiences, and celebration add-ons for your Kodaikanal stay.", '/dining');

export default function DiningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
