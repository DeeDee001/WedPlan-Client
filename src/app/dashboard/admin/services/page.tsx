'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Service } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';
import { Search, CheckCircle, XCircle, Trash2, MapPin, Eye } from 'lucide-react';

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const res = await api.get<{ success: boolean; services: Service[] }>(
        `/admin/services?${params.toString()}`
      );
      if (res.success && res.services) {
        setServices(res.services);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices();
  };

  const handleUpdateStatus = async (serviceId: string, status: string) => {
    setActionId(serviceId);
    try {
      const res = await api.patch<{ success: boolean; message: string }>(
        `/admin/services/${serviceId}/status`,
        { status }
      );
      if (res.success) {
        toast.success(res.message || `Service status updated to ${status}.`);
        setServices((prev) =>
          prev.map((s) => (s._id === serviceId ? { ...s, status: status as any } : s))
        );
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update service status.');
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to permanently delete this service listing?')) {
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

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Manage Published Services</h1>
        <p className="mt-1 text-sm text-stone-600">
          Review submitted wedding services, grant approvals, reject inappropriate listings, or delete services.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-rose-100 flex flex-col sm:flex-row items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search service name, description, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </form>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="active">Active</option>
          <option value="rejected">Rejected</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Services Table */}
      {loading ? (
        <LoadingSpinner text="Loading services catalog for moderation..." />
      ) : services.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-rose-100 shadow-xs">
          <p className="text-stone-600 text-sm">No services found in this view.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="bg-rose-50/50 text-[11px] font-bold uppercase tracking-wider text-stone-500 border-b border-rose-100">
                <tr>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {services.map((service) => {
                  const vendor = typeof service.vendorId === 'object' ? service.vendorId : null;
                  const vendorName = vendor?.businessName || vendor?.name || 'Vendor';
                  const imgUrl = service.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80';

                  return (
                    <tr key={service._id} className="hover:bg-rose-50/30 transition-colors">
                      <td className="px-6 py-4 flex items-center space-x-3">
                        <img
                          src={imgUrl}
                          alt={service.serviceName}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 ring-1 ring-rose-200"
                        />
                        <div className="max-w-xs">
                          <p className="font-semibold text-stone-900 leading-tight line-clamp-1">{service.serviceName}</p>
                          <p className="text-xs text-stone-500 flex items-center mt-0.5">
                            <MapPin className="w-3 h-3 mr-1 text-rose-500" />
                            {service.location}
                          </p>
                          <p className="text-[11px] text-stone-400">By {vendorName}</p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                          {service.category}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-serif font-bold text-rose-600">
                        ${service.price.toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <Badge variant={service.status as any}>{service.status}</Badge>
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        {service.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(service._id, 'approved')}
                              disabled={actionId === service._id}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(service._id, 'rejected')}
                              disabled={actionId === service._id}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <>
                            {service.status === 'approved' || service.status === 'active' ? (
                              <button
                                onClick={() => handleUpdateStatus(service._id, 'inactive')}
                                disabled={actionId === service._id}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateStatus(service._id, 'active')}
                                disabled={actionId === service._id}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                              >
                                Activate
                              </button>
                            )}
                          </>
                        )}

                        <button
                          onClick={() => handleDeleteService(service._id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer inline-block"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
