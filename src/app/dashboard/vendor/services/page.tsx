'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Service } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';
import { PlusCircle, Edit3, Trash2, MapPin, CheckCircle, XCircle } from 'lucide-react';

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Edit Modal State
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await api.get<{ success: boolean; services: Service[] }>('/services/vendor/my-services');
      if (res.success && res.services) {
        setServices(res.services);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load your services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setEditName(service.serviceName);
    setEditPrice(service.price.toString());
    setEditLocation(service.location);
    setEditDescription(service.description);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setUpdating(true);
    try {
      const res = await api.put<{ success: boolean; message: string; service: Service }>(
        `/services/${editingService._id}`,
        {
          serviceName: editName.trim(),
          price: parseFloat(editPrice),
          location: editLocation.trim(),
          description: editDescription.trim()
        }
      );

      if (res.success && res.service) {
        toast.success(res.message || 'Service updated successfully.');
        setServices((prev) =>
          prev.map((s) => (s._id === editingService._id ? res.service : s))
        );
        setEditingService(null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update service.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to permanently delete this wedding service?')) {
      return;
    }

    try {
      const res = await api.delete<{ success: boolean; message: string }>(`/services/${serviceId}`);
      if (res.success) {
        toast.success(res.message || 'Service deleted.');
        setServices((prev) => prev.filter((s) => s._id !== serviceId));
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete service.');
    }
  };

  const handleToggleStatus = async (service: Service) => {
    if (service.status === 'pending' || service.status === 'rejected') {
      toast.info(`This service is currently ${service.status} and cannot be toggled manually.`);
      return;
    }

    const nextStatus = service.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await api.put<{ success: boolean; service: Service }>(`/services/${service._id}`, {
        status: nextStatus
      });
      if (res.success) {
        toast.success(`Service status toggled to ${nextStatus}.`);
        setServices((prev) =>
          prev.map((s) => (s._id === service._id ? { ...s, status: nextStatus } : s))
        );
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle service availability.');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your services catalog..." />;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">My Wedding Services</h1>
          <p className="mt-1 text-sm text-stone-600">
            View, edit, toggle availability, or delete your wedding service offerings.
          </p>
        </div>
        <Link
          href="/dashboard/vendor/services/add"
          className="inline-flex items-center px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md shadow-rose-200 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          <span>Add New Service</span>
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-rose-100 shadow-xs max-w-md mx-auto space-y-4">
          <h3 className="font-serif text-2xl font-bold text-stone-900">No Services Listed Yet</h3>
          <p className="text-stone-600 text-sm">
            You haven't added any services yet. Start publishing your wedding photography, venue, catering, or styling services!
          </p>
          <Link
            href="/dashboard/vendor/services/add"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 shadow-md shadow-rose-200 transition-colors"
          >
            Create Your First Service
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const imgUrl = service.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80';

            return (
              <div
                key={service._id}
                className="bg-white rounded-2xl overflow-hidden border border-rose-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-rose-50">
                    <img src={imgUrl} alt={service.serviceName} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3">
                      <Badge variant={service.status as any}>{service.status}</Badge>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                      {service.category}
                    </span>
                    <h3 className="font-serif text-base font-bold text-stone-900 line-clamp-1">
                      {service.serviceName}
                    </h3>
                    <div className="flex items-center text-xs text-stone-500">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-rose-500 shrink-0" />
                      <span className="truncate">{service.location}</span>
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-2 pt-1">{service.description}</p>
                    <p className="font-serif text-lg font-bold text-rose-600 pt-2">
                      ${service.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-rose-50/40 border-t border-rose-100/60 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleToggleStatus(service)}
                    className="font-semibold text-stone-600 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    {service.status === 'active' ? 'Mark Inactive' : service.status === 'approved' ? 'Active' : 'Status: ' + service.status}
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditModal(service)}
                      className="p-1.5 rounded-lg text-stone-600 hover:bg-white hover:text-stone-900 transition-colors cursor-pointer"
                      title="Edit Service"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100/70 transition-colors cursor-pointer"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Service Modal */}
      <Modal
        isOpen={!!editingService}
        onClose={() => setEditingService(null)}
        title="Edit Wedding Service"
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Service Name
            </label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Price (USD)
              </label>
              <input
                type="number"
                min="0"
                required
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Location
              </label>
              <input
                type="text"
                required
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Description
            </label>
            <textarea
              rows={4}
              required
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setEditingService(null)}
              className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
