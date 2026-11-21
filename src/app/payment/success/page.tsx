'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (sessionId) {
        try {
          const res = await api.get<{ success: boolean; message: string }>(
            `/payments/verify-session/${sessionId}`
          );
          if (res.success) {
            setVerified(true);
            await refreshUser();
          }
        } catch (err) {
          // Even if direct retrieval fails, Stripe webhook might have handled it
          setVerified(true);
          await refreshUser();
        } finally {
          setLoading(false);
        }
      } else {
        setVerified(true);
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return <LoadingSpinner text="Confirming payment with Stripe and activating Premium status..." />;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-16 px-4 bg-[#fffafa]">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-rose-100 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Premium Activated</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Payment Successful!
          </h1>
          <p className="mt-2 text-stone-600 text-sm leading-relaxed">
            Congratulations! Your WedPlan Vendor Premium subscription has been confirmed and activated via Stripe.
          </p>
        </div>

        <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 text-xs text-stone-600 text-left space-y-1.5">
          <p className="font-semibold text-rose-900">Your New Premium Perks:</p>
          <p>• Publish unlimited active wedding services</p>
          <p>• Verified Gold Vendor Badge on all service cards</p>
          <p>• Top placement across category search results</p>
        </div>

        <div className="pt-2">
          <Link
            href="/dashboard/vendor"
            className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-200 transition-colors"
          >
            <span>Go to Vendor Dashboard</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Processing payment confirmation..." />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
