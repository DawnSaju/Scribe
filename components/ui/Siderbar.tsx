"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { UserPlus, Settings, BarChart2, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
  type UserData = {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserData(data.user as unknown as UserData);
        console.log(data?.user)
      } else {
        console.error(error);
      }
    }
    checkUser();
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto bg-white rounded-3xl p-6 relative overflow-hidden">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Your Profile</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
      </div>
      <div className="flex flex-col items-center mb-4">
        <div className="relative w-24 h-24 mb-2">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="8" fill="none" />
            <circle cx="50" cy="50" r="40" stroke="#2563EB" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset="50" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-gray-700 bg-white rounded-full">
            <Image
              className="rounded-full object-cover"
              src={userData?.user_metadata?.avatar_url || './default.svg'}
              alt={userData?.email || 'User avatar'}
              width={70}
              height={70}
            />
          </div>
        </div>
        <div className="text-center">
          <h1 className="capitalize text-lg font-semibold">{userData?.user_metadata?.full_name}</h1>
        </div>
      </div>
      <div className="flex justify-center gap-6 my-4">
        <button className="w-10 h-10 rounded-full border flex items-center justify-center text-gray-500 hover:bg-gray-100">
          <Settings className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-full border flex items-center justify-center text-gray-500 hover:bg-gray-100">
          <BarChart2 className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-full border flex items-center justify-center text-gray-500 hover:bg-gray-100">
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>
      <div className="w-full mt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-base font-semibold">Your Friends</div>
          <button className="w-7 h-7 rounded-full border flex items-center justify-center text-gray-500 hover:bg-gray-100">
            <UserPlus className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div className="text-xs text-gray-400 text-center">No Friends yet.</div>
        </div>
        <Button variant="outline" className="w-full mt-6 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl">See All</Button>

        <div className="mt-6">
          <div className="text-sm font-medium mb-2 text-gray-700">Requests</div>
          <div className="space-y-3">
              <div className="text-xs text-gray-400 text-center">You&apos;re all caught up</div>
          </div>
        </div>
      </div>
    </div>
  );
}

