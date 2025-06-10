
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Navigation from "@/components/ui/Navigation";
import Words from "@/components/ui/Words";
import Sidebar from "@/components/ui/Siderbar";
import WordOfTheDay from "@/components/ui/word_of_the_day";

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
