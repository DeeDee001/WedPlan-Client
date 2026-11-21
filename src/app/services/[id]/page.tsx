'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Service } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';
import {
  MapPin,
  Calendar,
  DollarSign,
  Heart,
  ShieldCheck,
  Building2,
  Mail,
  User as UserIcon,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [eventDate, setEventDate] = useState<string>('');
  const [eventLocation, setEventLocation] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);

  useEffect(() => {
    // Access Rule: Redirect unauthenticated user to Sign In
    if (!user) {
      router.push(`/signin?redirect=/services/${serviceId}`);
      return;
    }

    const fetchService = async () => {
      try {
        const res = await api.get<{ success: boolean; service: Service }>(`/services/${serviceId}`);
        if (res.success && res.service) {
          setService(res.service);
          if (res.service.location) {
            setEventLocation(res.service.location);
          }
        }
      } catch (err: any) {
        toast.error(err.message || 'Service not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId, user]);

  const handleOpenBookingModal = () => {
    if (!user) {
      router.push(`/signin?redirect=/services/${serviceId}`);
      return;
    }

    if (user.role === 'admin') {
      toast.error('Administrators cannot submit customer booking requests.');
      return;
    }

    const vendor = typeof service?.vendorId === 'object' ? service?.vendorId : null;
    const vendorId = vendor?._id || vendor?.id || (service?.vendorId as string);

    if (user.role === 'vendor' && vendorId === user.id) {
      toast.error('Vendors cannot book their own services.');
      return;
    }

    setIsModalOpen(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventDate || !eventLocation.trim()) {
      toast.error('Please enter the event date and event location.');
      return;
    }

    setBookingLoading(true);

    try {
      const res = await api.post<{ success: boolean; message: string }>('/bookings', {
        serviceId,
        eventDate,
        eventLocation: eventLocation.trim(),
        message: message.trim()
      });

      if (res.success) {
        toast.success(res.message || 'Booking request submitted successfully!');
        setIsModalOpen(false);
        setEventDate('');
        setMessage('');
        router.push('/dashboard/customer/bookings');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit booking request.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading service details..." />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-3xl font-bold text-stone-800 mb-2">Service Not Found</h2>
        <p className="text-stone-500 mb-6">The wedding service you requested could not be located or has been unpublished.</p>
        <button
          onClick={() => router.push('/services')}
          className="px-6 py-2.5 rounded-full bg-rose-600 text-white font-semibold text-sm hover:bg-rose-700"
        >
          Return to Browse Services
        </button>
      </div>
    );
  }

  const vendor = typeof service.vendorId === 'object' ? service.vendorId : null;
  const vendorName = vendor?.businessName || vendor?.name || 'Verified Vendor';
  const images = service.images && service.images.length > 0
    ? service.images
    : ['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="min-h-screen bg-[#fffafa] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb Back */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-sm font-semibold text-stone-600 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Listings
        </button>

        {/* Hero Gallery & Quick Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Images Section */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-lg border border-rose-100 bg-rose-50">
              <img
                src={images[activeImageIndex]}
                alt={service.serviceName}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-rose-700 shadow-xs">
                {service.category}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'border-rose-600 ring-2 ring-rose-200' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Service Title & Booking Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-rose-100 space-y-6">
              <div>
                <div className="flex items-center text-xs font-semibold text-rose-600 uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  <span>Verified Wedding Offering</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                  {service.serviceName}
                </h1>
                <div className="flex items-center text-xs text-stone-500 mt-2">
                  <MapPin className="w-4 h-4 mr-1 text-rose-500 shrink-0" />
                  <span>{service.location}</span>
                </div>
              </div>

              {/* Price Tag */}
              <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-500 font-medium">Standard Investment</p>
                  <p className="font-serif text-3xl font-bold text-rose-600">
                    ${service.price.toLocaleString()}
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-white border border-rose-200 text-xs font-semibold text-rose-700">
                  Fixed Package
                </div>
              </div>

              {/* Booking CTA Button */}
              <button
                onClick={handleOpenBookingModal}
                className="w-full py-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-base shadow-lg shadow-rose-200 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Request Service Booking</span>
              </button>

              <div className="space-y-2.5 pt-2 border-t border-rose-50 text-xs text-stone-600">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Verified Vendor Protection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Free booking cancellation while request is pending</span>
                </div>
              </div>
            </div>

            {/* Vendor Profile Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-4">
                Service Provider Information
              </h4>
              <div className="flex items-center space-x-4">
                {vendor?.image ? (
                  <img
                    src={vendor.image}
                    alt={vendorName}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-rose-200"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg">
                    {vendorName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-serif text-base font-bold text-stone-900">{vendorName}</h3>
                  <p className="text-xs text-stone-500">{vendor?.email}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                    Vendor Partner
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-rose-100 space-y-4">
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            About This Wedding Service
          </h2>
          <div className="prose prose-stone text-stone-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
            {service.description}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Book: ${service.serviceName}`}
      >
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div className="p-3 bg-rose-50 rounded-xl text-xs text-rose-800">
            Submit your proposed event date and venue location. The vendor will review and update your booking status.
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Event Date *
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Event Location / Venue Address *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. The Rosewood Grand Ballroom, NY"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Additional Details or Message
            </label>
            <textarea
              rows={3}
              placeholder="Tell the vendor about your guest count, schedule, aesthetic preferences..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={bookingLoading}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-200 disabled:opacity-60 cursor-pointer"
            >
              {bookingLoading ? 'Submitting Request...' : 'Confirm Request'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
