'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';

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

const DEFAULT_CLIENT_ID = '111179747737-8v6lhtisbms2hb3bdst017los8dovh6i.apps.googleusercontent.com';

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
  const [googleReady, setGoogleReady] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || DEFAULT_CLIENT_ID;

  // Complete login with user & token returned from backend
  const completeAuth = (res: any) => {
    if (res.success && res.token && res.user) {
      login(res.token, res.user);
      toast.success(`Welcome back, ${res.user.name}!`);

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
  };

  // 1. Handle credential response from Google Identity Services (ID Token)
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

      completeAuth(res);
    } catch (error: any) {
      toast.error(error.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Initialize Google Identity Services and render official button
  useEffect(() => {
    let interval: any = null;

    const setupGsi = () => {
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
            setGoogleReady(true);
          }
        } catch (err) {
          console.warn('Google GSI render error:', err);
        }
      }
    };

    if (window.google?.accounts?.id) {
      setupGsi();
    } else {
      interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          setupGsi();
          clearInterval(interval);
        }
      }, 200);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [clientId, role, businessName]);

  // 3. Fallback direct OAuth2 popup if official button is still initializing
  const triggerGooglePopup = () => {
    if (typeof window === 'undefined') return;

    if (!window.google?.accounts?.oauth2) {
      toast.error('Google service is loading. Please wait a moment and try again.');
      return;
    }

    try {
      setLoading(true);
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        prompt: 'select_account',
        callback: async (tokenResponse: any) => {
          if (tokenResponse?.error) {
            setLoading(false);
            if (tokenResponse.error !== 'access_denied') {
              toast.error(`Google Error: ${tokenResponse.error}`);
            }
            return;
          }

          if (tokenResponse?.access_token) {
            try {
              const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
              });

              if (!userInfoRes.ok) {
                throw new Error('Failed to retrieve profile from Google');
              }

              const profile = await userInfoRes.json();
              const res = await api.post<{
                success: boolean;
                message: string;
                token: string;
                user: any;
              }>('/auth/google', {
                email: profile.email,
                name: profile.name,
                image: profile.picture,
                role,
                businessName: role === 'vendor' ? businessName : undefined
              });

              completeAuth(res);
            } catch (err: any) {
              console.error('Google Auth Processing Error:', err);
              toast.error(err.message || 'Failed to process Google sign-in.');
            } finally {
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
        }
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (err: any) {
      setLoading(false);
      console.error('Trigger Google Popup Error:', err);
      toast.error('Could not open Google sign-in popup.');
    }
  };

  return (
    <div className="w-full flex justify-center">
      {/* Official Google Button (Displayed when Google script has rendered it) */}
      <div
        ref={googleBtnContainerRef}
        className={`w-full flex justify-center overflow-hidden min-h-[44px] ${
          !googleReady ? 'hidden' : 'block'
        }`}
      />

      {/* Styled Fallback Button (Only shown before Google script finishes rendering) */}
      {!googleReady && (
        <button
          type="button"
          onClick={triggerGooglePopup}
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
    </div>
  );
};
