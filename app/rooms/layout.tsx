import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rooms & Suites | Apple Valley',
  description: 'Explore our premium rooms and suites with misty hill views, lake views, and cozy amenities.',
};

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
