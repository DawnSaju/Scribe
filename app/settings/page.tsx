import React from "react";
import SettingsLayout from "@/components/SettingsLayout";
import Navigation from "@/components/layout/Navigation";
import Settings from "@/components/features/Settings";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { redirect } from "next/navigation";

import ClientAuthGuard from "@/components/layout/ClientAuthGuard";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const token = await convexAuthNextjsToken();
  if (!token) {
    redirect("/auth");
  }

  return (
    <ClientAuthGuard>
      <div className="min-h-screen bg-background">
        <SettingsLayout
          left={<Navigation />}
          mainContent={<Settings />}
        />
      </div>
    </ClientAuthGuard>
  );
}