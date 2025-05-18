"use client";

import React from "react";
import { Home, BarChart, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Navigation() {
    const router = useRouter()

    const handleLogOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (!error) {
            router.push("/auth")
        } else {
            console.error("Logout error:", error.message)
        }
    }
  return (
    <div className="flex h-full flex-col justify-between p-4">
      <div>
        <div className="mb-6 px-2">
          <h1 className="text-xl font-semibold">Scribe</h1>
          <p className="text-xs text-muted-foreground">Language Learning Dashboard</p>
        </div>
        
        <nav className="space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3" asChild>
            <Link href="/">
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
          </Button>
          
          <Button variant="ghost" className="w-full justify-start gap-3" asChild>
            <Link href="/stats">
              <BarChart size={18} />
              <span>Statistics</span>
            </Link>
          </Button>
          
          <Button variant="ghost" className="w-full justify-start gap-3" asChild>
            <Link href="/profile">
              <User size={18} />
              <span>Profile</span>
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
          <div className="text-lg font-semibold">0 days</div>
          <div className="mt-1 text-xs text-muted-foreground">Keep learning to extend your streak!</div>
        </div>
      </div>
    </div>
  );
};
