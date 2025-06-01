import React from "react";
import ChatLayout from "@/components/ChatLayout";
import Navigation from "@/components/ui/Navigation";
import Chat from "@/components/ui/chat";
import Sidebar from "@/components/ui/Siderbar";

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
