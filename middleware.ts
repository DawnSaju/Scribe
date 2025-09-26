import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { user }, error } = await supabase.auth.getUser()

    const protectedRoutes = ['/dashboard', '/chat', '/settings', '/onboarding', '/api'];
    const publicRoutes = ['/auth', '/callback', '/', '/policy'];
    const routeName = request.nextUrl.pathname;

    const isProtectedRoute = protectedRoutes.some(path =>
        routeName.startsWith(path)
    );

    const isPublicRoute = publicRoutes.some(path =>
        routeName === path || routeName.startsWith(path)
    );

    if (isProtectedRoute && (error || !user)) {
        const redirectUrl = new URL('/auth', request.url);
        redirectUrl.searchParams.set('redirectTo', routeName);
        return NextResponse.redirect(redirectUrl);
    }

    if (user && !error) {
        const hasOnboarded = user.user_metadata?.has_onboarded;
        
        if (hasOnboarded !== true && routeName !== '/onboarding' && !routeName.startsWith('/auth') && !isPublicRoute) {
            return NextResponse.redirect(new URL('/onboarding', request.url));
        }
        
        if (hasOnboarded === true && routeName === '/onboarding') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }
    
    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}

