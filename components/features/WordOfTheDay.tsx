"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Volume2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { DailyWord } from "@/lib/dailyWord";

const CURRENT_SELECTION_VERSION = 2;

export default function WordOfTheDay() {
  const [wordData, setWordData] = useState<DailyWord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAfterSeconds, setRetryAfterSeconds] = useState(0);
  const pendingDay = useRef<string | null>(null);
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

  const showWord = useCallback((word: DailyWord) => {
    setWordData(word);
    setAudioAvailable(word.phonetics?.some((phonetic) => Boolean(phonetic.audio)) ?? false);
  }, []);

  useEffect(() => {
    if (retryAfterSeconds === 0) return;
    const timer = setTimeout(() => setRetryAfterSeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => clearTimeout(timer);
  }, [retryAfterSeconds]);

  const loadWord = useCallback(async () => {
    if (userLoading) {
      return;
    }

    if (!user) {
      setError("Please sign in to see the word of the day");
      setIsLoading(false);
      return;
    }

    if (wordOfTheDay === undefined) return;

    const now = new Date();
    const existingWord = wordOfTheDay;
    const needsNewWord = !existingWord ||
      existingWord.selectionVersion !== CURRENT_SELECTION_VERSION ||
      !isSameDay(new Date(existingWord.updated_at), now) ||
      !Array.isArray(existingWord.meanings) ||
      existingWord.meanings.length === 0;

    if (!needsNewWord) {
      setError(null);
      showWord({
        word: existingWord.word,
        phonetic: existingWord.phonetic,
        phonetics: existingWord.phonetics ?? [],
        meanings: existingWord.meanings,
      });
      setIsLoading(false);
      return;
    }

    const dayKey = `${user._id}:${now.toDateString()}`;
    if (pendingDay.current === dayKey) return;
    pendingDay.current = dayKey;
    setIsLoading(true);
    setError(null);
    setAudioAvailable(false);
    setRetryAfterSeconds(0);

    try {
      const response = await fetch("/api/word-of-the-day", { method: "POST", cache: "no-store" });
      if (!response.ok) {
        const retryAfter = Number(response.headers.get("Retry-After"));
        if (Number.isFinite(retryAfter) && retryAfter > 0) {
          setRetryAfterSeconds(Math.min(3600, Math.ceil(retryAfter)));
        }
      }
      if (response.status === 429) {
        setError("Daily word requests are temporarily limited. Please try again shortly.");
        return;
      }
      if (!response.ok) throw new Error(`Daily word request failed: ${response.status}`);
      const newWordData = await response.json() as DailyWord;
      if (!newWordData.word || !Array.isArray(newWordData.meanings) || !newWordData.meanings.length) {
        throw new Error("Daily word response is invalid");
      }

      await updateWordOfTheDay({
        id: user._id,
        word: newWordData.word,
        phonetic: newWordData.phonetic ?? "",
        phonetics: newWordData.phonetics,
        meanings: newWordData.meanings,
        selectionVersion: CURRENT_SELECTION_VERSION,
        updated_at: now.toISOString(),
      });
      showWord(newWordData);
    } catch (error) {
      console.error("Error loading daily word:", error);
      setError("Could not load a word right now. Please try again.");
    } finally {
      pendingDay.current = null;
      setIsLoading(false);
    }
  }, [user, userLoading, wordOfTheDay, isSameDay, showWord, updateWordOfTheDay]);

  useEffect(() => {
    if (!userLoading) {
      void loadWord();
    }
  }, [userLoading, loadWord]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const scheduleNextDay = () => {
      const now = new Date();
      const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = setTimeout(() => {
        void loadWord();
        scheduleNextDay();
      }, nextDay.getTime() - now.getTime() + 100);
    };

    scheduleNextDay();
    return () => clearTimeout(timer);
  }, [loadWord]);

  const handlePlayAudio = useCallback(() => {
    if (!wordData) return;

    const urls = [...new Set(wordData.phonetics.map((phonetic) => phonetic.audio).filter(Boolean))];
    if (!urls.length) return;

    setIsPlaying(true);
    let nextIndex = 0;
    const playNext = async () => {
      if (nextIndex >= urls.length) {
        setIsPlaying(false);
        return;
      }

      let failed = false;
      const tryNext = () => {
        if (failed) return;
        failed = true;
        void playNext();
      };
      try {
        const audio = new Audio(urls[nextIndex++]);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = tryNext;
        await audio.play();
      } catch {
        tryNext();
      }
    };

    void playNext();
  }, [wordData]);

  if (error) {
    return (
      <div className="w-full bg-transparent p-[16px]">
        <div className="flex items-center justify-center gap-3 min-h-[40px]">
          <p className="text-[13px] font-medium text-red-500">{error}</p>
          {user && (
            <Button
              variant="ghost"
              size="sm"
              disabled={retryAfterSeconds > 0}
              onClick={() => void loadWord()}
            >
              {retryAfterSeconds > 0 ? `Try again in ${retryAfterSeconds}s` : "Try again"}
            </Button>
          )}
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
              <span className="text-[13px] text-[#1E78FF]/60 font-medium tracking-[-0.2px]">Finding today&apos;s word...</span>
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
                {wordData.phonetic && <p className="text-[13px] text-[#1E78FF]/80 italic">{wordData.phonetic}</p>}
                {audioAvailable && (
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
