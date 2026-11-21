'use client';

import { Toaster as SonnerToaster } from 'sonner';

export const ToastProvider = () => {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        className: 'rounded-xl shadow-lg border border-rose-100 text-stone-800 bg-white font-sans',
        style: {
          padding: '12px 16px',
        }
      }}
      richColors
      closeButton
    />
  );
};
