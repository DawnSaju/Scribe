import React from "react";
import NavPane from "@/components/layout/NavPane";
import MobileNav from "@/components/layout/MobileNav";
import ProfilePane from "@/components/layout/ProfilePane";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { redirect } from "next/navigation";
import ClientAuthGuard from "@/components/layout/ClientAuthGuard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await convexAuthNextjsToken();
  if (!token) {
    redirect("/auth");
  }

  return (
    <ClientAuthGuard>
      <div className="flex min-h-screen w-full bg-[#f3f3f3] font-['Inter',sans-serif]">
        <aside className="hidden lg:block w-[260px] flex-shrink-0 p-[8px] h-screen sticky top-0">
          <NavPane />
        </aside>
        <main className="flex-1 overflow-y-auto lg:pb-0 pb-[64px]">
          {children}
        </main>
        <aside className="hidden xl:block w-[300px] flex-shrink-0 p-[8px] h-screen sticky top-0 overflow-y-auto">
          <ProfilePane />
        </aside>
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
          <MobileNav />
        </div>
      </div>
    </ClientAuthGuard>
  );
}
