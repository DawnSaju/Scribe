import React from "react";
import ChatLayout from "@/components/ChatLayout";
import Navigation from "@/components/layout/Navigation";
import Chat from "@/components/features/Chat";
import ProfilePane from "@/components/layout/ProfilePane";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { redirect } from "next/navigation";

import ClientAuthGuard from "@/components/layout/ClientAuthGuard";

export const dynamic = 'force-dynamic';

export default async function ChatPage() {
  const token = await convexAuthNextjsToken();
  if (!token) {
    redirect("/auth");
  }

  return (
    <ClientAuthGuard>
      <div className="min-h-screen bg-background">
        <ChatLayout
          left={<Navigation />}
          mainContent={<Chat/>}
          right={<ProfilePane />}
        />
      </div>
    </ClientAuthGuard>
  );
};
