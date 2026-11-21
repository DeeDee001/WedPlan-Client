'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, HeartHandshake, Award, Sparkles, Clock, CreditCard } from 'lucide-react';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Strictly Verified Vendors',
    description: 'Every vendor profile and service undergoes manual review to ensure top-notch quality and authenticity.'
  },
  {
    icon: HeartHandshake,
    title: 'Direct Vendor Connection',
    description: 'Communicate directly with service providers, check date availability, and tailor packages without intermediaries.'
  },
  {
    icon: Award,
    title: 'Transparent Pricing',
    description: 'Upfront rates and service deliverables without hidden fees or surprise markups.'
  },
  {
    icon: Clock,
    title: 'Fast Booking Requests',
    description: 'Request wedding bookings in seconds and receive real-time updates directly in your customer dashboard.'
  },
  {
    icon: CreditCard,
    title: 'Secure Stripe Payments',
    description: 'Vendors enjoy verified, encrypted subscription checkout powered by world-class Stripe infrastructure.'
  },
  {
    icon: Sparkles,
    title: 'Tailored Inspirations',
    description: 'Curated catalogs and reviews from real couples who celebrated unforgettable days.'
  }
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-20 bg-rose-50/50 border-y border-rose-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2">Our Distinction</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Why Choose WedPlan?
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base">
            We simplify the complex journey of wedding coordination by providing a trusted marketplace built for couples and vendors alike.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white rounded-2xl p-7 shadow-xs border border-rose-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">{item.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
