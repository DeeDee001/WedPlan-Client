'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ShieldAlert } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/signin?redirect=${pathname}`);
    }
  }, [user, loading, router, pathname]);

  // Role guarding
  useEffect(() => {
    if (!loading && user) {
      // Prevent cross-role access:
      // If Customer tries to access /dashboard/vendor or /dashboard/admin
      if (user.role === 'customer' && (pathname.startsWith('/dashboard/vendor') || pathname.startsWith('/dashboard/admin'))) {
        router.push('/dashboard/customer');
      }
      // If Vendor tries to access /dashboard/customer or /dashboard/admin
      if (user.role === 'vendor' && (pathname.startsWith('/dashboard/customer') || pathname.startsWith('/dashboard/admin'))) {
        router.push('/dashboard/vendor');
      }
      // If Admin tries to access /dashboard/customer or /dashboard/vendor
      if (user.role === 'admin' && (pathname.startsWith('/dashboard/customer') || pathname.startsWith('/dashboard/vendor'))) {
        router.push('/dashboard/admin');
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#fffafa]">
        <LoadingSpinner size="lg" text="Verifying authorization & loading dashboard..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Suspended/Blocked user notice
  if (user.isBlocked) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-rose-50/50">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-rose-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">Account Suspended</h2>
          <p className="text-sm text-stone-600">
            Your account has been blocked by a platform administrator. You are restricted from accessing protected platform features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-[#fffafa]">
      <DashboardSidebar />
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
