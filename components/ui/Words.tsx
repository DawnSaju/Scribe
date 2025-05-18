"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/utils/supabase/client";
import { RocketIcon, ChromeIcon, PuzzleIcon } from "lucide-react";

export default function Words() {
  type UserData = {
    name?: string; 
    [key: string]: unknown;
  };

  type Word = {
    id: string;
    word: string;
    part_of_speech: string;
    is_new?: boolean;
    definition: string;
    context: string;
    platform: string;
    show_name: string;
    season: number;
    episode: number;
  };

  const [userData, setUserData] = useState<UserData>({});
  const [userWords, setUserWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // console.log(user);
        setUserData(user.user_metadata)
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    const getWords = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('learned_words')
          .select('id, word, part_of_speech, definition, context, show_name, season, episode, platform, is_new')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching learned words:', error.message);
        } else {
          // console.log('Words from supabase:', data);
          setUserWords(data || []);
        }
      } else {
        console.log('User not authenticated');
      }
      setLoading(false);
    };

    getWords();
  }, []);

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Welcome back, {userData.name}</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>
        <Button disabled variant="outline">
          <ChromeIcon className="mr-2 h-4 w-4" />
          Install Extension
        </Button>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Words Learned</CardDescription>
            <CardTitle className="text-2xl">{userWords.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+{userWords.filter(w => w.is_new).length} this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Streak</CardDescription>
            <CardTitle className="text-2xl">0 days</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Keep going!</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Retention Rate</CardDescription>
            <CardTitle className="text-2xl">0%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Time Studied</CardDescription>
            <CardTitle className="text-2xl">0h 0m</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-4 text-lg font-medium">Recent Words</h2>
      
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <div className="animate-pulse text-center">
            <p className="text-lg text-muted-foreground">Loading your words...</p>
          </div>
        </div>
      ) : userWords.length > 0 ? (
        <div className="space-y-4">
          {userWords.map((word) => (
            <Card key={word.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle>{word.word}</CardTitle>
                    <span className="text-xs text-muted-foreground">{word.part_of_speech}</span>
                  </div>
                  {word.is_new && <Badge variant="outline" className="bg-primary/10">New</Badge>}
                </div>
                <CardDescription>{word.definition}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2 pt-0">
                <p className="text-sm italic">&quot;{word.context}&quot;</p>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
                <div className="flex w-full items-center justify-between">
                  <span>
                    From: {word.platform} • {word.show_name} • S{word.season}E{word.episode}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Review</Button>
                    <Button variant="ghost" size="sm">Save</Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <PuzzleIcon className="h-10 w-10 text-primary" />
          </div>
          <h3 className="mt-6 text-xl font-semibold">Start Collecting Words</h3>
          <p className="mb-6 mt-2 text-sm text-muted-foreground max-w-md">
            Use our browser extension to easily save words while watching shows. 
            The words you collect will appear here for review and practice.
          </p>
          <div className="flex gap-4">
            <Button disabled>
              <ChromeIcon className="mr-2 h-4 w-4" />
              Get the Extension
            </Button>
            <Button variant="outline">
              <RocketIcon className="mr-2 h-4 w-4" />
              How It Works
            </Button>
          </div>
          <div className="mt-6 text-xs text-muted-foreground">
            Already using the extension? Try watching content to collect your first words.
          </div>
        </div>
      )}
    </div>
  );
}