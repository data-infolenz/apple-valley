import type { MetadataRoute } from 'next';
import { absoluteUrl, publicPaths, siteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  return publicPaths.map((path) => ({ url: absoluteUrl(path)!, changeFrequency: 'monthly', priority: path === '/' ? 1 : 0.7 }));
}

