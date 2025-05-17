
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function StatsPanel() {
  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      <h2 className="mb-4 text-lg font-semibold">Progress Overview</h2>

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Words Learned Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <div className="text-xs text-muted-foreground">+6 from yesterday</div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Vocabulary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,235</div>
          <div className="text-xs text-muted-foreground">You're in the top 15%</div>
        </CardContent>
      </Card>

      <Separator className="my-4" />

      <h2 className="mb-2 mt-4 text-sm font-medium">Daily Goals</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs">New words</span>
          <span className="text-xs font-medium">15/20</span>
        </div>
        <div className="h-2 rounded-full bg-secondary">
          <div className="h-2 w-3/4 rounded-full bg-primary"></div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs">Reviews</span>
          <span className="text-xs font-medium">32/50</span>
        </div>
        <div className="h-2 rounded-full bg-secondary">
          <div className="h-2 w-3/5 rounded-full bg-primary"></div>
        </div>
      </div>
    </div>
  );
};