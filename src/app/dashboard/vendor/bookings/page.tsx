'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Booking } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';
import { Calendar, MapPin, User as UserIcon, Check, X, Clock, Mail } from 'lucide-react';

export default function VendorBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get<{ success: boolean; bookings: Booking[] }>('/bookings/vendor');
      if (res.success && res.bookings) {
        setBookings(res.bookings);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load booking requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId: string, status: 'accepted' | 'rejected') => {
    setProcessingId(bookingId);
    try {
      const res = await api.patch<{ success: boolean; message: string; booking: Booking }>(
        `/bookings/${bookingId}/status`,
        { status }
      );
      if (res.success) {
        toast.success(res.message || `Booking request ${status}.`);
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
        );
      }
    } catch (err: any) {
      toast.error(err.message || `Failed to update booking status.`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading incoming wedding booking requests..." />;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Incoming Booking Requests</h1>
        <p className="mt-1 text-sm text-stone-600">
          Review proposals from couples requesting your services. Only pending requests can be accepted or rejected.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-rose-100 shadow-xs max-w-md mx-auto space-y-3">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">No Booking Requests</h3>
          <p className="text-stone-600 text-sm">
            You currently have no booking requests. Once couples discover and request your services, their dates and inquiries will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const customer = typeof booking.customerId === 'object' ? booking.customerId : null;
            const service = typeof booking.serviceId === 'object' ? booking.serviceId : null;
            const customerName = customer?.name || 'Wedding Couple';
            const customerEmail = customer?.email || '';
            const serviceName = service?.serviceName || 'Wedding Service';
            const imgUrl = service?.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80';

            return (
              <div
                key={booking._id}
                className="bg-white p-6 rounded-2xl shadow-xs border border-rose-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={imgUrl}
                    alt={serviceName}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 ring-1 ring-rose-200"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">{service?.category || 'Service'}</span>
                      <Badge variant={booking.status as any}>{booking.status}</Badge>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-stone-900">{serviceName}</h3>

                    <div className="text-xs text-stone-600 flex items-center space-x-2">
                      <UserIcon className="w-3.5 h-3.5 text-stone-400" />
                      <span>Couple: <strong className="text-stone-800">{customerName}</strong></span>
                      {customerEmail && (
                        <span className="text-stone-400">({customerEmail})</span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 pt-1">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-rose-500" />
                        Requested Date: <strong className="ml-1 text-stone-800">{booking.eventDate}</strong>
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
                <div className="flex items-center space-x-2 self-end md:self-center shrink-0">
                  {booking.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleStatusChange(booking._id, 'accepted')}
                        disabled={processingId === booking._id}
                        className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 mr-1.5" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(booking._id, 'rejected')}
                        disabled={processingId === booking._id}
                        className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5 mr-1.5" />
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-stone-400 italic">
                      Processed ({booking.status})
                    </span>
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
