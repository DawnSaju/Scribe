"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Volume2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

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
  phonetic?: string;
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
  const user = useQuery(api.users.current);
  const userLoading = user === undefined;
  const wordOfTheDay = useQuery(api.queries.getWordOfTheDay, user ? { userId: user._id } : "skip");
  const updateWordOfTheDay = useMutation(api.queries.updateWordOfTheDay);

  const isSameDay = useCallback((date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }, []);

  const getAudioUrl = useCallback((phonetics: Phonetic[]): string | null => {
    const phoneticWithAudio = phonetics.find(p => p.audio);
    if (phoneticWithAudio?.audio) {
      return phoneticWithAudio.audio;
    }
    return `https://api.dictionaryapi.dev/media/pronunciations/en/${wordData?.word}.mp3`;
  }, [wordData]);

  const fetchWordFromAPI = useCallback(async () => {
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
  }, []);

  const fetchWord = useCallback(async () => {
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
      if (!user) {
        setError("Session expired. Please sign in again.");
        return;
      }

      if (wordOfTheDay === undefined) return;
      const existingWord = wordOfTheDay;

      const now = new Date();
      const shouldFetchNewWord = !existingWord || 
        !isSameDay(new Date(existingWord.updated_at), now);

      if (shouldFetchNewWord) {
        const newWordData = await fetchWordFromAPI();
        if (!newWordData) {
          setError("Could not fetch a new word. Please try again.");
          return;
        }

        try {
          await updateWordOfTheDay({
            id: user._id,
            word: newWordData.word,
            phonetic: newWordData.phonetic,
            phonetics: newWordData.phonetics,
            meanings: newWordData.meanings,
            updated_at: now.toISOString()
          });
        } catch (upsertError: any) {
          console.error('Error storing word:', upsertError);
          setError("Error saving word. Please try again.");
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
  }, [user, userLoading, wordOfTheDay, isSameDay, fetchWordFromAPI]);

  useEffect(() => {
    if (!userLoading) {
      fetchWord();
    }
  }, [userLoading, fetchWord]);

  const handlePlayAudio = useCallback(async () => {
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
  }, [wordData, getAudioUrl]);

  if (error) {
    return (
      <div className="w-full bg-transparent p-[16px]">
        <div className="flex items-center justify-center min-h-[40px]">
          <p className="text-[13px] font-medium text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full bg-transparent p-[16px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <span className="text-[11px] font-medium text-[#1E78FF] bg-[#1E78FF]/10 px-[6px] py-[2px] rounded-full uppercase tracking-tight">
                Word of the Day
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="h-3.5 w-3.5 text-[#1E78FF]/60" />
              </motion.div>
              <span className="text-[13px] text-[#1E78FF]/60 font-medium tracking-[-0.2px]">Finding today's word...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!wordData) return null;

  return (
    <div className="w-full bg-transparent">
      <div className="w-full">
        <div 
          className="p-[16px] cursor-pointer hover:bg-[rgba(0,0,0,0.02)] transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <span className="text-[11px] font-medium text-[#1E78FF] bg-[#1E78FF]/10 px-[6px] py-[2px] rounded-full uppercase tracking-tight">
                  Word of the Day
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <h3 className="text-[16px] font-semibold text-[#1E78FF] tracking-[-0.4px]">{wordData.word}</h3>
                <p className="text-[13px] text-[#1E78FF]/80 italic">{wordData.phonetic}</p>
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
                <div className="pt-[16px] mt-[16px] border-t border-[rgba(0,0,0,0.11)] shadow-[0px_1px_0px_0px_white]">
                  <div className="space-y-[12px]">
                    {wordData.meanings.map((meaning, index) => (
                      <div key={index} className="space-y-[4px]">
                        <p className="text-[12px] font-semibold text-[#1E78FF] capitalize">{meaning.partOfSpeech}</p>
                        <ul className="list-disc list-inside space-y-[4px]">
                          {meaning.definitions.slice(0, 2).map((def, idx) => (
                            <li key={idx} className="text-[13px] text-[#4b4b4b]">
                              {def.definition}
                              {def.example && (
                                <p className="text-[12px] text-[#606060] italic mt-[4px] ml-[16px] px-[8px] py-[4px] bg-[rgba(0,0,0,0.02)] rounded-[6px] border border-[rgba(0,0,0,0.05)]">&quot;{def.example}&quot;</p>
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
