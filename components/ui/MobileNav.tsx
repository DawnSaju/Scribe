
import React from "react";
import { Home, MessageSquare, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function MobileNav() {
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
    <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-background p-2 md:hidden">
      <div className="flex items-center justify-around">
        <Link href="/dashboard" className="flex flex-col items-center p-2 text-foreground hover:text-primary">
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary">
          <MessageSquare size={20} />
          <span className="text-xs mt-1">Chat</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary">
          <Settings size={20} />
          <span className="text-xs mt-1">Settings</span>
        </Link>
        <Button onClick={handleLogOut}  className="flex flex-col items-center p-2 text-muted-foreground bg-transparent">
          <LogOut size={20} />
          <span className="text-xs mt-1">Logout</span>
        </Button>
      </div>
    </div>
  );
};
