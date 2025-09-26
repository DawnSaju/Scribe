'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

type SupabaseContextType = {
    supabase: SupabaseClient;
    user: User | null;
    isLoading: boolean;
};

const Context = createContext<SupabaseContextType | undefined>(undefined);

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
    const [supabase] = useState(() =>
        createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
    );
    const [user, setUser] = useState<User | null>(() => {
        // Try to get cached user data first for faster initial load
        if (typeof window !== 'undefined') {
            try {
                const cachedUser = localStorage.getItem('user');
                return cachedUser ? JSON.parse(cachedUser) : null;
            } catch {
                return null;
            }
        }
        return null;
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (!isMounted) return;

            const newUser = session?.user ?? null;
            
            setUser(currentUser => {
                // Avoid unnecessary re-renders if user hasn't changed
                if (currentUser?.id === newUser?.id) {
                    return currentUser;
                }
                
                // Update localStorage cache
                if (newUser) {
                    localStorage.setItem('user', JSON.stringify(newUser));
                } else {
                    localStorage.removeItem('user');
                }
                
                return newUser;
            });

            // Handle auth events for better UX
            if (event === 'SIGNED_OUT') {
                localStorage.removeItem('user');
            }
        });

        // Get initial session with faster resolution
        const getInitialSession = async () => {
            try {
                const { data: { user: initialUser }, error } = await supabase.auth.getUser();
                
                if (isMounted) {
                    if (!error && initialUser) {
                        setUser(initialUser);
                        localStorage.setItem('user', JSON.stringify(initialUser));
                    } else if (!initialUser) {
                        setUser(null);
                        localStorage.removeItem('user');
                    }
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error getting initial user:', error);
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        getInitialSession();

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [supabase]);

    return (
        <Context.Provider value={{ supabase, user, isLoading }}>
            {children}
        </Context.Provider>
    );
}

export const useSupabase = () => {
    const context = useContext(Context);

    if (context === undefined) {
        throw new Error('useSupabase must be used inside the SupabaseProvider function');
    }

    return context;
}; 