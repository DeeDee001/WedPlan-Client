'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  Users,
  Building2,
  Heart,
  ShoppingBag,
  Clock,
  CreditCard,
  DollarSign,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalServices: number;
  pendingServices: number;
  totalTransactions: number;
  totalRevenue: number;
}

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<{ success: boolean; stats: AdminStats }>('/admin/stats');
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading platform administration metrics..." />;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-8 rounded-3xl bg-stone-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-stone-800">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-600/30 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="font-serif text-3xl font-bold">Platform Overview</h1>
          <p className="mt-1 text-stone-400 text-sm max-w-xl">
            Monitor real-time system metrics, review pending service submissions, manage registered accounts, and audit financial transactions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard/admin/services"
            className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-md shadow-rose-900/40"
          >
            Review Services ({stats?.pendingServices || 0})
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-rose-100 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Total Registered Users</p>
            <p className="font-serif text-3xl font-bold text-stone-900">{stats?.totalUsers || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-rose-100 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Total Vendors</p>
            <p className="font-serif text-3xl font-bold text-stone-900">{stats?.totalVendors || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-rose-100 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Total Customers</p>
            <p className="font-serif text-3xl font-bold text-stone-900">{stats?.totalCustomers || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-rose-100 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Total Services</p>
            <p className="font-serif text-3xl font-bold text-stone-900">{stats?.totalServices || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-rose-100 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Pending Services</p>
            <p className="font-serif text-3xl font-bold text-orange-600">{stats?.pendingServices || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-rose-100 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Total Transactions</p>
            <p className="font-serif text-3xl font-bold text-stone-900">
              {stats?.totalTransactions || 0}
              <span className="text-xs text-stone-400 font-normal ml-2">(${stats?.totalRevenue || 0})</span>
            </p>
          </div>
        </div>
      </div>

      {/* Admin Modules Quick Launch */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/admin/users"
          className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xs hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">Manage Users</h3>
          <p className="text-xs text-stone-500 mt-1">Search accounts, filter by role, and toggle account blocks.</p>
        </Link>

        <Link
          href="/dashboard/admin/services"
          className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xs hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">Manage Services</h3>
          <p className="text-xs text-stone-500 mt-1">Approve or reject vendor listings, inspect descriptions, and remove listings.</p>
        </Link>

        <Link
          href="/dashboard/admin/transactions"
          className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xs hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">Platform Transactions</h3>
          <p className="text-xs text-stone-500 mt-1">Audit Stripe subscriptions, vendor payments, and timestamps.</p>
        </Link>
      </div>
    </div>
  );
}
