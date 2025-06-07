"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileNav from "@/components/ui/MobileNav";

interface SettingsLayoutProps {
  left: React.ReactNode;
  mainContent: React.ReactNode;
  className?: string;
}

export function SettingsLayout({
  left,
  mainContent,
  className,
}: SettingsLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {!isMobile ? (
        <div className="flex h-screen overflow-hidden">
          <aside className="w-64 flex-shrink-0 hidden md:block overflow-y-auto border-r border-border bg-sidebar">
            {left}
          </aside>

          <main className="flex-1 overflow-y-auto">{mainContent}</main>
        </div>
      ) : (
        <div className="flex flex-col h-screen">
          <main className="flex-1 overflow-y-auto pb-16">{mainContent}</main>          
          <MobileNav />
        </div>
      )}
    </div>
  );
}

export default SettingsLayout;
