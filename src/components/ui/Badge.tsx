import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'pending' | 'approved' | 'active' | 'rejected' | 'inactive' | 'cancelled' | 'premium' | 'free' | 'default';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = ''
}) => {
  const variants = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    cancelled: 'bg-stone-100 text-stone-600 border-stone-200',
    inactive: 'bg-stone-100 text-stone-600 border-stone-200',
    premium: 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent font-semibold shadow-sm',
    free: 'bg-stone-100 text-stone-700 border-stone-300',
    default: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  const selectedVariant = (variants as any)[variant] || variants.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${selectedVariant} ${className}`}
    >
      {children}
    </span>
  );
};
