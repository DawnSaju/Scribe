"use client";

import React, { useState, useEffect } from "react";
import { Home, Settings, LogOut, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Navigation() {
  const router = useRouter();
  const user = useQuery(api.users.current);
  const updateStreak = useMutation(api.users.updateStreak);
  const { signOut } = useAuthActions();

  const handleLogOut = async () => {
      try {
          await signOut();
      } catch (error: any) {
          console.error("Logout error:", error.message)
      }
  }

  useEffect(() => {
    if (user?._id) {
      updateStreak();
    }
  }, [user?._id, updateStreak]);

  const streak = user?.streakCount || 0;

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
          
          <Button onClick={handleLogOut} variant="ghost" className="w-full justify-start gap-3">
            <LogOut className="text-red-600" size={18} />
            <span className="text-red-600">Logout</span>
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
