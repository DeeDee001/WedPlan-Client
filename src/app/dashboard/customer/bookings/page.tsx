'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Booking } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';
import { Calendar, MapPin, Building2, CalendarCheck, Ban, ArrowRight } from 'lucide-react';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get<{ success: boolean; bookings: Booking[] }>('/bookings/customer');
      if (res.success && res.bookings) {
        setBookings(res.bookings);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this pending booking request?')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      const res = await api.patch<{ success: boolean; message: string }>(`/bookings/${bookingId}/cancel`);
      if (res.success) {
        toast.success(res.message || 'Booking request cancelled successfully.');
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
        );
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel booking request.');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching your booking requests..." />;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">My Wedding Bookings</h1>
        <p className="mt-1 text-sm text-stone-600">
          Manage all booking requests sent to wedding vendors, monitor approval statuses, and cancel pending requests.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-rose-100 shadow-xs max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">No Bookings Yet</h3>
          <p className="text-stone-600 text-sm">
            You haven't requested any wedding bookings yet. Explore our marketplace and book services for your special day.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-rose-600 text-white font-semibold text-sm hover:bg-rose-700 shadow-md shadow-rose-200 transition-colors"
          >
            <span>Browse Services</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const service = typeof booking.serviceId === 'object' ? booking.serviceId : null;
            const vendor = typeof booking.vendorId === 'object' ? booking.vendorId : null;
            const serviceName = service?.serviceName || 'Wedding Service';
            const vendorName = vendor?.businessName || vendor?.name || 'Verified Vendor';
            const imgUrl = service?.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80';

            return (
              <div
                key={booking._id}
                className="bg-white p-6 rounded-2xl shadow-xs border border-rose-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start sm:items-center space-x-4">
                  <img
                    src={imgUrl}
                    alt={serviceName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 ring-1 ring-rose-200"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">{service?.category || 'Wedding'}</span>
                      <Badge variant={booking.status as any}>{booking.status}</Badge>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      {serviceName}
                    </h3>

                    <p className="text-xs text-stone-600 flex items-center">
                      <Building2 className="w-3.5 h-3.5 mr-1 text-stone-400" />
                      Vendor: <span className="font-semibold text-stone-800 ml-1">{vendorName}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 pt-1">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-rose-500" />
                        Date: <strong className="ml-1 text-stone-800">{booking.eventDate}</strong>
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-rose-500" />
                        Location: <span className="ml-1 text-stone-800">{booking.eventLocation}</span>
                      </span>
                    </div>

                    {booking.message && (
                      <p className="text-xs text-stone-500 italic pt-1">
                        "{booking.message}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 self-end md:self-center shrink-0">
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5 mr-1.5" />
                      {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Request'}
                    </button>
                  )}

                  {service?._id && (
                    <Link
                      href={`/services/${service._id}`}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition-colors"
                    >
                      View Service
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
