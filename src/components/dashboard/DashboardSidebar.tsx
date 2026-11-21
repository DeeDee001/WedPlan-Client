'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  ShoppingBag,
  PlusCircle,
  Clock,
  Sparkles,
  Users,
  ShieldCheck,
  CreditCard,
  Settings,
  LogOut,
  Heart
} from 'lucide-react';

export const DashboardSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const role = user.role;

  const customerLinks = [
    { name: 'Overview', href: '/dashboard/customer', icon: LayoutDashboard },
    { name: 'My Bookings', href: '/dashboard/customer/bookings', icon: CalendarCheck },
    { name: 'Profile Settings', href: '/dashboard/profile', icon: Settings },
  ];

  const vendorLinks = [
    { name: 'Overview', href: '/dashboard/vendor', icon: LayoutDashboard },
    { name: 'My Services', href: '/dashboard/vendor/services', icon: ShoppingBag },
    { name: 'Add Service', href: '/dashboard/vendor/services/add', icon: PlusCircle },
    { name: 'Booking Requests', href: '/dashboard/vendor/bookings', icon: Clock },
    { name: 'Subscription Plan', href: '/dashboard/vendor/subscription', icon: Sparkles },
    { name: 'Profile Settings', href: '/dashboard/profile', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
    { name: 'Manage Services', href: '/dashboard/admin/services', icon: ShieldCheck },
    { name: 'Transactions', href: '/dashboard/admin/transactions', icon: CreditCard },
    { name: 'Profile Settings', href: '/dashboard/profile', icon: Settings },
  ];

  const navLinks = role === 'admin' ? adminLinks : role === 'vendor' ? vendorLinks : customerLinks;

  return (
    <aside className="w-64 bg-white border-r border-rose-100 min-h-[calc(100vh-80px)] flex flex-col justify-between shrink-0 shadow-xs">
      <div className="p-6">
        {/* User Card */}
        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center space-x-3 mb-6">
          {user.image ? (
            <img src={user.image} alt={user.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-rose-200" />
          ) : (
            <div className="w-11 h-11 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {user.name.charAt(0)}
            </div>
          )}
          <div className="overflow-hidden">
            <h4 className="font-serif font-bold text-sm text-stone-900 truncate">{user.name}</h4>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-white px-2 py-0.5 rounded-full border border-rose-200">
                {user.role}
              </span>
              {user.role === 'vendor' && (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  user.subscriptionPlan === 'premium' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600'
                }`}>
                  {user.subscriptionPlan}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                    : 'text-stone-600 hover:bg-rose-50 hover:text-rose-700'
                }`}
              >
                <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button at bottom */}
      <div className="p-6 border-t border-rose-100">
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-3" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
