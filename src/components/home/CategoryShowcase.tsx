'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera, Home, Flower, Utensils, Sparkles, Shirt } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Photography & Videography',
    icon: Camera,
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80',
    description: 'Capture timeless, cinematic memories of your special day.'
  },
  {
    name: 'Wedding Venues',
    icon: Home,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
    description: 'Scenic ballrooms, rustic barns, and breathtaking gardens.'
  },
  {
    name: 'Decoration & Florist',
    icon: Flower,
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80',
    description: 'Bespoke floral arrangements, arches, and custom lighting.'
  },
  {
    name: 'Catering Services',
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80',
    description: 'Artisanal culinary menus, banquets, cocktails, and cake artistry.'
  },
  {
    name: 'Makeup & Styling',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
    description: 'Flawless bridal hair styling and radiant professional cosmetics.'
  },
  {
    name: 'Wedding Fashion',
    icon: Shirt,
    image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=600&q=80',
    description: 'Couture gowns, bespoke tuxedos, and bridal party attire.'
  }
];

export const CategoryShowcase: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2">Explore by Specialization</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Wedding Service Categories
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base">
            Find the right masters of their craft for every detail of your matrimonial celebration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <Link
                  href={`/services?category=${encodeURIComponent(cat.name)}`}
                  className="group block relative rounded-2xl overflow-hidden aspect-[4/3] shadow-md hover:shadow-xl transition-all"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/30 to-transparent group-hover:from-stone-950/90 transition-colors" />

                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 group-hover:bg-rose-600 transition-colors">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-serif text-xl font-bold leading-tight group-hover:text-rose-200 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-stone-300 mt-1 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
