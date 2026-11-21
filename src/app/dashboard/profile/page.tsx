'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { uploadToImgBB } from '@/lib/imgbb';
import { toast } from 'sonner';
import { User, Mail, Building2, Upload, Sparkles, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function ProfileSettingsPage() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(user?.image || '');
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

    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = user?.image || '';
      if (imageFile) {
        toast.info('Uploading new avatar to ImgBB...');
        imageUrl = await uploadToImgBB(imageFile);
      }

      const res = await api.put<{ success: boolean; message: string; user: any }>('/users/profile', {
        name: name.trim(),
        businessName: user?.role === 'vendor' ? businessName.trim() : undefined,
        image: imageUrl
      });

      if (res.success && res.user) {
        updateUser(res.user);
        toast.success(res.message || 'Profile settings updated successfully!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Profile Settings</h1>
        <p className="mt-1 text-sm text-stone-600">
          Update your public profile details, studio name, and contact photo.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-rose-100 space-y-6">
        {/* Account Info Pill */}
        <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            <span className="font-semibold text-stone-800">Account Type:</span>
            <span className="uppercase font-bold text-rose-700 bg-white px-2 py-0.5 rounded-full border border-rose-200">
              {user?.role}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-semibold text-stone-800">Subscription Tier:</span>
            <Badge variant={user?.subscriptionPlan === 'premium' ? 'premium' : 'free'}>
              {user?.subscriptionPlan || 'free'}
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
              Profile Photo (ImgBB Hosting)
            </label>
            <div className="flex items-center space-x-6">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-rose-200 shadow-xs"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-2xl">
                  {name.charAt(0) || 'U'}
                </div>
              )}

              <div>
                <label className="cursor-pointer inline-flex items-center px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-rose-50 hover:border-rose-300 transition-colors">
                  <Upload className="w-4 h-4 mr-2" />
                  <span>{imageFile ? 'Change Selected File' : 'Upload New Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-stone-500 mt-1">Recommended: square 400x400 JPG or PNG</p>
              </div>
            </div>
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Email Address (Cannot be modified)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Studio Name (Vendors Only) */}
          {user?.role === 'vendor' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Studio / Business Display Name
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Bella Wedding Photography LLC"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="pt-4 border-t border-rose-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md shadow-rose-200 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {loading ? 'Saving Profile...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
