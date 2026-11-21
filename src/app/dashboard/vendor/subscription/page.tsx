'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Check, Sparkles, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const isPremium = user?.subscriptionPlan === 'premium';

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await api.post<{ success: boolean; url: string; sessionId: string }>(
        '/payments/create-checkout-session'
      );

      if (res.success && res.url) {
        toast.info('Redirecting to Stripe secure checkout...');
        window.location.href = res.url;
      } else {
        toast.error('Failed to create payment session.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Could not initiate Stripe checkout. Please ensure Stripe secret key is configured.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vendor Subscriptions</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Scale Your Wedding Business
        </h1>
        <p className="mt-2 text-stone-600 text-sm sm:text-base">
          Upgrade to Premium to publish unlimited wedding services, receive the verified gold badge, and capture more inquiries.
        </p>
      </div>

      {/* Pricing Cards Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* Free Plan */}
        <div className={`bg-white rounded-3xl p-8 border flex flex-col justify-between shadow-xs ${
          !isPremium ? 'border-stone-300 ring-2 ring-stone-200' : 'border-rose-100'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-2xl font-bold text-stone-900">Free Tier</h3>
              {!isPremium && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                  Current Plan
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mb-6">Standard starter access for new wedding service vendors.</p>

            <div className="flex items-baseline mb-6">
              <span className="font-serif text-4xl font-bold text-stone-900">$0</span>
              <span className="text-xs text-stone-500 ml-2">/ Forever</span>
            </div>

            <ul className="space-y-3.5 text-sm text-stone-600">
              <li className="flex items-center">
                <Check className="w-4 h-4 text-emerald-600 mr-2.5 shrink-0" />
                <span>Publish maximum <strong>3 Active Services</strong></span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-emerald-600 mr-2.5 shrink-0" />
                <span>Basic Vendor Dashboard & Metrics</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-emerald-600 mr-2.5 shrink-0" />
                <span>Booking Request Management</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-emerald-600 mr-2.5 shrink-0" />
                <span>Standard Marketplace Listing</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              disabled
              className="w-full py-3 rounded-xl bg-stone-100 text-stone-500 font-semibold text-xs text-center cursor-not-allowed"
            >
              {!isPremium ? 'Currently Active' : 'Default Basic'}
            </button>
          </div>
        </div>

        {/* Premium Plan */}
        <div className={`relative bg-gradient-to-b from-white to-rose-50/50 rounded-3xl p-8 border-2 flex flex-col justify-between shadow-xl ${
          isPremium ? 'border-amber-400 ring-2 ring-amber-300' : 'border-rose-500 ring-2 ring-rose-200'
        }`}>
          {/* Badge */}
          <div className="absolute -top-3.5 right-8 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-white text-xs font-bold uppercase tracking-wider shadow-md">
            Recommended
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-2xl font-bold text-stone-900">Premium Vendor</h3>
              {isPremium && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                  Current Plan
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mb-6">Unlimited reach and promotional power for dedicated wedding professionals.</p>

            <div className="flex items-baseline mb-6">
              <span className="font-serif text-4xl font-bold text-rose-600">$49</span>
              <span className="text-xs text-stone-500 ml-2">/ One-Year License</span>
            </div>

            <ul className="space-y-3.5 text-sm text-stone-700">
              <li className="flex items-center font-semibold text-stone-900">
                <Check className="w-4 h-4 text-rose-600 mr-2.5 shrink-0" />
                <span>Publish Unlimited Active Services</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-rose-600 mr-2.5 shrink-0" />
                <span>Gold Verified Vendor Profile Badge</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-rose-600 mr-2.5 shrink-0" />
                <span>Priority Placement in Search & Category results</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-rose-600 mr-2.5 shrink-0" />
                <span>Instant In-App Booking Notifications</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-rose-600 mr-2.5 shrink-0" />
                <span>All Free Plan Features Included</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            {isPremium ? (
              <div className="w-full py-3 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs text-center border border-amber-300">
                Active Premium Vendor Subscription
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs shadow-lg shadow-rose-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
              >
                <span>{loading ? 'Creating Stripe Session...' : 'Upgrade to Premium with Stripe'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
