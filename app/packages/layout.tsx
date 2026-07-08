import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Packages & Offers | Apple Valley',
  description: 'Exclusive stay packages for couples, families, and corporate groups. Best value for your Kodaikanal vacation.',
};

export default function PackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
