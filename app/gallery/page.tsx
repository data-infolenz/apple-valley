import Link from 'next/link';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import Gallery from '@/components/public/Gallery';
import StructuredData from '@/components/public/StructuredData';
import { pageMetadata, absoluteUrl } from '@/lib/seo';
import { galleryImages } from '@/lib/gallery-images';

export const metadata = pageMetadata('Photo Gallery | Apple Valley Kodaikanal', 'Explore Apple Valley photos of guest rooms, suites, reception, and the in-house restaurant. Take a closer look before planning your Kodaikanal stay.', '/gallery');

export default function GalleryPage() {
  return <><Header /><main className="rooms-neu-scene min-h-screen text-forest-800 dark:text-white">
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <nav aria-label="Breadcrumb" className="text-sm mb-8"><Link href="/">Home</Link><span aria-hidden="true"> / </span>Gallery</nav>
      <p className="text-sm uppercase tracking-[0.2em] text-forest-600 dark:text-mist-300 mb-4">A closer look</p>
      <h1 className="font-heading text-4xl sm:text-6xl mb-5">Picture your stay.</h1>
      <p className="max-w-2xl text-lg text-forest-600 dark:text-mist-300 mb-10">Explore Apple Valley in Kodaikanal, from our guest rooms and welcoming reception to meals in our in-house restaurant.</p>
      <Gallery />
      <div className="rooms-neu-panel rounded-2xl p-8 mt-12 flex flex-wrap items-center justify-between gap-6">
        <div><h2 className="font-heading text-2xl mb-2">Found your kind of getaway?</h2><p>Explore our rooms and choose a stay that suits you.</p></div>
        <Link href="/rooms" className="rooms-neu-button rounded-lg px-6 py-3">Explore rooms →</Link>
      </div>
    </section>
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'ImageGallery', name: 'Apple Valley photo gallery', url: absoluteUrl('/gallery'),
      image: galleryImages.map((photo) => ({ '@type': 'ImageObject', contentUrl: absoluteUrl(photo.src) || photo.src, caption: photo.title })) }} />
  </main><Footer /></>;
}
