
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Navigation from "@/components/layout/Navigation";
import Words from "@/components/features/words/WordsList";
import Sidebar from "@/components/layout/Sidebar";
import WordOfTheDay from "@/components/features/WordOfTheDay";

export const dynamic = 'force-dynamic';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardLayout
        left={<Navigation />}
        mainContent={
          <div className="space-y-6">
            <WordOfTheDay />
            <Words />
          </div>
        }
        right={<Sidebar />}
      />
    </div>
  );
};
