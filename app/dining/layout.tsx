import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dining & Add-ons | Apple Valley',
  description: 'Restaurant, candle light dinner, BBQ, campfire, room heater, sightseeing cab, and more add-on services.',
};

export default function DiningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
