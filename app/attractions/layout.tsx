import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata("Kodaikanal Attractions Guide | Apple Valley", "Plan outings around Kodaikanal with Apple Valley’s guide to Kodai Lake, Coaker’s Walk, Pillar Rocks, and Pine Forest.", '/attractions');

export default function AttractionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
