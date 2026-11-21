'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle, ArrowRight } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-16 px-4 bg-[#fffafa]">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-rose-100 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10" />
        </div>

        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Payment Cancelled
          </h1>
          <p className="mt-2 text-stone-600 text-sm leading-relaxed">
            Your Stripe checkout session was cancelled or could not be completed. No charges were made to your account.
          </p>
        </div>

        <div className="pt-2 flex flex-col space-y-3">
          <Link
            href="/dashboard/vendor/subscription"
            className="w-full inline-flex items-center justify-center py-3 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition-colors"
          >
            <span>Return to Subscription Plans</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>

          <Link
            href="/dashboard/vendor"
            className="w-full inline-flex items-center justify-center py-2.5 px-6 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold text-xs transition-colors"
          >
            Vendor Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
