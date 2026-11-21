'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Service } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const FALLBACK_SERVICES: Service[] = [
  {
    _id: '65e01234567890abcdef0001',
    vendorId: { name: 'Aura Lens Studios', businessName: 'Aura Lens Studios', email: 'contact@auralens.com' } as any,
    serviceName: 'Cinematic Golden Hour Wedding Photography',
    category: 'Photography & Videography',
    description: 'Full-day documentary wedding photojournalism with drone aerial videography and luxury photo album.',
    price: 1850,
    location: 'Charleston, SC',
    images: ['https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80'],
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    _id: '65e01234567890abcdef0002',
    vendorId: { name: 'Magnolia Manor Estate', businessName: 'Magnolia Manor', email: 'events@magnoliamanor.com' } as any,
    serviceName: 'Historic Waterfront Botanical Garden Venue',
    category: 'Wedding Venues',
    description: 'Picturesque estate featuring ancient live oaks, Spanish moss, private bridal suite, and grand ballroom.',
    price: 4500,
    location: 'Savannah, GA',
    images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'],
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    _id: '65e01234567890abcdef0003',
    vendorId: { name: 'Fleur & Velvet Botanical Design', businessName: 'Fleur & Velvet', email: 'hello@fleurvelvet.com' } as any,
    serviceName: 'Custom Luxury Floral Arches & Centerpieces',
    category: 'Decoration & Florist',
    description: 'Artisanal ceremony floral installations, lush organic bouquets, and tablescape candle stylings.',
    price: 1200,
    location: 'Austin, TX',
    images: ['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80'],
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    _id: '65e01234567890abcdef0004',
    vendorId: { name: 'Epicurean Feast Banquet Co.', businessName: 'Epicurean Feast', email: 'catering@epicurean.com' } as any,
    serviceName: 'Gourmet 4-Course Plated Dinner & Wine Pairing',
    category: 'Catering Services',
    description: 'Locally sourced farm-to-table banquet menu with sommelier curated natural wine pairings and dessert stations.',
    price: 2400,
    location: 'Napa Valley, CA',
    images: ['https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80'],
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    _id: '65e01234567890abcdef0005',
    vendorId: { name: 'Elysian Bridal Glamour', businessName: 'Elysian Bridal', email: 'glam@elysianbridal.com' } as any,
    serviceName: 'Bridal Party Hair & Airbrush HD Makeup Package',
    category: 'Makeup & Styling',
    description: 'On-location luxury hair styling and waterproof airbrush bridal artistry for bride and bridesmaids.',
    price: 850,
    location: 'Miami, FL',
    images: ['https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80'],
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    _id: '65e01234567890abcdef0006',
    vendorId: { name: 'Atelier Romance Haute Couture', businessName: 'Atelier Romance', email: 'fitting@atelierromance.com' } as any,
    serviceName: 'Bespoke Hand-Embroidered Bridal Gown Fitting',
    category: 'Wedding Fashion',
    description: 'Custom handcrafted bridal silk gowns with French lace embroidery, bespoke veil, and tailored alterations.',
    price: 3200,
    location: 'New York, NY',
    images: ['https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80'],
    status: 'approved',
    createdAt: new Date().toISOString()
  }
];

export const FeaturedServices: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.get<{ success: boolean; services: Service[] }>('/services/featured');
        if (data.success && data.services && data.services.length >= 6) {
          setServices(data.services);
        } else {
          // If database has fewer than 6, combine with curated fallback list
          const combined = [...(data.services || [])];
          for (const fallback of FALLBACK_SERVICES) {
            if (combined.length < 6 && !combined.some(s => s._id === fallback._id)) {
              combined.push(fallback);
            }
          }
          setServices(combined);
        }
      } catch (err) {
        setServices(FALLBACK_SERVICES);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceClick = (serviceId: string) => {
    if (!user) {
      router.push(`/signin?redirect=/services/${serviceId}`);
    } else {
      router.push(`/services/${serviceId}`);
    }
  };

  return (
    <section className="py-20 bg-[#fffafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked Excellence</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Featured Wedding Services
            </h2>
            <p className="mt-2 text-stone-600 text-sm sm:text-base">
              Discover top-rated, approved wedding professionals eager to bring your vision to life.
            </p>
          </div>
          <Link
            href="/services"
            className="mt-4 md:mt-0 inline-flex items-center text-sm font-semibold text-rose-600 hover:text-rose-700 group"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading featured services..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 6).map((service, index) => {
              const vendor = typeof service.vendorId === 'object' ? service.vendorId : null;
              const vendorName = vendor?.businessName || vendor?.name || 'Verified Vendor';
              const imgUrl = service.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80';

              return (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="wedding-card rounded-2xl overflow-hidden flex flex-col group"
                >
                  {/* Image container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-rose-100">
                    <img
                      src={imgUrl}
                      alt={service.serviceName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-rose-700 shadow-xs">
                      {service.category}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center text-xs text-stone-500 mb-2">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-rose-500 shrink-0" />
                        <span className="truncate">{service.location}</span>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-stone-900 line-clamp-1 group-hover:text-rose-600 transition-colors">
                        {service.serviceName}
                      </h3>

                      <p className="mt-2 text-xs sm:text-sm text-stone-600 line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-rose-100/60 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">By {vendorName}</p>
                        <p className="font-serif text-xl font-bold text-rose-600">
                          ${service.price.toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => handleServiceClick(service._id)}
                        className="px-4 py-2 rounded-full text-xs font-semibold bg-stone-900 text-white hover:bg-rose-600 shadow-xs transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
