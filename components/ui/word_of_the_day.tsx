"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Volume2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { createBrowserClient } from '@supabase/ssr';
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";

interface Phonetic {
  text: string;
  audio: string;
  license?: {
    url: string;
    name: string;
  };
  sourceUrl?: string;
}

interface Word_Structure {
  word: string;
  phonetic: string;
  phonetics: Phonetic[];
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms: string[];
      antonyms: string[];
    }>;
    synonyms: string[];
    antonyms: string[];
  }>;
}

export default function WordOfTheDay() {
  const [wordData, setWordData] = useState<Word_Structure | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [Audioavailable, setAudioavailable] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const MAX_RETRIES = 5;
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { user, loading: userLoading } = useUser();
  const router = useRouter();

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getAudioUrl = (phonetics: Phonetic[]): string | null => {
    const phoneticWithAudio = phonetics.find(p => p.audio);
    if (phoneticWithAudio?.audio) {
      return phoneticWithAudio.audio;
    }
    return `https://api.dictionaryapi.dev/media/pronunciations/en/${wordData?.word}.mp3`;
  };

  const fetchWordFromAPI = async () => {
    if (retryCount >= MAX_RETRIES) {
      console.log("Max retries reached. Please try again later.");
      setIsLoading(false);
      setRetryCount(0);
      return null;
    }

    try {
      const wordResponse = await fetch("https://random-word-api.herokuapp.com/word");
      const randomWord = await wordResponse.json();
      
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setRetryCount(prev => prev + 1);
          return fetchWordFromAPI();
        }
        console.warn(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setRetryCount(0);
        setAudioavailable(!!data[0].phonetics?.[0]?.audio);
        return data[0];
      } else {
        setRetryCount(prev => prev + 1);
        return fetchWordFromAPI();
      }
    } catch (error) {
      if (error instanceof Error && !error.message.includes('404')) {
        console.error("Error fetching word:", error);
      }
      setRetryCount(prev => prev + 1);
      return fetchWordFromAPI();
    }
  };

  const fetchWord = async () => {
    if (userLoading) {
      return;
    }

    if (!user) {
      setError("Please sign in to see the word of the day");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAudioavailable(false);

    try {
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !currentUser) {
        setError("Session expired. Please sign in again.");
        router.refresh(); 
        return;
      }

      const { data: existingWord, error: fetchError } = await supabase
        .from('word_of_the_day')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
        } else {
          console.error('Error fetching word:', fetchError);
          setError("Error fetching word. Please try again.");
          return;
        }
      }

      const now = new Date();
      const shouldFetchNewWord = !existingWord || 
        !isSameDay(new Date(existingWord.updated_at), now);

      if (shouldFetchNewWord) {
        const newWordData = await fetchWordFromAPI();
        if (!newWordData) {
          setError("Could not fetch a new word. Please try again.");
          return;
        }

        const { error: upsertError } = await supabase
          .from('word_of_the_day')
          .upsert({
            id: currentUser.id,
            word: newWordData.word,
            phonetic: newWordData.phonetic,
            phonetics: newWordData.phonetics,
            meanings: newWordData.meanings,
            updated_at: now.toISOString()
          });

        if (upsertError) {
          console.error('Error storing word:', upsertError);
          if (upsertError.code === '42501') {
            setError("Permission denied. Please try signing out and back in.");
            router.refresh();
          } else {
            setError("Error saving word. Please try again.");
          }
          return;
        }

        setWordData(newWordData);
        const audioUrl = newWordData.phonetics?.find((p: Phonetic) => p.audio)?.audio;
        setAudioavailable(audioUrl);
      } else {
        // console.log(existingWord);
        setWordData({
          word: existingWord.word,
          phonetic: existingWord.phonetic,
          phonetics: existingWord.phonetics,
          meanings: existingWord.meanings
        });
        const audioUrl = existingWord.phonetics?.find((p: Phonetic) => p.audio)?.audio;
        setAudioavailable(audioUrl);
      }
    } catch (error) {
      console.error('Error in fetchWord:', error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading) {
      fetchWord();
    }
  }, [user, userLoading]);

  const handlePlayAudio = async () => {
    if (!wordData) return;
    
    setIsPlaying(true);
    try {
      const audioUrl = getAudioUrl(wordData.phonetics);
      
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        await audio.play();
        audio.onended = () => setIsPlaying(false);
      } else {
        console.warn('No audio available for this word');
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  if (error) {
    return (
      <div className="w-full bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-blue-600">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50 p-2 animate-gradient">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[40px]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="h-4 w-4 text-blue-500" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (!wordData) return null;

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50 shadow-sm animate-gradient">
      <div className="max-w-7xl mx-auto">
        <div 
          className="py-2 px-3 cursor-pointer hover:bg-opacity-90 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  Word of the Day
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-blue-700">{wordData.word}</h3>
                <p className="text-sm text-blue-600/80 italic">{wordData.phonetic}</p>
                {Audioavailable && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayAudio();
                    }}
                    disabled={isPlaying}
                    className="h-6 w-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    {isPlaying ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </motion.div>
                    ) : (
                      <Volume2 className="h-3 w-3" />
                    )}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-blue-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-blue-500" />
                )}
              </motion.div>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-2 mt-2 border-t border-blue-100">
                  <div className="space-y-2">
                    {wordData.meanings.map((meaning, index) => (
                      <div key={index} className="space-y-1">
                        <p className="text-xs font-semibold text-blue-600">{meaning.partOfSpeech}</p>
                        <ul className="list-disc list-inside space-y-0.5">
                          {meaning.definitions.slice(0, 2).map((def, idx) => (
                            <li key={idx} className="text-sm text-blue-900/80">
                              {def.definition}
                              {def.example && (
                                <p className="text-xs text-blue-600/70 italic mt-0.5">&quot;{def.example}&quot;</p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 
