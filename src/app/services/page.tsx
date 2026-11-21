'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Service } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Search, Filter, MapPin, ArrowUpDown, Sparkles, X } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Photography & Videography',
  'Wedding Venues',
  'Decoration & Florist',
  'Catering Services',
  'Makeup & Styling',
  'Wedding Fashion'
];

function BrowseServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Sorting state
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>(initialCategory);
  const [location, setLocation] = useState<string>('');
  const [sort, setSort] = useState<string>('newest'); // 'newest' | 'price_asc' | 'price_desc'

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (category && category !== 'All') params.append('category', category);
      if (location.trim()) params.append('location', location.trim());
      if (sort !== 'newest') params.append('sort', sort);

      const res = await api.get<{ success: boolean; services: Service[] }>(
        `/services?${params.toString()}`
      );

      if (res.success && res.services) {
        setServices(res.services);
      }
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [category, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices();
  };

  const handleServiceClick = (serviceId: string) => {
    if (!user) {
      router.push(`/signin?redirect=/services/${serviceId}`);
    } else {
      router.push(`/services/${serviceId}`);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setLocation('');
    setSort('newest');
    router.push('/services');
  };

  return (
    <div className="min-h-screen bg-[#fffafa] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-100/70 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Marketplace</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900">
            Browse Wedding Services
          </h1>
          <p className="mt-3 text-stone-600 text-sm sm:text-base">
            Discover and connect with top-rated wedding professionals. Filter by specialization, location, or sort by price.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-rose-100 mb-10">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search service or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Input */}
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Filter by city / state..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Price Sorting (Asc/Desc) */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <ArrowUpDown className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm rounded-xl transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
          </form>

          {/* Active Filter Pills */}
          {(search || category !== 'All' || location || sort !== 'newest') && (
            <div className="mt-4 pt-3 border-t border-rose-50 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-stone-500 font-medium">Active filters:</span>
                {category !== 'All' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-semibold">
                    {category}
                  </span>
                )}
                {search && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-semibold">
                    "{search}"
                  </span>
                )}
                {location && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-semibold">
                    Near {location}
                  </span>
                )}
                {sort !== 'newest' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-semibold">
                    {sort === 'price_asc' ? 'Price: Low to High' : 'Price: High to Low'}
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="text-stone-500 hover:text-rose-600 font-medium flex items-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Content Listing */}
        {loading ? (
          <LoadingSpinner text="Searching available wedding services..." />
        ) : services.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-16 text-center border border-rose-100 shadow-xs max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">No Services Found</h3>
            <p className="text-stone-600 text-sm mb-6">
              We couldn't find any approved services matching your filter criteria. Try adjusting your search keywords, location, or category.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 rounded-full bg-rose-600 text-white font-semibold text-sm shadow-md shadow-rose-200 hover:bg-rose-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const vendor = typeof service.vendorId === 'object' ? service.vendorId : null;
              const vendorName = vendor?.businessName || vendor?.name || 'Wedding Professional';
              const imgUrl = service.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80';

              return (
                <div
                  key={service._id}
                  className="wedding-card rounded-2xl overflow-hidden flex flex-col group"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-rose-100">
                    <img
                      src={imgUrl}
                      alt={service.serviceName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-rose-700 shadow-xs">
                      {service.category}
                    </div>
                  </div>

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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrowseServicesPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading services..." />}>
      <BrowseServicesContent />
    </Suspense>
  );
}
