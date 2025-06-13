'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

export const dynamic = 'force-dynamic';

const CallbackPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      setLoading(false);
      router.push('/auth');
      return;
    }

    const handleCallback = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !sessionData.session?.user) {
          console.error('Error fetching session:', sessionError?.message);
          router.push('/auth');
          return;
        }

        const user = sessionData.session.user;
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
  }, [searchParams, router]);

  if (loading) return <div>Loading...</div>;

  return null;
};

export default function SuspenseCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackPage />
    </Suspense>
  );
}
