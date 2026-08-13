import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const reviews = [
  { guest: 'Akram', rating: 5, comment: 'Good stay and helpful staff', status: 'published' },
  { guest: 'Priya Sharma', rating: 5, comment: 'Beautiful location and clean rooms', status: 'published' },
  { guest: 'Rahul Menon', rating: 4, comment: 'Nice family experience', status: 'pending' },
];

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-forest-800 dark:text-white">Reviews</h1>
        <p className="text-forest-600 dark:text-mist-400">Guest feedback and publishing status</p>
      </div>
      <div className="space-y-3">
        {reviews.map((review) => (
          <Card key={`${review.guest}-${review.comment}`}>
            <CardContent className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-forest-800 dark:text-white">{review.guest}</p>
                <p className="text-sm text-forest-600 dark:text-mist-400">{review.comment}</p>
                <div className="flex mt-2">{Array.from({ length: review.rating }).map((_, index) => <Star key={index} className="w-4 h-4 fill-walnut-500 text-walnut-500" />)}</div>
              </div>
              <Badge variant="outline" className="capitalize">{review.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
