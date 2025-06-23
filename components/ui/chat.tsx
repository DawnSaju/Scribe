"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Lightbulb, FileText, GraduationCap, MoreHorizontal, SquarePen, PlusCircle, ArrowUp, Volume2, User, Bot, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Markdown from 'react-markdown';
import { useSupabase } from '@/db/SupabaseProvider';

export default function Chat() {
  const { user } = useSupabase();
  
  const [messages, setMessages] = useState<{
    role: 'user' | 'assistant';
    content: string;
  }[]>([]);
  const [input, setInput] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [XPpoints, setXPpoints] = useState(0);

  useEffect(() => {
    if (user) {
      setIsReady(true);
      setXPpoints(user.user_metadata?.XP ?? 0);
    }
  }, [user])

  const handleUserXP = async (increment: number) => {
    setXPpoints(prevXP => {
      const newXP = Math.floor((prevXP ?? 0) + increment);
      if (user) {
        supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            XP: newXP
          }
        }).then(({ error: updateError }) => {
          if (updateError) {
            console.error('Failed to update user metadata:', updateError.message);
          }
        });
      }
      return newXP;
    });
  }

  const sendMessage = async () => {
    if (input.trim()) {
      const newUserMessage: { role: 'user', content: string } = { role: 'user', content: input };
      const allMessages = [...messages, newUserMessage];
      setMessages(allMessages);
      setInput('');
      setIsLoading(true);
      
      const { data: WordOfTheDay, error: fetchError } = await supabase
        .from('word_of_the_day')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
        } else {
          console.error('Error fetching word:', fetchError);
          return;
        }
      }
      const { data: words } = await supabase
        .from("learned_words") 
        .select('id, word, part_of_speech, is_new, definition, example, platform, show_name, season, episode')
        .eq("user_id", user?.id);
      const data = await fetch("/api/aiChat", {
        method: "POST",
        body: JSON.stringify({messageHistory: allMessages, word_of_the_day: WordOfTheDay, user: user?.user_metadata?.name, userWordsData: words}),
      });
      
      const json = await data.json();

      const markdown_json = json.data;
      const aiResponse: { role: 'assistant', content: string } = { role: 'assistant', content: markdown_json.message || '' };
      if (markdown_json) {
        handleUserXP(markdown_json.XP ?? 0);
      } else {
        console.error("Error: response is not a JSON object");
      }
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }
  };

  const handleSuggestions = (event: string) => {
    if (input.trim()){
      setInput(event);
    } else {
      setInput("")
      setInput(event)
    }
  }

  const handleVoice = async (text: string, count: number) => {
    setPlayingId(count);
    setIsAudioLoading(true);
    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
        audio.onended = () => {
          setIsAudioLoading(false);
          setPlayingId(null);
        };
      } else {
        const errorData = await response.json();
        console.error('Error playing audio:', errorData);
        alert('Failed to play audio: ' + (errorData.error || 'Unknown error'));
        setIsAudioLoading(false);
        setPlayingId(null);
      }
    } catch (error) {
      console.error('Network error playing audio:', error);
      setIsAudioLoading(false);
      setPlayingId(null);
    }
  };

  const reset = () => {
    setMessages([]);
  }

  return (
    <div className="flex flex-col h-screen bg-white relative overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <button onClick={reset} className="text-gray-700 hover:text-gray-900 text-sm flex items-center cursor-pointer">
          <SquarePen className="w-4 h-4 mr-1" /> New chat
        </button>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <Badge variant="secondary">
          <Sparkles className="w-4 h-4 mr-1 text-yellow-500" /> XP: {XPpoints}
        </Badge>
      </div>


      <div className="flex-1 overflow-y-hidden p-4 flex flex-col items-center">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
            <h1 className="text-3xl md:text-4xl font-semibold mb-8 text-center text-gray-900">
              What can I help with ?
            </h1>

            <div className="flex justify-center flex-wrap gap-3">
              <button onClick={() => handleSuggestions("I want to learn some words I can use in everyday conversations.")} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm hover:bg-gray-100 text-gray-800">
                <Lightbulb className="w-4 h-4 text-yellow-500" /> Learn Words
              </button>
              <button onClick={() => handleSuggestions("Can you show how to use the word [WORD] in a conversation?")} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm hover:bg-gray-100 text-gray-800">
                <FileText className="w-4 h-4 text-green-500" /> Use Cases
              </button>
              <button onClick={() => handleSuggestions("I want to improve my grammar")} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm hover:bg-gray-100 text-gray-800">
                <Volume2 className="w-4 h-4 text-purple-500" /> Improve Grammar
              </button>
              <button onClick={() => handleSuggestions("Let's do a fun quiz on the words I've learnt so far")} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm hover:bg-gray-100 text-gray-800">
                <GraduationCap className="w-4 h-4 text-blue-500" /> Quiz Me
              </button>
              <button onClick={() => handleSuggestions("")} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm hover:bg-gray-100 text-gray-800">
                <MoreHorizontal className="w-4 h-4 text-gray-500" /> More
              </button>
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto px-4 py-6 w-full">
            {messages.map((msg, index) => (
              <div key={index} className="max-w-[800px] mx-auto mb-8 w-full">
                {msg.role === "user" ? (
                  <div className="flex-1 flex justify-end">
                    <div className="flex items-end gap-2">
                      <div className="bg-primary/10 border border-primary/20 rounded-2xl py-3 px-4 text-sm text-gray-900 shadow-sm transition-all">
                        {msg.content}
                      </div>
                      <Avatar>
                        <AvatarFallback className="bg-primary text-white"><User className="w-4 h-4" /></AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                     <Avatar>
                        <AvatarFallback className="bg-gray-200 text-gray-500"><Bot className="w-4 h-4" /></AvatarFallback>
                      </Avatar>
                      <Card className="flex-1 bg-white/90 border border-gray-200 shadow-md rounded-2xl transition-all hover:shadow-lg">
                        <CardContent className="py-4 px-5">
                          <Markdown>{msg.content}</Markdown>
                        </CardContent>
                        <button
                          onClick={() => handleVoice(msg.content, index)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                          disabled={isAudioLoading && playingId === index}
                        >
                          {isAudioLoading && playingId === index ? (
                            <span className="animate-spin inline-block h-5 w-5 rounded-full border-4 border-t-4 border-gray-200 border-t-blue-600"></span>
                          ) : (
                            <Volume2/>
                          )}
                        </button>
                      </Card>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="max-w-[800px] mx-auto w-full">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 px-4 py-4 bg-white">
        <div className="max-w-[800px] mx-auto relative">
          {!isReady ? (
            <div className="w-full pr-20 py-3 px-4 rounded-xl bg-gray-100 animate-pulse h-10"></div>
          ) : (
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Ask anything"
                className="w-full pr-20 py-3 px-4 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-300 text-sm bg-white text-gray-900"
              />
              <div className="absolute right-2 flex gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <PlusCircle className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600"
                  onClick={sendMessage}
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
          <div className="text-xs text-gray-500 text-center mt-2">
            Please note that Scribe can make mistakes. Check important info.
          </div>
        </div>
      </div>
    </div>
  );
} 
