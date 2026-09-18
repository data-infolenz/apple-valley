'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
} from 'lucide-react';

const quickLinks = [
  { name: 'Rooms', href: '/rooms' },
  { name: 'Attractions', href: '/attractions' },
  { name: 'Packages', href: '/packages' },
  { name: 'Dining', href: '/dining' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Stay Guide & FAQs', href: '/faq' },
  { name: 'Contact', href: '/contact' },
];

const experiences = [
  { name: 'Kodai Lake Boating', href: '/attractions#kodai-lake' },
  { name: 'Pillar Rocks Viewpoint', href: '/attractions#pillar-rocks' },
  { name: 'Pine Forest Walk', href: '/attractions#pine-forest' },
  { name: 'Guna Caves Adventure', href: '/attractions#guna-caves' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/src/apple%20logo.png" alt="Apple Valley Resort logo" width={76} height={60} className="h-12 w-[61px] md:h-16 md:w-[81px] rounded-lg bg-white object-contain p-1 shrink-0" />
              <div>
                <h3 className="font-heading text-xl font-semibold">Apple Valley</h3>
                <p className="text-xs text-mist-400 tracking-wider uppercase">HOTEL</p>
              </div>
            </div>
            <p className="text-mist-300 text-sm leading-relaxed mb-6">
              Experience premium hospitality in the misty hills of Kodaikanal. Lake views, cozy rooms, and peaceful hill-station comfort.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/share/14oqk8HxTGN/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-forest-800 hover:bg-forest-700 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-forest-800 hover:bg-forest-700 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-forest-800 hover:bg-forest-700 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-forest-800 hover:bg-forest-700 flex items-center justify-center transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-mist-300 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Experiences */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Experiences</h4>
            <ul className="space-y-2">
              {experiences.map((exp) => (
                <li key={exp.name}>
                  <Link
                    href={exp.href}
                    className="text-mist-300 hover:text-white text-sm transition-colors"
                  >
                    {exp.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 text-walnut-400 shrink-0" />
                <span className="text-mist-300 text-sm">
                  Anna Salai, Opposite the KodaiPolice Station,<br />
                Kodaikanal, Tamil Nadu 624101
                </span>
              </li>
              <li>
                <a
                  href="tel:+919488401385"
                  className="flex items-center gap-3 text-mist-300 hover:text-white text-sm transition-colors"
                >
                  <Phone className="w-4 h-4 text-walnut-400" />
                  +91 94884 01385
                </a>
              </li>
              <li>
                <a
                  href="mailto:stay@hotelapplevalley.com"
                  className="flex items-center gap-3 text-mist-300 hover:text-white text-sm transition-colors"
                >
                  <Mail className="w-4 h-4 text-walnut-400" />
                  stay@hotelapplevalley.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-mist-300 text-sm">
                <Clock className="w-4 h-4 text-walnut-400" />
                <span>Check-in: 10:00 AM | Check-out: 9:00 AM</span>
              </li>
            </ul>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919488401385?text=Hi,%20I%20would%20like%20to%20inquire%20about%20booking%20at%20Apple%20Valley"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-forest-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-mist-400 text-sm">
               © DataInfolenZ . All rights reserved. {currentYear}
            </p>
            <div className="flex items-center gap-6 text-sm text-mist-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/cancellation" className="hover:text-white transition-colors">
                Cancellation Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
