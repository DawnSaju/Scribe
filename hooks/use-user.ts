import { useEffect, useState } from 'react';
import { User, AuthChangeEvent } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error getting user:', error);
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(user);
        setLoading(false);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent) => {
          if (event === 'SIGNED_OUT') {
            setUser(null);
            router.refresh();
          } else {
            const { data: { user: newUser } } = await supabase.auth.getUser();
            setUser(newUser);
          }
          setLoading(false);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error in auth initialization:', error);
        setUser(null);
        setLoading(false);
      }
    };

    initializeAuth();
  }, [router, supabase.auth]);

  return { user, loading };
} 