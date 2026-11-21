'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Emily & Alexander',
    date: 'Married in Newport, RI',
    quote: 'WedPlan made finding our photographer and floral designer effortlessly smooth. The direct booking process gave us total confidence from day one!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Sophia & Liam',
    date: 'Married in Aspen, CO',
    quote: 'Being able to see upfront pricing and submit our specific dates saved us hundreds of back-and-forth emails. Our mountain wedding was pure magic.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Olivia & Noah',
    date: 'Married in Napa, CA',
    quote: 'As a busy bride, the WedPlan dashboard was a lifesaver. Every service request was tracked in real-time, and our caterer was sensational.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#fffafa] to-rose-50/60 border-t border-rose-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2">Real Love Stories</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Trusted by Happy Couples
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base">
            Read how couples crafted memories to last a lifetime with WedPlan verified vendors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-7 shadow-xs border border-rose-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 text-amber-400 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-rose-200 mb-3" />
                <p className="text-sm text-stone-700 italic leading-relaxed">
                  "{review.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-rose-50 flex items-center space-x-3">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-200"
                />
                <div>
                  <h4 className="font-serif text-sm font-bold text-stone-900">{review.name}</h4>
                  <p className="text-xs text-stone-500">{review.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
