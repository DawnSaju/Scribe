"use client";

export const dynamic = 'force-dynamic';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Mail, Lock, Quote } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { RiGoogleFill } from "@remixicon/react";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        console.log(user);
        router.push('/dashboard');
      }
    };

    checkUser();
  }, [router]);
  
  const handleGoogleAuth = async () => {
    const isDEV = typeof window !== 'undefined' && 
                 window.location.host.includes('ngrok-free.app');
                 
    const redirectURL = isDEV
    ? `${window.location.origin}/auth/callback`
    : `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`;

    const {error} = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectURL,
        skipBrowserRedirect: false,
        queryParams: {
          prompt: 'consent',
          access_type: 'offline'
        }
      },
    })
    if (error) {
      console.error("Google auth error:", error.message)
    }
  }

  const handleSlackAuth = async () => {
    const isDEV = typeof window !== 'undefined' && 
                 window.location.host.includes('ngrok-free.app');
                 
    const redirectURL = isDEV
    ? `${window.location.origin}/auth/callback`
    : `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`;

    const {error} = await supabase.auth.signInWithOAuth({
      provider: "slack_oidc",
      options: {
        redirectTo: redirectURL,
        skipBrowserRedirect: false,
      },
    })
    if (error) {
      console.error("Slack auth error:", error.message)
    }
  }
  
  return (
    <>
      <section className="font-['DM Sans']">
        <div className="min-h-screen lg:flex">
          <div className="flex flex-col items-center justify-center min-h-screen lg:w-1/2 py-10 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
              <div className="text-left">
                <Link href="/" className="text-xs font-['DM Sans'] font-bold tracking-widest text-gray-500 uppercase">
                  / GO BACK
                </Link>
              </div>

              <h2 className="mt-6 text-left text-4xl font-['DM Sans'] font-bold text-gray-900">
                Welcome back to Scribe
              </h2>

              <form className="mt-8 space-y-6" action="#" method="POST">
                <input type="hidden" name="remember" defaultValue="true" />

                <div className="rounded-md shadow-sm -space-y-px">
                  <div className="relative mb-4">
                    <label htmlFor="username" className="sr-only">Username</label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="off"
                      required
                      className="appearance-none relative block w-full px-3 py-4 pl-10 border border-gray-200 bg-gray-50 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Username"
                    />
                  </div>

                  <div className="relative">
                    <label htmlFor="password" className="sr-only">Password</label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="off"
                      required
                      className="appearance-none relative block w-full px-3 py-4 pl-10 border border-gray-200 bg-gray-50 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Password (min. 8 characters)"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link href="/auth/forgot-password" className="font-['DM Sans'] font-medium text-[#1E78FF] hover:[#1E78FF/80]">
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                <div className="relative mt-6 pt-1">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1E78FF] to-[#8AB9FF] rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <button
                    type="submit"
                    className="relative group w-full flex justify-center py-3 px-4 border border-transparent text-sm font-['DM Sans'] font-bold rounded-md text-white bg-[#1E78FF] hover:bg-[#1E78FF/80] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </form>

              <div className="text-center mt-6 mb-6">
                  <span className="text-sm text-gray-500">Or continue with</span>
                </div>

                <div className="flex flex-row justify-center items-center gap-6 mt-8">
                  <Button onClick={handleGoogleAuth} className="w-42 h-11 flex items-center justify-center gap-3 bg-gradient-to-r from-[#f1f1f1] to-[#f1f1f1] rounded-md shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                    <RiGoogleFill className="text-[#4285F4] opacity-90" size={25} aria-hidden="true" />
                    <span className="text-[#4285F4] text-sm font-medium">Google</span>
                  </Button>
  
                  <Button
                    onClick={handleSlackAuth}
                    className="w-42 h-11 flex items-center justify-center gap-3 bg-gradient-to-r from-[#4A154B] to-[#5E2D79] hover:bg-gradient-to-r hover:from-[#4A154B] hover:to-[#88258a] rounded-md shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_225_481)">
                        <path d="M6.35319 14.3464C6.35319 15.4665 5.44506 16.3765 4.32316 16.3765C3.20125 16.3765 2.29495 15.4665 2.29495 14.3464C2.29495 13.2264 3.20308 12.3164 4.32498 12.3164H6.35501V14.3464H6.35319Z" fill="#E01E5A"/>
                        <path d="M7.36728 14.3464C7.36728 13.2264 8.2754 12.3164 9.39731 12.3164C10.5192 12.3164 11.4273 13.2245 11.4273 14.3464V19.4206C11.4273 20.5407 10.5192 21.4506 9.39731 21.4506C8.2754 21.4506 7.36728 20.5425 7.36728 19.4206V14.3464Z" fill="#E01E5A"/>
                        <path d="M9.39731 6.22815C8.27723 6.22815 7.36728 5.32003 7.36728 4.19812C7.36728 3.07622 8.27723 2.16992 9.39731 2.16992C10.5174 2.16992 11.4273 3.07805 11.4273 4.19995V6.22998H9.39731V6.22815Z" fill="#36C5F0"/>
                        <path d="M9.39731 7.24414C10.5174 7.24414 11.4273 8.15226 11.4273 9.27417C11.4273 10.3961 10.5192 11.3042 9.39731 11.3042H4.32315C3.20307 11.3042 2.29312 10.3961 2.29312 9.27417C2.29312 8.15226 3.20124 7.24414 4.32315 7.24414H9.39731Z" fill="#36C5F0"/>
                        <path d="M17.5156 9.27222C17.5156 8.15214 18.4237 7.24219 19.5456 7.24219C20.6657 7.24219 21.5757 8.15031 21.5757 9.27222C21.5757 10.3941 20.6675 11.3022 19.5456 11.3022H17.5156V9.27222Z" fill="#2EB67D"/>
                        <path d="M16.4997 9.27229C16.4997 10.3924 15.5915 11.3023 14.4696 11.3023C13.3496 11.3023 12.4396 10.3942 12.4396 9.27229V4.19995C12.4414 3.07805 13.3496 2.16992 14.4715 2.16992C15.5915 2.16992 16.5015 3.07805 16.5015 4.19995V9.27229H16.4997Z" fill="#2EB67D"/>
                        <path d="M14.4715 17.3911C15.5915 17.3911 16.5015 18.2992 16.5015 19.4211C16.5015 20.5412 15.5934 21.4512 14.4715 21.4512C13.3514 21.4512 12.4414 20.543 12.4414 19.4211V17.3911H14.4715Z" fill="#ECB22E"/>
                        <path d="M14.4715 16.3765C13.3514 16.3765 12.4414 15.4683 12.4414 14.3464C12.4414 13.2245 13.3496 12.3164 14.4715 12.3164H19.5456C20.6657 12.3164 21.5757 13.2245 21.5757 14.3464C21.5757 15.4683 20.6675 16.3765 19.5456 16.3765H14.4715Z" fill="#ECB22E"/>
                      </g>
                    </svg>
                    <span className="text-white text-sm font-medium">Slack</span>
                  </Button>
                </div>

              <p className="mt-8 text-center text-sm text-gray-600">
                Don’t have an account?{' '}
                <Link href="/auth/signup" className="font-['DM Sans'] font-bold text-[#1E78FF] hover:underline">
                  Sign up now
                </Link>
              </p>
            </div>
          </div>

          <div className="relative hidden lg:flex items-center justify-center lg:w-1/2 bg-[#1E78FF] text-white p-8 md:p-12">
            <img
              className="absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-luminosity"
              src="../bg/pattern.png"
              alt="bg pattern"
            />

            <div className="relative z-10 w-full max-w-md">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-gray-50 rounded-lg mb-8">
                <Quote className="h-8 w-8 text-black" strokeWidth={1.5} />
              </div>

              <blockquote className="space-y-4">
                <p className="text-2xl xl:text-3xl font-['DM Sans'] font-medium leading-tight">
                  “Scribe makes learning vocabulary from shows so intuitive! My new learning routine is so much more engaging and effective. I just watch, click, and learn.”
                </p>
              </blockquote>

              <div className="flex items-center mt-10">
                <img
                  className="flex-shrink-0 h-12 w-12 rounded-full object-cover"
                  src="https://ui-avatars.com/api/?name=John+Doe"
                  alt="User avatar"
                />
                <div className="ml-4">
                  <p className="text-lg font-['DM Sans'] font-semibold text-white">John Doe</p>
                  <p className="mt-0.5 text-sm text-gray-200">Language Learner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
