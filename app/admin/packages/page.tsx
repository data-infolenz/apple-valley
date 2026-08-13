import Link from 'next/link';
import { Package, Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

type AdminPackage = {
  id: number;
  name: string;
  shortDescription: string;
  nights: number;
  maxOccupancy: number;
  price: number;
  featured: boolean;
  isActive: boolean;
};

export default async function AdminPackagesPage() {
  const packages: AdminPackage[] = await prisma.package.findMany({
    orderBy: [{ featured: 'desc' }, { price: 'asc' }],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-forest-800 dark:text-white">Packages</h1>
          <p className="text-forest-600 dark:text-mist-400">Manage stay packages shown on the website</p>
        </div>
        <Link href="/admin/packages/create">
          <Button className="bg-forest-600 hover:bg-forest-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Package
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <CardTitle className="flex items-start justify-between gap-3 text-forest-800 dark:text-white">
                <span>{pkg.name}</span>
                {pkg.featured && <Badge>Featured</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-forest-600 dark:text-mist-400">{pkg.shortDescription}</p>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div><p className="text-forest-500">Nights</p><p className="font-semibold">{pkg.nights}</p></div>
                <div><p className="text-forest-500">Guests</p><p className="font-semibold">{pkg.maxOccupancy}</p></div>
                <div><p className="text-forest-500">Price</p><p className="font-semibold">Rs. {pkg.price.toLocaleString()}</p></div>
              </div>
              <Badge variant="outline" className={pkg.isActive ? 'text-green-600 border-green-500' : 'text-red-600 border-red-500'}>
                {pkg.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </CardContent>
          </Card>
        ))}
        {packages.length === 0 && (
          <Card><CardContent className="p-8 text-center text-forest-500">No packages found</CardContent></Card>
        )}
      </div>
    </div>
  );
}
