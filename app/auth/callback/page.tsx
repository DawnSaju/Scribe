'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { useSupabase } from '@/db/SupabaseProvider';

export const dynamic = 'force-dynamic';

const CallbackPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { user, isLoading } = useSupabase();

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      setLoading(false);
      router.push('/auth');
      return;
    }

    if (isLoading) return;

    const handleCallback = async () => {
      try {
        
        if (!user) {
          console.error('No user found in session');
          router.push('/auth');
          return;
        }

        const hasOnboarded = user.user_metadata?.has_onboarded;
        const currentXP = user.user_metadata?.XP ?? 0;

        localStorage.setItem('user', JSON.stringify(user));

        if (hasOnboarded === undefined) {
          supabase.auth.updateUser({
            data: { has_onboarded: false, XP: currentXP }
          }).then(({ error: updateError }) => {
            if (updateError) {
              console.error('Failed to update user metadata:', updateError.message);
            }
          });
          router.push('/onboarding');
          return;
        } else {
          router.push(hasOnboarded ? '/dashboard' : '/onboarding');
        }

      } catch (err) {
        console.error('OAuth callback error:', err);
        router.push('/auth');
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, router, user, isLoading]);

  if (loading || isLoading) {
    return <div>Loading...</div>;
  } 

  return null;
};

export default function SuspenseCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackPage />
    </Suspense>
  );
}
