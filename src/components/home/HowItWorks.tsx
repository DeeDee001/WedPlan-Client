'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, CalendarCheck, Sparkles } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: Search,
    title: 'Explore & Compare',
    description: 'Browse verified wedding photographers, venues, and stylists with transparent pricing and real client portfolios.'
  },
  {
    step: '02',
    icon: CalendarCheck,
    title: 'Submit Booking Request',
    description: 'Select your wedding date and venue location, and send direct booking proposals with custom requirements.'
  },
  {
    step: '03',
    icon: Sparkles,
    title: 'Confirm & Celebrate',
    description: 'Vendors review and accept your booking requests. Track confirmations seamlessly in your dedicated dashboard.'
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2">Effortless Journey</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            How WedPlan Works
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base">
            From inspiration to celebration in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative bg-rose-50/40 rounded-2xl p-8 border border-rose-100/70 text-center flex flex-col items-center"
              >
                <div className="text-3xl font-serif font-black text-rose-200 mb-2">
                  {item.step}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md shadow-rose-100 text-rose-600 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-3">{item.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
