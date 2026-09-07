# Search setup

Set `SITE_URL` in the deployment environment to the verified public origin (HTTPS scheme and domain, without a path), then rebuild. `NEXT_PUBLIC_SITE_URL` is also supported. With neither set, absolute canonical and social image URLs are omitted and the sitemap has no entries, to avoid publishing an invented domain.

Public content routes use page-specific titles, descriptions, Open Graph and Twitter metadata. `/gallery` contains property photos and ImageGallery structured data. `/faq` provides visible answers and matching FAQPage structured data. Hotel structured data includes the existing property name and address; conflicting phone numbers, check-in times, and unverified ratings are deliberately excluded.

After setting the domain, check `/sitemap.xml` and submit it through the site's verified Google Search Console account. Check the deployed canonical URLs and social image URLs. Confirm the authoritative phone, email, check-in/out times, and policies and make them consistent across existing pages before expanding the FAQ.

`/admin`, `/customer`, `/booking`, and `/api` have noindex response headers and are excluded from the sitemap. Robots exclusions are crawl guidance, not access control.

References: [Next.js metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [Next.js sitemaps](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap), [Google structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data). Structured data and answer-focused content do not guarantee rankings or inclusion in AI answers.
