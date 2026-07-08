import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nearby Attractions | Apple Valley',
  description: 'Explore Kodaikanal\'s best attractions - Kodai Lake, Coaker\'s Walk, Pillar Rocks, Pine Forest, and more.',
};

export default function AttractionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
