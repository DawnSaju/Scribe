"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, MessageSquare, Settings, LogOut, ChevronRight } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";

export default function NavPane() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useQuery(api.users.current);
  const updateStreak = useMutation(api.users.updateStreak);
  const pendingRequests = useQuery(api.queries.getPendingReceivedRequests) || [];
  const { signOut } = useAuthActions();

  useEffect(() => {
    if (user?._id) {
      updateStreak();
    }
  }, [user?._id, updateStreak]);

  const handleLogOut = async () => {
    try {
      await signOut();
      router.push("/auth");
    } catch (error: any) {
      console.error("Logout error:", error.message);
    }
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/chat", label: "Chat", icon: MessageSquare },
  ];

  const toolItems = [
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-full h-full flex flex-col drop-shadow-[0px_0px_0.5px_rgba(0,0,0,0.35),-3px_3px_3.5px_rgba(0,0,0,0.04)] relative rounded-[12px] p-[8px]">
      <div aria-hidden className="absolute bg-[#f5f5f5] inset-0 pointer-events-none rounded-[12px]" />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_0px_12px_0px_white,inset_0px_0px_0px_0px_white]" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-[8px] px-[8px] py-[12px] mb-[12px]">
          <h1 className="font-medium text-[24px] tracking-[-0.6px] text-[#1E78FF] leading-[32px]">
            Scribe
          </h1>
        </div>

        <div className="px-[8px] mb-[8px]">
          <h2 className="text-[11px] font-medium text-[#666] tracking-[-0.275px] leading-[16.5px] uppercase mb-[8px]">
            Main Menu
          </h2>
          <div className="flex flex-col gap-[2px]">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`relative flex items-center px-[8px] py-[6px] gap-[12px] rounded-[8px] cursor-pointer group ${isActive ? 'shadow-[0px_0px_1px_0px_rgba(0,0,0,0.35),-3px_3px_7px_0px_rgba(0,0,0,0.04)]' : ''}`}>
                    {isActive && (
                      <>
                        <div aria-hidden className="absolute bg-[#f5f5f5] inset-0 pointer-events-none rounded-[8px]" />
                        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_0px_12px_0px_white,inset_0px_0px_0px_0px_white]" />
                      </>
                    )}
                    {!isActive && (
                      <div className="absolute inset-0 rounded-[8px] bg-transparent group-hover:bg-[rgba(0,0,0,0.02)] transition-colors pointer-events-none" />
                    )}
                    <item.icon size={18} className={`relative z-10 ${isActive ? 'text-[#1E78FF]' : 'text-[#606060] group-hover:text-[#4b4b4b]'}`} />
                    <span className={`relative z-10 text-[12px] font-medium leading-[16px] ${isActive ? 'text-[#1E78FF]' : 'text-[#4b4b4b]'}`}>
                      {item.label}
                    </span>
                    {item.label === 'Chat' && pendingRequests.length > 0 && (
                      <div className="ml-auto opacity-90 px-[6px] py-[2px] rounded-[6px] shadow-[0px_3px_7px_0px_rgba(0,0,0,0.31),0px_0px_0px_0px_#606060] relative">
                        <div aria-hidden className="absolute bg-[rgba(128,128,128,0.85)] inset-0 pointer-events-none rounded-[6px]" />
                        <p className="relative z-10 text-[9px] text-white font-medium">{pendingRequests.length}</p>
                        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_12px_0px_rgba(255,255,255,0.5),inset_0px_1px_0px_0px_rgba(255,255,255,0.44),inset_0px_-0.5px_0px_0px_rgba(255,255,255,0.31)]" />
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="my-[12px] bg-[rgba(0,0,0,0.11)] h-px w-full shadow-[0px_1px_0px_0px_white]" />

        <div className="px-[8px] mb-[8px] flex-1 flex flex-col justify-end">
          <h2 className="text-[11px] font-medium text-[#666] tracking-[-0.275px] leading-[16.5px] uppercase mb-[8px]">
            Tools
          </h2>
          <div className="flex flex-col gap-[2px]">
            {toolItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`relative flex items-center px-[8px] py-[6px] gap-[12px] rounded-[8px] cursor-pointer group ${isActive ? 'shadow-[0px_0px_1px_0px_rgba(0,0,0,0.35),-3px_3px_7px_0px_rgba(0,0,0,0.04)]' : ''}`}>
                    {isActive && (
                      <>
                        <div aria-hidden className="absolute bg-[#f5f5f5] inset-0 pointer-events-none rounded-[8px]" />
                        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_0px_12px_0px_white,inset_0px_0px_0px_0px_white]" />
                      </>
                    )}
                    {!isActive && (
                      <div className="absolute inset-0 rounded-[8px] bg-transparent group-hover:bg-[rgba(0,0,0,0.02)] transition-colors pointer-events-none" />
                    )}
                    <item.icon size={18} className={`relative z-10 ${isActive ? 'text-[#1E78FF]' : 'text-[#606060] group-hover:text-[#4b4b4b]'}`} />
                    <span className={`relative z-10 text-[12px] font-medium leading-[16px] ${isActive ? 'text-[#1E78FF]' : 'text-[#4b4b4b]'}`}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}

            <div onClick={handleLogOut} className="relative flex items-center px-[8px] py-[6px] gap-[12px] rounded-[8px] cursor-pointer group">
              <div className="absolute inset-0 rounded-[8px] bg-transparent group-hover:bg-[rgba(0,0,0,0.02)] transition-colors pointer-events-none" />
              <LogOut size={18} className="relative z-10 text-[#ef4444]" />
              <span className="relative z-10 text-[12px] font-medium leading-[16px] text-[#ef4444]">
                Logout
              </span>
            </div>
          </div>
        </div>

        <div className="my-[12px] bg-[rgba(0,0,0,0.11)] h-px w-full shadow-[0px_1px_0px_0px_white]" />

        <div className="flex items-center gap-[8px] px-[8px] py-[6px]">
          <div className="rounded-full shadow-[0px_3px_5px_0px_rgba(0,0,0,0.22),0px_0px_0px_0px_rgba(96,96,96,0.31)] size-[40px] relative shrink-0">
            <div aria-hidden className="absolute bg-gradient-to-b from-[#f0f0f0] via-[rgba(240,240,240,0.6)] to-[#dadada] inset-0 pointer-events-none rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden">
              {user?.image || (user as any)?.avatar_url ? (
                <Image src={user?.image || (user as any)?.avatar_url} alt="Avatar" width={32} height={32} className="rounded-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-medium text-gray-500 relative z-20">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
                </div>
              )}
            </div>
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_12px_0px_rgba(255,255,255,0.5),inset_0px_1px_0px_0px_rgba(255,255,255,0.44),inset_0px_-0.5px_0px_0px_rgba(255,255,255,0.31)]" />
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-[12px] font-medium text-[#4b4b4b] truncate">{user?.name || "User"}</p>
            <p className="text-[11px] text-[#606060] truncate">{user?.email}</p>
          </div>
          <div className="ml-auto text-[#606060]">
            <ChevronRight size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}
