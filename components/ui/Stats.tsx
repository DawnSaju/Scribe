"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExtensionConnector } from "@/lib/extension";

type Word = {
  id: string;
  word: string;
  part_of_speech: string;
  is_new?: boolean;
  definition: string;
  example: string;
  platform: string;
  show_name: string;
  season: number;
  episode: number;
};

export default function StatsPanel() {
  const [userWords, setUserWords] = useState<Word[]>([]);
  
  useEffect(() => {
    const unsubscribe = ExtensionConnector.listenForWordMessages((word) => {
      console.log("RECEIVED THE WORDS (STATS):",word)
      setUserWords(prev => [...prev, word]);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      <h2 className="mb-4 text-lg font-semibold">Progress Overview</h2>

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Words Learned Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userWords.filter(w => w.is_new).length}</div>
          <div className="text-xs text-muted-foreground">{userWords.filter(w => w.is_new).length} from yesterday</div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Vocabulary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">NaN</div>
          <div className="text-xs text-muted-foreground">Stats</div>
        </CardContent>
      </Card>

      <Separator className="my-4" />

      <h2 className="mb-2 mt-4 text-sm font-medium">Daily Goals</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs">New words</span>
          <span className="text-xs font-medium">0/20</span>
        </div>
        <div className="h-2 rounded-full bg-secondary">
          <div className="h-2 w-1 rounded-full bg-primary"></div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs">Reviews</span>
          <span className="text-xs font-medium">0/50</span>
        </div>
        <div className="h-2 rounded-full bg-secondary">
          <div className="h-2 w-1 rounded-full bg-primary"></div>
        </div>
      </div>
    </div>
  );
};