
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Navigation from "@/components/ui/Navigation";
import Words from "@/components/ui/Words";
import Sidebar from "@/components/ui/Siderbar";

export const dynamic = 'force-dynamic';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardLayout
        left={<Navigation />}
        mainContent={<Words/>}
        right={<Sidebar />}
      />
    </div>
  );
};
