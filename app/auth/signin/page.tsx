"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Mail, Lock, Quote } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { RiGithubFill, RiGoogleFill } from "@remixicon/react";

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
    const {error} = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      },
    })
    if (error) {
      console.error("Google auth error:", error.message)
    }
  }

  const handleGithubAuth = async () => {
    const {error} = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      },
    })
    if (error) {
      console.error("Github auth error:", error.message)
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

                  <Button onClick={handleGithubAuth} className="w-42 h-11 flex items-center justify-center gap-3 bg-gradient-to-r from-[#333333] to-[#2c2c2c] rounded-md shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                    <RiGithubFill className="text-white opacity-90" size={25} aria-hidden="true" />
                    <span className="text-white text-sm font-medium">GitHub</span>
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