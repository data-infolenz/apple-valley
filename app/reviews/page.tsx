import { Star } from 'lucide-react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { testimonials } from '@/lib/testimonials';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('Guest Reviews | Apple Valley', 'Read guest experiences from stays at Apple Valley in Kodaikanal.', '/reviews');

export default function ReviewsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="rooms-neu-scene py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-semibold text-forest-800 dark:text-white text-center mb-12">Guest Reviews</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="rooms-neu-panel p-6 sm:p-8 flex flex-col">
                <div className="rooms-neu-chip self-start rounded-full px-3 py-2 flex gap-1 mb-5" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {Array.from({ length: testimonial.rating }, (_, index) => (
                    <Star key={index} aria-hidden="true" className="w-5 h-5 fill-walnut-400 text-walnut-400" />
                  ))}
                </div>
                <blockquote className="text-forest-700 dark:text-mist-300 mb-6 italic">&ldquo;{testimonial.text}&rdquo;</blockquote>
                <div className="mt-auto">
                  <p className="font-semibold text-forest-800 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-forest-500 dark:text-mist-400">{testimonial.location}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
