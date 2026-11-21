'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { uploadToImgBB } from '@/lib/imgbb';
import { toast } from 'sonner';
import { Upload, PlusCircle, ArrowLeft, Image as ImageIcon } from 'lucide-react';

const CATEGORIES = [
  'Photography & Videography',
  'Wedding Venues',
  'Decoration & Florist',
  'Catering Services',
  'Makeup & Styling',
  'Wedding Fashion'
];

export default function AddServicePage() {
  const router = useRouter();

  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
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

    if (!serviceName.trim() || !category || !description.trim() || !price || !location.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    if (!imageFile && !imagePreview) {
      toast.error('Please upload at least one image of your wedding service.');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = '';
      if (imageFile) {
        toast.info('Uploading service photo...');
        imageUrl = await uploadToImgBB(imageFile);
      }

      const res = await api.post<{
        success: boolean;
        message: string;
        service: any;
      }>('/services', {
        serviceName: serviceName.trim(),
        category,
        description: description.trim(),
        price: parseFloat(price),
        location: location.trim(),
        images: [imageUrl]
      });

      if (res.success) {
        toast.success(res.message || 'Service submitted for approval!');
        router.push('/dashboard/vendor/services');
      }
    } catch (err: any) {
      if (err.data?.code === 'LIMIT_REACHED') {
        toast.error(err.message, {
          action: {
            label: 'Upgrade',
            onClick: () => router.push('/dashboard/vendor/subscription')
          }
        });
      } else {
        toast.error(err.message || 'Failed to submit service.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center text-xs font-semibold text-stone-600 hover:text-rose-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Services
      </button>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-rose-100 space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">Add New Wedding Service</h1>
          <p className="mt-1 text-xs text-stone-600">
            Showcase your offering to prospective couples. New services will be submitted with 'Pending' status until verified by admin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Service Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Service Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Full-Day Candid Wedding Photography & Drone Package"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Price (USD) *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                placeholder="e.g. 1500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Service Location / Region *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Charleston, SC & Surrounding Areas"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Detailed Description *
            </label>
            <textarea
              rows={5}
              required
              placeholder="Outline what is included, your equipment, timeline, deliverables, and why couples love working with you..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Image Upload (ImgBB) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
              Featured Service Photo (ImgBB Upload) *
            </label>
            <div className="flex items-center space-x-6">
              {imagePreview ? (
                <div className="relative w-32 h-24 rounded-2xl overflow-hidden border border-rose-200 shadow-xs">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-32 h-24 rounded-2xl bg-rose-50 border-2 border-dashed border-rose-200 flex flex-col items-center justify-center text-rose-500">
                  <ImageIcon className="w-6 h-6" />
                  <span className="text-[10px] mt-1 font-semibold">No Image</span>
                </div>
              )}

              <div>
                <label className="cursor-pointer inline-flex items-center px-4 py-2 rounded-xl bg-white border border-stone-300 hover:border-rose-400 text-xs font-semibold text-stone-700 shadow-xs hover:bg-rose-50 transition-colors">
                  <Upload className="w-4 h-4 mr-2 text-stone-500" />
                  <span>Choose Photo File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-stone-500 mt-1">High-res JPG or PNG recommended.</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-rose-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-200 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {loading ? 'Submitting Service...' : 'Publish Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
