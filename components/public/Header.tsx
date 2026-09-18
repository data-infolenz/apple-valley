'use client';

import { useState, useEffect, type MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Rooms', href: '/rooms' },
  { name: 'Attractions', href: '/attractions' },
  { name: 'Packages', href: '/packages' },
  { name: 'Dining & Add-ons', href: '/dining' },
  { name: 'Reviews', href: '/reviews' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact', href: '/contact' },
  { name: 'Admin', href: '/admin' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  const selectNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    setMobileMenuOpen(false);
  };
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="hidden md:block bg-gradient-to-b from-green-700 to-green-900 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end items-center gap-8">
          <div className="flex items-center gap-6">
            <a href="tel:+919488401385" className="flex items-center gap-1 hover:text-walnut-300 transition-colors">
              <Phone className="w-3.5 h-3.5" />
              <span>+91 9488401385</span>
            </a>
            <a href="mailto:stay@hotelapplevalley.com" className="flex items-center gap-1 hover:text-walnut-300 transition-colors">
              <Mail className="w-3.5 h-3.5" />
              <span>stay@hotelapplevalley.com</span>
            </a>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Kodaikanal, Tamil Nadu</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-forest-950/95 backdrop-blur-md shadow-lg'
            : 'bg-white/95 dark:bg-transparent backdrop-blur-md dark:backdrop-blur-0 shadow-sm dark:shadow-none'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" onClick={selectNavigation} className="flex items-center gap-2">
              <Image src="/src/apple%20logo.png" alt="Apple Valley Resort logo" width={76} height={60} loading="eager" className="h-12 w-[61px] md:h-16 md:w-[81px] rounded-lg bg-white object-contain p-1 shrink-0" />
              <div className="hidden sm:block">
                <p className={`font-heading text-xl font-semibold ${scrolled ? 'text-forest-800 dark:text-white' : 'text-forest-800 dark:text-white'}`}>
                  Apple Valley
                </p>
                <p className={`text-xs tracking-wider uppercase ${scrolled ? 'text-forest-600 dark:text-mist-400' : 'text-forest-600 dark:text-white/80'}`}>
                  Hotel
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={selectNavigation}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`px-2 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? scrolled
                        ? 'text-forest-700 bg-forest-50 dark:text-forest-300 dark:bg-forest-900/50'
                        : 'text-forest-700 bg-forest-50 dark:text-white dark:bg-white/20'
                      : scrolled
                        ? 'text-forest-600 hover:text-forest-800 hover:bg-forest-50 dark:text-mist-300 dark:hover:text-white dark:hover:bg-forest-900/50'
                        : 'text-forest-700 hover:text-forest-900 hover:bg-forest-50 dark:text-white/90 dark:hover:text-white dark:hover:bg-white/20'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Book Now Button */}
              <Link href="/booking">
                <Button className="hidden sm:flex bg-walnut-600 hover:bg-walnut-700 text-white">
                  Book Now
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`xl:hidden p-2 rounded-lg ${
                  scrolled
                    ? 'text-forest-800 dark:text-white'
                    : 'text-forest-800 dark:text-white'
                }`}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 xl:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-forest-950 z-50 xl:hidden shadow-2xl"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-xl font-semibold text-forest-800 dark:text-white">
                    Menu
                  </h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-forest-600 hover:bg-forest-50 dark:text-mist-300 dark:hover:bg-forest-900/50"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={selectNavigation}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? 'text-forest-700 bg-forest-50 dark:text-forest-300 dark:bg-forest-900/50'
                          : 'text-forest-600 hover:text-forest-800 hover:bg-forest-50 dark:text-mist-300 dark:hover:text-white dark:hover:bg-forest-900/50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-forest-100 dark:border-forest-800">
                  <Link href="/booking" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-walnut-600 hover:bg-walnut-700 text-white">
                      Book Your Stay
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 space-y-3 text-sm text-forest-600 dark:text-mist-400">
                  <a href="tel:+919361979918" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>+91 93619 79918</span>
                  </a>
                  <a href="mailto:info@applevalley.com" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>info@applevalley.com</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
