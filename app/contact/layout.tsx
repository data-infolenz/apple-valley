import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Apple Valley',
  description: 'Get in touch with Apple Valley for bookings, enquiries, and support. Located in Kodaikanal, Tamil Nadu.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
