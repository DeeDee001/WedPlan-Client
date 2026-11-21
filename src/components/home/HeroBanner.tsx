'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/70 via-white to-[#fffafa] pt-12 pb-24 lg:pt-20 lg:pb-32">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -z-10 w-80 h-80 bg-rose-100/50 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Headline & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-100/70 text-rose-700 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Your Perfect Wedding Starts Here</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.15]">
              Plan Your Dream Wedding with Top-Tier <span className="text-rose-600 underline decoration-rose-300 decoration-wavy">Vendors</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              WedPlan bridges couples with verified wedding photographers, venues, caterers, florists, and stylists. Explore services, book with transparent pricing, and celebrate stress-free.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-base shadow-lg shadow-rose-200 hover:scale-105 transition-all"
              >
                <span>Explore Wedding Services</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-stone-300 hover:border-rose-400 text-stone-800 hover:text-rose-600 bg-white font-medium text-base shadow-xs transition-all"
              >
                Become a Vendor
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-rose-100/80 text-left">
              <div>
                <p className="font-serif text-2xl font-bold text-stone-900">5,000+</p>
                <p className="text-xs text-stone-500">Verified Vendors</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-stone-900">12,000+</p>
                <p className="text-xs text-stone-500">Happy Couples</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="font-serif text-2xl font-bold text-stone-900">100%</p>
                <p className="text-xs text-stone-500">Verified Reviews</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Image / Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-rose-100">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
                  alt="Wedding celebration"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-xs uppercase tracking-widest text-rose-200 font-semibold">Featured Venue</p>
                  <h3 className="font-serif text-xl font-bold">The Glasshouse Botanical Pavilion</h3>
                  <p className="text-xs text-stone-300 mt-1">Napa Valley, CA • Capacity 250</p>
                </div>
              </div>

              {/* Floating Badge 1 */}
              <div className="absolute -bottom-5 -left-5 bg-white p-3.5 rounded-2xl shadow-xl border border-rose-100 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-800">Verified Vendors</p>
                  <p className="text-[11px] text-stone-500">Quality Guaranteed</p>
                </div>
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute -top-4 -right-4 bg-white p-3.5 rounded-2xl shadow-xl border border-rose-100 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-800">Instant Requests</p>
                  <p className="text-[11px] text-stone-500">Fast Vendor Reply</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
