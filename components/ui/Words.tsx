
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Words() {
  const words = [
    {
      id: 1,
      word: "Ephemeral",
      partOfSpeech: "adjective",
      definition: "Lasting for a very short time",
      context: "The beauty of cherry blossoms is ephemeral, lasting only a few days.",
      source: "Tokyo Documentary",
      timestamp: "12:45",
      isNew: true
    },
    {
      id: 2,
      word: "Serendipity",
      partOfSpeech: "noun",
      definition: "Finding something good without looking for it",
      context: "Meeting his future business partner was pure serendipity.",
      source: "Startup Stories",
      timestamp: "24:18",
      isNew: false
    },
    {
      id: 3,
      word: "Eloquent",
      partOfSpeech: "adjective",
      definition: "Fluent or persuasive in speaking or writing",
      context: "Her eloquent speech moved the entire audience.",
      source: "World Leaders",
      timestamp: "08:32",
      isNew: true
    },
  ];

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Welcome back, Dawn Saju</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>
        <Button variant="outline">New Word</Button>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Words Learned</CardDescription>
            <CardTitle className="text-2xl">1,234</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+45 this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Streak</CardDescription>
            <CardTitle className="text-2xl">7 days</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Keep going!</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Retention Rate</CardDescription>
            <CardTitle className="text-2xl">89%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+4% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Time Studied</CardDescription>
            <CardTitle className="text-2xl">12h 45m</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-4 text-lg font-medium">Recent Words</h2>
      
      <div className="space-y-4">
        {words.map((word) => (
          <Card key={word.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>{word.word}</CardTitle>
                  <span className="text-xs text-muted-foreground">{word.partOfSpeech}</span>
                </div>
                {word.isNew && <Badge variant="outline" className="bg-primary/10">New</Badge>}
              </div>
              <CardDescription>{word.definition}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2 pt-0">
              <p className="text-sm italic">"{word.context}"</p>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
              <div className="flex w-full items-center justify-between">
                <span>
                  From: {word.source} • {word.timestamp}
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    Review
                  </Button>
                  <Button variant="ghost" size="sm">
                    Save
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};