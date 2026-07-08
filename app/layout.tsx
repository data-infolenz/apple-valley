import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Apple Valley | Stay Above the Clouds',
  description: 'Book your perfect stay in the misty hills of Kodaikanal. Lake views, cozy rooms, and peaceful hill-station comfort await you.',
  keywords: 'Kodaikanal hotel, hill station resort, lake view rooms, Apple Valley',
  openGraph: {
    title: 'Apple Valley | Stay Above the Clouds',
    description: 'Experience premium hospitality in the misty hills of Kodaikanal.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
