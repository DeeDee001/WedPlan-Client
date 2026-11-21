'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Heart, User as UserIcon, Menu, X, LayoutDashboard, Settings, LogOut, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'vendor') return '/dashboard/vendor';
    return '/dashboard/customer';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 group-hover:text-rose-600 transition-colors">
            Wed<span className="text-rose-600">Plan</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-stone-700 hover:text-rose-600 font-medium transition-colors"
          >
            Home
          </Link>
          <Link
            href="/services"
            className="text-stone-700 hover:text-rose-600 font-medium transition-colors"
          >
            Browse Services
          </Link>
        </nav>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-3 p-1.5 pr-3 rounded-full hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-rose-300"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-semibold text-sm ring-2 ring-rose-200">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left">
                  <p className="text-xs font-semibold text-stone-800 leading-tight line-clamp-1">{user.name}</p>
                  <p className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">{user.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-stone-400" />
              </button>

              {/* Profile Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-rose-100 py-2 animate-fade-in z-50">
                  <div className="px-4 py-2 border-b border-rose-50 mb-1">
                    <p className="text-xs text-stone-500">Signed in as</p>
                    <p className="text-sm font-semibold text-stone-800 truncate">{user.email}</p>
                  </div>
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-stone-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-3 text-stone-400" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-stone-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-3 text-stone-400" />
                    Profile Settings
                  </Link>
                  <div className="my-1 border-t border-rose-50" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/signin"
                className="px-4 py-2 text-sm font-medium text-stone-700 hover:text-rose-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-200 transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-stone-600 hover:bg-rose-50"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-rose-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-stone-700 hover:bg-rose-50 hover:text-rose-600"
          >
            Home
          </Link>
          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-stone-700 hover:bg-rose-50 hover:text-rose-600"
          >
            Browse Services
          </Link>

          {user ? (
            <div className="pt-3 border-t border-rose-100 space-y-2">
              <div className="px-3 py-2 flex items-center space-x-3">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-stone-800">{user.name}</p>
                  <p className="text-xs text-rose-600 uppercase font-bold">{user.role}</p>
                </div>
              </div>
              <Link
                href={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md font-medium text-stone-700 hover:bg-rose-50 hover:text-rose-600"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md font-medium text-stone-700 hover:bg-rose-50 hover:text-rose-600"
              >
                Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md font-medium text-rose-600 hover:bg-rose-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-rose-100 space-y-2">
              <Link
                href="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-full border border-rose-200 text-sm font-semibold text-stone-800"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-full bg-rose-600 text-white text-sm font-semibold shadow-md shadow-rose-200"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
