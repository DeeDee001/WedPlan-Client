'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';
import { Search, ShieldAlert, ShieldCheck, User as UserIcon } from 'lucide-react';

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (roleFilter !== 'all') params.append('role', roleFilter);

      const res = await api.get<{ success: boolean; users: User[] }>(`/admin/users?${params.toString()}`);
      if (res.success && res.users) {
        setUsers(res.users);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleBlock = async (user: User) => {
    const action = user.isBlocked ? 'unblock' : 'block';
    if (!confirm(`Are you sure you want to ${action} user "${user.name}"?`)) {
      return;
    }

    setTogglingId(user._id || user.id);
    try {
      const res = await api.patch<{ success: boolean; message: string; user: any }>(
        `/admin/users/${user._id || user.id}/block`,
        { isBlocked: !user.isBlocked }
      );

      if (res.success) {
        toast.success(res.message);
        setUsers((prev) =>
          prev.map((u) => ((u._id || u.id) === (user._id || user.id) ? { ...u, isBlocked: !u.isBlocked } : u))
        );
      }
    } catch (err: any) {
      toast.error(err.message || `Failed to ${action} user.`);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Manage Platform Users</h1>
        <p className="mt-1 text-sm text-stone-600">
          Inspect registered accounts, filter by role, and suspend or restore access permissions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-rose-100 flex flex-col sm:flex-row items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, or studio name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </form>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-48 px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
        >
          <option value="all">All Roles</option>
          <option value="vendor">Vendors</option>
          <option value="customer">Customers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* User Table */}
      {loading ? (
        <LoadingSpinner text="Loading users directory..." />
      ) : users.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-rose-100 shadow-xs">
          <p className="text-stone-600 text-sm">No users found matching your search.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="bg-rose-50/50 text-[11px] font-bold uppercase tracking-wider text-stone-500 border-b border-rose-100">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Account Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {users.map((user) => {
                  const userId = user._id || user.id;

                  return (
                    <tr key={userId} className="hover:bg-rose-50/30 transition-colors">
                      <td className="px-6 py-4 flex items-center space-x-3">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full object-cover ring-1 ring-rose-200" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-stone-900 leading-tight">{user.name}</p>
                          <p className="text-xs text-stone-500">{user.email}</p>
                          {user.businessName && (
                            <p className="text-[11px] text-rose-600 font-medium">Studio: {user.businessName}</p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="capitalize font-semibold text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <Badge variant={user.subscriptionPlan === 'premium' ? 'premium' : 'free'}>
                          {user.subscriptionPlan || 'free'}
                        </Badge>
                      </td>

                      <td className="px-6 py-4">
                        {user.isBlocked ? (
                          <span className="inline-flex items-center text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                            <ShieldAlert className="w-3.5 h-3.5 mr-1 text-rose-600" />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            Active
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleBlock(user)}
                            disabled={togglingId === userId}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                              user.isBlocked
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            }`}
                          >
                            {togglingId === userId
                              ? 'Updating...'
                              : user.isBlocked
                              ? 'Unblock User'
                              : 'Block User'}
                          </button>
                        )}
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
