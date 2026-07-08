'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import kodaiHomePageImage from '@/components/public/src/img/kodai home page.jpg';

const whatsappNumber = '919361979918';

const faqs = [
  {
    question: 'What are the check-in and check-out times?',
    answer: 'Check-in is at 2:00 PM and check-out is at 11:00 AM. Early check-in and late check-out can be arranged based on availability with prior request.',
  },
  {
    question: 'Is parking available at the property?',
    answer: 'Yes, we have free on-site parking for all guests. The parking area is secure and can accommodate cars and bikes.',
  },
  {
    question: 'Do you provide room heaters?',
    answer: 'Yes, all rooms come with standard room heaters. During peak winter (November-February), additional heaters can be arranged at ₹300 per night.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Free cancellation is available up to 3 days before check-in. Cancellations within 3 days incur 20% charge. No refund for same-day cancellations or no-shows.',
  },
  {
    question: 'Is the property child-friendly?',
    answer: 'Absolutely! We welcome families with children. cribs, extra beds, and kids activity kits are available on request.',
  },
  {
    question: 'Do you arrange sightseeing tours?',
    answer: 'Yes, we can arrange both half-day and full-day sightseeing cab packages. Our drivers are knowledgeable locals who know the best spots.',
  },
  {
    question: 'Is WiFi available?',
    answer: 'Yes, complimentary high-speed WiFi is available throughout the property.',
  },
  {
    question: 'Can I request early check-in or late check-out?',
    answer: 'Early check-in (from 12 PM) and late check-out (till 2 PM) are complimentary based on availability. Please request at the time of booking.',
  },
];

const contactInfo = [
  {
    icon: MapPin,
    title: 'Address',
    content: ['Anna Salai, Opposite the Police Station', 'Municipal Colony, Kodaikanal, Tamil Nadu 624101'],
  },
  {
    icon: Phone,
    title: 'Phone',
    content: ['+91 93619 79918', '+91 4542 240123'],
  },
  {
    icon: Mail,
    title: 'Email',
    content: ['info@applevalley.com', 'reservations@applevalley.com'],
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: '',
    message: '',
  });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const enquiryMessage = [
      'Hi Apple Valley, I would like to send an enquiry.',
      '',
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone}`,
      `Enquiry Type: ${formData.enquiryType || 'General'}`,
      '',
      `Message: ${formData.message}`,
    ].join('\n');

    toast.success('Opening WhatsApp with your enquiry message.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      enquiryType: '',
      message: '',
    });
    setIsSubmitting(false);
    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(enquiryMessage)}`;
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-forest-950">
      <Header />

      {/* Hero */}
      <section className="relative h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src={kodaiHomePageImage.src}
            alt="Contact"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl sm:text-5xl font-bold mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/80 max-w-2xl mx-auto"
          >
            We&apos;re here to help with your queries and bookings
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {contactInfo.map((info) => (
                  <Card key={info.title}>
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-forest-100 dark:bg-forest-800 flex items-center justify-center shrink-0">
                        <info.icon className="w-6 h-6 text-forest-600 dark:text-forest-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-forest-800 dark:text-white mb-1">
                          {info.title}
                        </h3>
                        {info.content.map((line, i) => (
                          <p key={i} className="text-forest-600 dark:text-mist-400 text-sm">
                            {line}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Timings */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-walnut-600" />
                      <h3 className="font-semibold text-forest-800 dark:text-white">
                        Timings
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-forest-600 dark:text-mist-400">Check-in</span>
                        <span className="font-medium text-forest-800 dark:text-white">2:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600 dark:text-mist-400">Check-out</span>
                        <span className="font-medium text-forest-800 dark:text-white">11:00 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600 dark:text-mist-400">Reception</span>
                        <span className="font-medium text-forest-800 dark:text-white">24/7</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600 dark:text-mist-400">Restaurant</span>
                        <span className="font-medium text-forest-800 dark:text-white">7 AM - 10 PM</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* WhatsApp CTA */}
                <a
                  href="https://wa.me/919361979918?text=Hi,%20I%20would%20like%20to%20inquire%20about%20booking%20at%20Apple%20Valley"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="bg-green-600 hover:bg-green-700 transition-colors">
                    <CardContent className="p-6 flex items-center justify-center gap-3 text-white">
                      <MessageCircle className="w-6 h-6" />
                      <span className="font-semibold">Chat on WhatsApp</span>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            </div>

            {/* Enquiry Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardContent className="p-6 sm:p-8">
                    <h2 className="font-heading text-2xl font-semibold text-forest-800 dark:text-white mb-6">
                      Send us an Enquiry
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-forest-700 dark:text-mist-300">
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            type="text"
                            required
                            placeholder="Your name"
                            className="mt-1"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-forest-700 dark:text-mist-300">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            placeholder="your@email.com"
                            className="mt-1"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone" className="text-forest-700 dark:text-mist-300">
                            Phone Number *
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            required
                            placeholder="+91 93619 79918"
                            className="mt-1"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label className="text-forest-700 dark:text-mist-300">
                            Enquiry Type
                          </Label>
                          <Select
                            value={formData.enquiryType}
                            onValueChange={(value) => setFormData({ ...formData, enquiryType: value })}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select enquiry type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="room_booking">Room Booking</SelectItem>
                              <SelectItem value="package_booking">Package Booking</SelectItem>
                              <SelectItem value="group_booking">Group Booking</SelectItem>
                              <SelectItem value="event_inquiry">Event Enquiry</SelectItem>
                              <SelectItem value="general">General Query</SelectItem>
                              <SelectItem value="feedback">Feedback</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="message" className="text-forest-700 dark:text-mist-300">
                          Your Message *
                        </Label>
                        <Textarea
                          id="message"
                          required
                          placeholder="Tell us about your requirements, dates, number of guests, etc."
                          className="mt-1 min-h-[150px]"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full sm:w-auto bg-forest-600 hover:bg-forest-700 text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          'Sending...'
                        ) : (
                          <>
                            Send Enquiry
                            <Send className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-forest-50 dark:bg-forest-900 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">Location</Badge>
            <h2 className="font-heading text-3xl font-bold text-forest-800 dark:text-white">
              Find Us in Kodaikanal
            </h2>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4028380563726!2d77.49846747478875!3d10.235243789848593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07dea1c8!2sKodaikanal%20Lake!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-xl"
              title="Apple Valley Location Map"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">FAQs</Badge>
            <h2 className="font-heading text-3xl font-bold text-forest-800 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-forest-50 dark:hover:bg-forest-800 transition-colors"
                  >
                    <span className="font-medium text-forest-800 dark:text-white">
                      {faq.question}
                    </span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-forest-600 dark:text-mist-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-forest-600 dark:text-mist-400 shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4">
                      <p className="text-forest-600 dark:text-mist-400 text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
