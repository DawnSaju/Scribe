import React from "react";
import SettingsLayout from "@/components/SettingsLayout";
import Navigation from "@/components/ui/Navigation";
import Settings from "@/components/ui/Settings";

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SettingsLayout
        left={<Navigation />}
        mainContent={<Settings />}
      />
    </div>
  );
}