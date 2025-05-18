
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Navigation from "@/components/ui/Navigation";
import Words from "@/components/ui/Words";
import Stats from "@/components/ui/Stats";

export const dynamic = 'force-dynamic';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardLayout
        left={<Navigation />}
        mainContent={<Words/>}
        right={<Stats />}
      />
    </div>
  );
};
