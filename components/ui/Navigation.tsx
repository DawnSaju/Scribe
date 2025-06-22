"use client";

import React, { useState, useEffect } from "react";
import { Home, Settings, LogOut, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/db/SupabaseProvider";

export default function Navigation() {
  const [streak, setStreak] = useState(0);
  const router = useRouter();
  const { user } = useSupabase();

  const handleLogOut = async () => {
      const { error } = await supabase.auth.signOut()
      if (!error) {
          router.push("/auth")
      } else {
          console.error("Logout error:", error.message)
      }
  }

  useEffect(() => {
    const streak = async () => {
      if (!user) {
        return;
      }
      
      const today = new Date();
      const prevSignin = user.user_metadata?.last_sign_in_at ? new Date(user.user_metadata.last_sign_in_at) : null;
      let newStreak = user.user_metadata?.streakCount || 0;
      let update = false;

      if (!prevSignin) {
        newStreak = 1;
        update = false;
      } else {
        const days = Math.floor((today.setHours(0,0,0,0) - prevSignin.setHours(0,0,0,0)) / (1000 * (60**2) * 24));
        if (days === 0) {

        } else if (days === 1) {
          newStreak += 1;
          update = true;
        } else if (days > 1) {
          newStreak = 1;
          update = true
        }
      }

      setStreak(newStreak);
      if (update) {
        await supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            last_sign_in_at: today.toISOString(),
            streakCount: newStreak,
          }
        });
      }
    }
    streak();
  }, [user]);

  return (
    <div className="flex h-full flex-col justify-between p-4">
      <div>
        <div className="mb-6 px-2">
          <h1 className="text-xl font-semibold">Scribe</h1>
          <p className="text-xs text-muted-foreground">Learning Dashboard</p>
        </div>
        
        <nav className="space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3" asChild>
            <Link href="/dashboard">
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
          </Button>
          
          <Button variant="ghost" className="w-full justify-start gap-3" asChild>
            <Link href="/chat">
              <MessageSquare size={18} />
              <span>Chat</span>
            </Link>
          </Button>
          
          <Button variant="ghost" className="w-full justify-start gap-3" asChild>
            <Link href="/settings">
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </Button>
          
          <Button onClick={handleLogOut} variant="ghost" className="w-full justify-start gap-3" asChild>
            <Link href="#">
              <LogOut className="text-red-600" size={18} />
              <span className="text-red-600">Logout</span>
            </Link>
          </Button>
        </nav>
      </div>

      <div className="pt-4">
        <div className="rounded-md border border-border p-3">
          <div className="mb-1 text-xs font-medium">Streak</div>
          <div className="text-lg font-semibold">{streak} day{streak === 1 ? '' : 's'}</div>
          <div className="mt-1 text-xs text-muted-foreground">Keep learning to extend your streak!</div>
        </div>
      </div>
    </div>
  );
};
