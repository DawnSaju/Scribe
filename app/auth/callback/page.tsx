'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const dynamic = 'force-dynamic';

const LoadingScreen = ({ message }: { message: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center max-w-md px-6">
      <div className="mb-8">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-gray-100 rounded-full mx-auto"></div>
          <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-[#1e78fc] rounded-full animate-spin mx-auto"></div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium text-gray-900">Setting up your account</h2>
        <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
      </div>

      <div className="flex justify-center space-x-2 mt-8">
        <div className="w-2 h-2 bg-[#1e78fc] rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  </div>
);

const CallbackPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useQuery(api.users.current);
  const isLoading = user === undefined;
  const [status, setStatus] = useState<'loading' | 'processing' | 'redirecting'>('loading');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          console.error('OAuth error:', error, errorDescription);
          router.replace('/auth?error=' + encodeURIComponent(error));
          return;
        }

        if (isLoading) {
          return;
        }

        setStatus('processing');

        if (user) {
          setStatus('redirecting');

          localStorage.setItem('user', JSON.stringify(user));

          const hasOnboarded = user.has_onboarded;

          if (hasOnboarded === undefined || hasOnboarded === false) {
            router.replace('/onboarding');
          } else {
            router.replace('/dashboard');
          }
        } else {
          console.error('No user found after callback');
          router.replace('/auth');
        }

      } catch (err) {
        console.error('OAuth callback error:', err);
        router.replace('/auth');
      }
    };

    handleCallback();
  }, [searchParams, router, user, isLoading]);

  const getMessage = () => {
    switch (status) {
      case 'loading':
        return 'Verifying your authentication...';
      case 'processing':
        return 'Processing your account details...';
      case 'redirecting':
        return 'Almost ready! Taking you to your dashboard...';
      default:
        return 'Loading...';
    }
  };

  return <LoadingScreen message={getMessage()} />;
};

export default function SuspenseCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-100 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <CallbackPage />
    </Suspense>
  );
}
