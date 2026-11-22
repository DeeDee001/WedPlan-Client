'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Heart, Lock, Mail, ArrowRight } from 'lucide-react';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error('Email and password are required.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post<{
        success: boolean;
        message: string;
        token: string;
        user: any;
      }>('/auth/login', {
        email: email.trim(),
        password
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        toast.success(`Welcome back, ${res.user.name}!`);

        if (redirectUrl) {
          router.push(redirectUrl);
        } else if (res.user.role === 'admin') {
          router.push('/dashboard/admin');
        } else if (res.user.role === 'vendor') {
          router.push('/dashboard/vendor');
        } else {
          router.push('/dashboard/customer');
        }
      } else {
        toast.error(res.message || 'Login failed.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials or connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-rose-50/40 via-white to-[#fffafa]">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-rose-100">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
            <Heart className="w-6 h-6 fill-rose-600" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
            Sign In to WedPlan
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Welcome back! Enter your credentials to access your account
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
              />
            </div>
          </div>

          {/* Demo Admin Helper */}
          <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-100 text-xs text-stone-600 flex items-center justify-between">
            <div>
              <p className="font-semibold text-rose-900">Admin Demo Credentials</p>
              <p className="text-[11px] text-stone-500">admin@wedplan.com / Admin123!</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@wedplan.com');
                setPassword('Admin123!');
              }}
              className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Autofill
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center py-3 px-4 rounded-xl text-white font-semibold bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-200 transition-all disabled:opacity-70 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-stone-500">Or continue with</span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <GoogleAuthButton redirectUrl={redirectUrl} buttonText="Continue with Google" />

        <p className="text-center text-xs text-stone-600 mt-4">
          Don't have an account yet?{' '}
          <Link href="/signup" className="font-semibold text-rose-600 hover:text-rose-700">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading sign in...</div>}>
      <SignInForm />
    </Suspense>
  );
}
