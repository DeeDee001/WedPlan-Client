'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { uploadToImgBB } from '@/lib/imgbb';
import { toast } from 'sonner';
import { Heart, Lock, Mail, User as UserIcon, Building2, Upload, Sparkles, ArrowRight } from 'lucide-react';
import { UserRole } from '@/types';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [businessName, setBusinessName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error('Please complete all required fields.');
      return;
    }

    // Password validation: min 6 chars, 1 uppercase, 1 lowercase
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[a-z]/.test(password)) {
      toast.error('Password must contain at least one lowercase letter.');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = '';
      if (imageFile) {
        toast.info('Uploading profile image...');
        imageUrl = await uploadToImgBB(imageFile);
      }

      const res = await api.post<{
        success: boolean;
        message: string;
        token: string;
        user: any;
      }>('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        businessName: role === 'vendor' ? businessName.trim() : '',
        image: imageUrl
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        toast.success(res.message || 'Account created successfully! Welcome to WedPlan.');

        if (res.user.role === 'vendor') {
          router.push('/dashboard/vendor');
        } else {
          router.push('/dashboard/customer');
        }
      } else {
        toast.error(res.message || 'Registration failed.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration error occurred. Please try again.');
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
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Join WedPlan as a couple or showcase your wedding vendor business
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-rose-50 rounded-2xl border border-rose-100">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`py-2 text-sm font-semibold rounded-xl transition-all ${
              role === 'customer'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            I am a Couple / Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('vendor')}
            className={`py-2 text-sm font-semibold rounded-xl transition-all ${
              role === 'vendor'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            I am a Wedding Vendor
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <UserIcon className="w-5 h-5 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Eleanor Vance"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
              />
            </div>
          </div>

          {/* Business Name (Vendor Only) */}
          {role === 'vendor' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Business / Studio Name *
              </label>
              <div className="relative">
                <Building2 className="w-5 h-5 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Vance Grand Florals"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
                />
              </div>
            </div>
          )}

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
                placeholder="Min 6 chars, 1 uppercase, 1 lowercase"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
              />
            </div>
            <p className="mt-1 text-[11px] text-stone-500">
              Must contain min 6 characters with uppercase & lowercase letters.
            </p>
          </div>

          {/* Profile Image (Optional, ImgBB) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Profile Photo (Optional)
            </label>
            <div className="flex items-center space-x-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-400"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center border border-dashed border-rose-200">
                  <Upload className="w-5 h-5" />
                </div>
              )}
              <label className="cursor-pointer px-4 py-2 rounded-xl border border-stone-200 hover:border-rose-300 text-xs font-medium text-stone-700 hover:bg-rose-50 transition-colors">
                <span>{imageFile ? 'Change Photo' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center py-3 px-4 rounded-xl text-white font-semibold bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-200 transition-all disabled:opacity-70 cursor-pointer"
          >
            {loading ? 'Creating Account...' : 'Complete Sign Up'}
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
        <GoogleAuthButton
          role={role}
          businessName={businessName}
          buttonText="Sign up with Google"
        />

        <p className="text-center text-xs text-stone-600 mt-4">
          Already have an account?{' '}
          <Link href="/signin" className="font-semibold text-rose-600 hover:text-rose-700">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
