import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata("Rooms & Suites in Kodaikanal | Apple Valley", "Compare Deluxe, Super Deluxe, Triple Deluxe, Honeymoon Suite, and Family Suite rooms at Apple Valley in Kodaikanal. Explore photos and check availability.", '/rooms');

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
