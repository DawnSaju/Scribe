import React from "react";
import ChatLayout from "@/components/ChatLayout";
import Navigation from "@/components/layout/Navigation";
import Chat from "@/components/features/Chat";
import Sidebar from "@/components/layout/Sidebar";

export const dynamic = 'force-dynamic';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background">
      <ChatLayout
        left={<Navigation />}
        mainContent={<Chat/>}
        right={<Sidebar />}
      />
    </div>
  );
};
