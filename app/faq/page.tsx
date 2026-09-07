import Link from 'next/link';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import StructuredData from '@/components/public/StructuredData';
import { guestFaqs } from '@/lib/guest-faqs';
import { pageMetadata, absoluteUrl } from '@/lib/seo';

export const metadata = pageMetadata('Stay Guide & FAQs | Apple Valley Kodaikanal', 'Plan your Apple Valley stay with answers about our Kodaikanal location, room types, restaurant, photos, bookings, and nearby attractions.', '/faq');

export default function FAQPage() {
  return <><Header /><main className="rooms-neu-scene min-h-screen text-forest-800 dark:text-white">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <nav aria-label="Breadcrumb" className="text-sm mb-8"><Link href="/">Home</Link><span aria-hidden="true"> / </span>Stay guide & FAQs</nav>
      <p className="uppercase tracking-[0.2em] text-sm mb-4 text-forest-600 dark:text-mist-300">Before you arrive</p>
      <h1 className="font-heading text-4xl sm:text-5xl mb-6">Your Apple Valley stay, explained.</h1>
      <p className="text-lg text-forest-600 dark:text-mist-300 mb-10">Apple Valley is a place to stay in Kodaikanal, Tamil Nadu, with several room categories and an in-house restaurant. Find practical answers to help plan your visit.</p>
      <div className="flex flex-wrap gap-3 mb-10">{[['Rooms', '/rooms'], ['Photo gallery', '/gallery'], ['Dining', '/dining'], ['Attractions', '/attractions']].map(([label, href]) => <Link key={href} href={href} className="rooms-neu-chip rounded-full px-5 py-3">{label}</Link>)}</div>
      <div className="space-y-5">{guestFaqs.map((faq) => <section key={faq.question} className="rooms-neu-panel rounded-2xl p-6 sm:p-8">
        <h2 className="font-heading text-xl sm:text-2xl mb-3">{faq.question}</h2><p className="text-forest-600 dark:text-mist-300 leading-relaxed">{faq.answer}</p>
      </section>)}</div>
      <section className="mt-10 rounded-2xl bg-forest-800 text-white p-8"><h2 className="font-heading text-2xl mb-3">Make the stay yours.</h2><p className="mb-6">For current availability, special requests, and reservation details, get in touch with our team.</p><div className="flex flex-wrap gap-4"><Link href="/contact" className="rounded-lg bg-white text-forest-900 px-6 py-3">Contact the property</Link><Link href="/booking" className="rounded-lg border border-white/40 px-6 py-3">Check availability</Link></div></section>
    </div>
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'FAQPage', url: absoluteUrl('/faq'),
      mainEntity: guestFaqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) }} />
  </main><Footer /></>;
}

