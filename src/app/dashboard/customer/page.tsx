'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Calendar, Clock, CheckCircle2, XCircle, ArrowRight, Sparkles } from 'lucide-react';

interface CustomerStats {
  totalBookings: number;
  pendingBookings: number;
  acceptedBookings: number;
  rejectedBookings: number;
}

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<{ success: boolean; stats: CustomerStats }>('/users/dashboard/customer');
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Error fetching customer stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading customer overview metrics..." />;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-400 text-white shadow-xl shadow-rose-200/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Dashboard</span>
          </div>
          <h1 className="font-serif text-3xl font-bold">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-1 text-rose-100 text-sm max-w-xl">
            Track your wedding service proposals, review vendor responses, and stay on top of your celebration arrangements.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center px-6 py-3 rounded-full bg-white text-rose-600 font-bold text-sm shadow-md hover:bg-rose-50 transition-all self-start md:self-auto cursor-pointer"
        >
          <span>Find Services</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-rose-100 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Total Requests</p>
            <p className="font-serif text-2xl font-bold text-stone-900">{stats?.totalBookings || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-rose-100 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Pending Bookings</p>
            <p className="font-serif text-2xl font-bold text-stone-900">{stats?.pendingBookings || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-rose-100 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Accepted Bookings</p>
            <p className="font-serif text-2xl font-bold text-stone-900">{stats?.acceptedBookings || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-rose-100 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Rejected Bookings</p>
            <p className="font-serif text-2xl font-bold text-stone-900">{stats?.rejectedBookings || 0}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-serif text-xl font-bold text-stone-900">Need to check your scheduled services?</h3>
          <p className="text-stone-600 text-sm mt-1">Review event locations, vendor contact details, and booking confirmations.</p>
        </div>
        <Link
          href="/dashboard/customer/bookings"
          className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-rose-600 text-white text-sm font-semibold transition-colors shrink-0"
        >
          View My Bookings
        </Link>
      </div>
    </div>
  );
}
