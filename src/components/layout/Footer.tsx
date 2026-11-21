import React from 'react';
import Link from 'next/link';
import { Heart, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand & About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-full bg-rose-600 flex items-center justify-center text-white">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Wed<span className="text-rose-500">Plan</span>
              </span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed">
              WedPlan is the all-in-one wedding planning platform that effortlessly connects couples with verified, talented wedding vendors to build their dream celebration.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-serif font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-rose-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-rose-400 transition-colors">Browse Services</Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-rose-400 transition-colors">Sign In</Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-rose-400 transition-colors">Register as Vendor</Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-rose-400 transition-colors">Join as Customer</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-white font-serif font-semibold text-lg">Popular Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services?category=Photography%20%26%20Videography" className="hover:text-rose-400 transition-colors">Photography & Videography</Link>
              </li>
              <li>
                <Link href="/services?category=Wedding%20Venues" className="hover:text-rose-400 transition-colors">Wedding Venues</Link>
              </li>
              <li>
                <Link href="/services?category=Decoration%20%26%20Florist" className="hover:text-rose-400 transition-colors">Decoration & Florist</Link>
              </li>
              <li>
                <Link href="/services?category=Catering%20Services" className="hover:text-rose-400 transition-colors">Catering Services</Link>
              </li>
              <li>
                <Link href="/services?category=Makeup%20%26%20Styling" className="hover:text-rose-400 transition-colors">Makeup & Styling</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="space-y-4">
            <h4 className="text-white font-serif font-semibold text-lg">Contact Us</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>100 Romance Avenue, Suite 7, New York, NY</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                <span>+1 (800) 555-WEDPLAN</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                <span>support@wedplan.com</span>
              </li>
            </ul>

            <div className="pt-2 flex items-center space-x-4">
              <a href="#" className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white hover:bg-rose-600 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white hover:bg-rose-600 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white hover:bg-rose-600 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
          <p>© {new Date().getFullYear()} WedPlan Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-stone-400">Privacy Policy</a>
            <a href="#" className="hover:text-stone-400">Terms of Service</a>
            <a href="#" className="hover:text-stone-400">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
