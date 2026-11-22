'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Sparkles, X, Mail, User, ShieldCheck } from 'lucide-react';

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleAuthButtonProps {
  role?: 'customer' | 'vendor';
  businessName?: string;
  redirectUrl?: string | null;
  buttonText?: string;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  role = 'customer',
  businessName,
  redirectUrl,
  buttonText = 'Continue with Google'
}) => {
  const { login } = useAuth();
  const router = useRouter();
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testName, setTestName] = useState('');

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Handle the credential callback from Google Identity Services
  const handleCredentialResponse = async (response: any) => {
    if (!response || !response.credential) {
      toast.error('Did not receive credentials from Google.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<{
        success: boolean;
        message: string;
        token: string;
        user: any;
      }>('/auth/google', {
        credential: response.credential,
        role,
        businessName: role === 'vendor' ? businessName : undefined
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        toast.success(`Welcome, ${res.user.name}! Signed in with Google.`);

        if (redirectUrl) {
          router.push(redirectUrl);
        } else if (res.user.role === 'admin') {
          router.push('/dashboard/admin');
        } else if (res.user.role === 'vendor') {
          router.push('/dashboard/vendor');
        } else {
          router.push('/dashboard/customer');
        }
      } else {
        toast.error(res.message || 'Google sign-in failed.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // Initialize Google Identity Services
  useEffect(() => {
    const initGsi = () => {
      if (typeof window !== 'undefined' && window.google?.accounts?.id && clientId) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true
          });

          if (googleBtnContainerRef.current) {
            googleBtnContainerRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: 380
            });
          }
        } catch (err) {
          console.warn('GSI Initialization warning:', err);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGsi();
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGsi();
          clearInterval(timer);
        }
      }, 300);
      return () => clearInterval(timer);
    }
  }, [clientId, role, businessName]);

  const handleCustomButtonClick = () => {
    if (clientId && window.google?.accounts?.id) {
      // Trigger Google One Tap / prompt
      try {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // If One Tap is skipped or blocked by browser cookies, open modal fallback
            setShowConfigModal(true);
          }
        });
      } catch (e) {
        setShowConfigModal(true);
      }
    } else {
      // No Client ID configured yet: open fallback modal
      setShowConfigModal(true);
    }
  };

  const handleManualGoogleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail.trim()) {
      toast.error('Email is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<{
        success: boolean;
        message: string;
        token: string;
        user: any;
      }>('/auth/google', {
        email: testEmail.trim().toLowerCase(),
        name: testName.trim() || testEmail.split('@')[0],
        role,
        businessName: role === 'vendor' ? businessName : undefined
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        toast.success(`Welcome, ${res.user.name}! Signed in via Google.`);
        setShowConfigModal(false);

        if (redirectUrl) {
          router.push(redirectUrl);
        } else if (res.user.role === 'admin') {
          router.push('/dashboard/admin');
        } else if (res.user.role === 'vendor') {
          router.push('/dashboard/vendor');
        } else {
          router.push('/dashboard/customer');
        }
      } else {
        toast.error(res.message || 'Google sign-in failed.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* If official rendered button is available, we display it centered */}
      {clientId && (
        <div
          ref={googleBtnContainerRef}
          className="flex justify-center mb-2 overflow-hidden rounded-xl"
        />
      )}

      {/* Styled Brand Google Button */}
      {(!clientId || !googleBtnContainerRef.current?.hasChildNodes()) && (
        <button
          type="button"
          onClick={handleCustomButtonClick}
          disabled={loading}
          className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl border border-stone-200 text-sm font-medium text-stone-700 bg-white hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
        >
          <svg className="w-4 h-4 mr-2.5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          {loading ? 'Connecting with Google...' : buttonText}
        </button>
      )}

      {/* Google Sign-in Modal / Quick Connect Dialog */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowConfigModal(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 rounded-full p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">Google Authentication</h3>
                <p className="text-xs text-stone-500">Sign in with your Google account</p>
              </div>
            </div>

            {!clientId && (
              <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200/70 text-xs text-amber-800 space-y-1">
                <p className="font-semibold">💡 Google Client ID Setup Notice:</p>
                <p>
                  To enable the official Google popup in production, add your Client ID to your environment variables:
                  <code className="block mt-1 font-mono text-[11px] bg-amber-100/70 p-1 rounded">
                    NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
                  </code>
                </p>
              </div>
            )}

            <form onSubmit={handleManualGoogleAuth} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Google Account Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    className="w-full pl-10 pr-3 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Display Name (Optional)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    placeholder="e.g. Maya Johnson"
                    className="w-full pl-10 pr-3 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl text-white font-semibold text-sm bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-200 transition disabled:opacity-70 cursor-pointer"
                >
                  {loading ? 'Authenticating...' : 'Sign In as Google User'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTestEmail('demo.user@gmail.com');
                    setTestName('Maya Johnson (Google)');
                  }}
                  className="w-full py-2 text-xs text-stone-600 hover:text-stone-900 font-medium text-center hover:bg-stone-50 rounded-xl transition cursor-pointer"
                >
                  Autofill with Demo Google User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
