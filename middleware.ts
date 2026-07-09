import { convexAuthNextjsMiddleware, createRouteMatcher, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";

const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)', 
    '/chat(.*)', 
    '/settings(.*)', 
    '/onboarding(.*)', 
    '/api(.*)'
]);

export default convexAuthNextjsMiddleware((request, { convexAuth }) => {
    if (isProtectedRoute(request) && !convexAuth.isAuthenticated()) {
        const redirectUrl = new URL('/auth', request.url);
        redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
        return nextjsMiddlewareRedirect(request, redirectUrl.pathname + redirectUrl.search);
    }
});

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
