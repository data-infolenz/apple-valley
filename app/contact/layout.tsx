import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata("Contact Apple Valley | Kodaikanal Location & Enquiries", "Find Apple Valley on Anna Salai in Kodaikanal. Get directions and contact the property about reservations, availability, and special requests.", '/contact');

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
