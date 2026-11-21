'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  CalendarCheck,
  Sparkles,
  PlusCircle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface VendorStats {
  totalServices: number;
  activeServices: number;
  pendingBookings: number;
  acceptedBookings: number;
  subscriptionPlan: 'free' | 'premium';
  subscriptionExpiresAt?: string;
}

export default function VendorDashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<{ success: boolean; stats: VendorStats }>('/users/dashboard/vendor');
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Error fetching vendor metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading vendor analytics..." />;
  }

  const isFreePlan = (stats?.subscriptionPlan || user?.subscriptionPlan) !== 'premium';
  const activeCount = stats?.activeServices || 0;
  const isLimitReached = isFreePlan && activeCount >= 3;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-rose-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-600/30 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Vendor Partner Portal</span>
          </div>
          <h1 className="font-serif text-3xl font-bold">
            {user?.businessName || user?.name}
          </h1>
          <p className="mt-1 text-stone-300 text-sm max-w-xl">
            Manage your service portfolio, review incoming wedding inquiries, and expand your bookings.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard/vendor/services/add"
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md shadow-rose-900/50 transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            <span>Add Service</span>
          </Link>

          {isFreePlan && (
            <Link
              href="/dashboard/vendor/subscription"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold text-sm shadow-md transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span>Upgrade</span>
            </Link>
          )}
        </div>
      </div>

      {/* Free Plan Limit Alert */}
      {isLimitReached && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <strong className="font-semibold">Free Plan Limit Reached:</strong> You have reached your 3-service limit. Upgrade to Premium for unlimited service listings and premier badge positioning.
          </div>
          <Link
            href="/dashboard/vendor/subscription"
            className="text-xs font-bold text-amber-900 bg-amber-200 px-3 py-1.5 rounded-xl hover:bg-amber-300 transition-colors"
          >
            Upgrade Now
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-rose-100 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Total Services</p>
            <p className="font-serif text-2xl font-bold text-stone-900">{stats?.totalServices || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-rose-100 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Active Services</p>
            <p className="font-serif text-2xl font-bold text-stone-900">{stats?.activeServices || 0}</p>
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
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Accepted Bookings</p>
            <p className="font-serif text-2xl font-bold text-stone-900">{stats?.acceptedBookings || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-rose-100 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-400 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Subscription</p>
            <p className="font-serif text-xl font-bold text-rose-600 capitalize">
              {stats?.subscriptionPlan || 'Free'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-rose-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Manage Published Services</h3>
            <p className="text-xs text-stone-600 mt-1">Review approval statuses, edit pricing, or toggle availability.</p>
          </div>
          <Link
            href="/dashboard/vendor/services"
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-800 transition-colors"
          >
            My Services
          </Link>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-rose-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Incoming Booking Requests</h3>
            <p className="text-xs text-stone-600 mt-1">Accept or reject pending event proposals from couples.</p>
          </div>
          <Link
            href="/dashboard/vendor/bookings"
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Review Requests
          </Link>
        </div>
      </div>
    </div>
  );
}
