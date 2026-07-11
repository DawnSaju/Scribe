import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Tv2, Clock, MoreHorizontal, Bookmark, MessageSquare, Share2, Trash2, CalendarDays, X, Info } from "lucide-react";
import { RiNetflixFill, RiYoutubeFill } from "@remixicon/react";

export type Word = {
  _id: string;
  id?: string;
  word: string;
  part_of_speech: string;
  is_new?: boolean;
  definition: string;
  example: string;
  thumbnailimg: string;
  timeTracked: number;
  platform: string;
  show_name: string;
  season: number;
  episode: number;
  group_name?: string | null;
};

interface WordCardProps {
  word: Word;
  thumb: string | null;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onRemove: (type: string, id: string) => void;
  type: "group" | "grid";
}

const PlatformIcon = ({ platform, className }: { platform: string; className?: string }) => {
  const icons: Record<string, React.JSX.Element> = {
    netflix: <RiNetflixFill className={`text-red-500 ${className}`} />,
    youtube: <RiYoutubeFill className={`text-red-500 ${className}`} />,
    hulu: <Tv2 className={className} />,
    disney: <Tv2 className={className} />,
    prime: <Tv2 className={className} />,
    hbo: <Tv2 className={className} />,
    default: <Tv2 className={className} />
  };
  return icons[platform.toLowerCase()] || icons.default;
};

export default function WordCard({ word, thumb, isSelected, onSelect, onRemove, type }: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const handleCardFlipped = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail !== word._id) {
        setIsFlipped(false);
      }
    };
    window.addEventListener('card-flipped', handleCardFlipped);
    return () => window.removeEventListener('card-flipped', handleCardFlipped);
  }, [word._id]);

  const handleFlip = (flip: boolean) => {
    setIsFlipped(flip);
    if (flip) {
      window.dispatchEvent(new CustomEvent('card-flipped', { detail: word._id }));
    }
  };

  return (
    <div className={`relative group [perspective:1200px] w-full h-[400px] ${onSelect && !isFlipped ? 'cursor-pointer select-none' : ''}`}>
      <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>

        <div
          role={onSelect ? "checkbox" : undefined}
          aria-checked={isSelected}
          tabIndex={onSelect ? 0 : undefined}
          onClick={() => { if (!isFlipped && onSelect) onSelect(word._id); }}
          onKeyDown={e => { if (!isFlipped && onSelect && (e.key === ' ' || e.key === 'Enter')) onSelect(word._id); }}
          className={`[backface-visibility:hidden] drop-shadow-[0px_0px_0.5px_rgba(0,0,0,0.35),-3px_3px_3.5px_rgba(0,0,0,0.04)] relative overflow-hidden rounded-[12px] bg-transparent transition-all duration-300 h-full flex flex-col ${!isFlipped ? 'hover:drop-shadow-[0px_0px_1px_rgba(0,0,0,0.4),-4px_4px_5px_rgba(0,0,0,0.06)] hover:-translate-y-1' : ''} ${isSelected ? 'ring-2 ring-primary' : ''}`}
        >
          <div aria-hidden className="absolute bg-[#f5f5f5] inset-0 pointer-events-none rounded-[12px]" />
          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_0px_12px_0px_white,inset_0px_0px_0px_0px_white] z-20" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="relative aspect-video shrink-0">
              {word.platform.toLowerCase() === 'netflix' ? (
                <Image
                  src={thumb || "https://placehold.co/500x500?text=Thumbnail"}
                  alt={word.show_name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : word.platform.toLowerCase() === 'youtube' ? (
                <Image
                  src={word.thumbnailimg}
                  alt={word.show_name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <Play className="h-10 w-10 text-white/50 group-hover:text-white/80 transition-colors" />
                </div>
              )}
              {word.platform && (
                <div className="absolute right-3 top-3 z-10 bg-background/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <PlatformIcon platform={word.platform} className="h-5 w-5" />
                </div>
              )}
              {word.platform.toLowerCase() === "netflix" ? (
                <Badge className="absolute left-3 top-3 bg-background/90 backdrop-blur-sm text-foreground hover:bg-background border border-gray-100 dark:border-gray-700">
                  <Tv2 className="h-3.5 w-3.5 mr-1" />
                  S{word.season} • E{word.episode}
                </Badge>
              ) : (
                <Badge className="absolute left-3 top-3 bg-background/90 backdrop-blur-sm text-foreground hover:bg-background border border-gray-100 dark:border-gray-700">
                  <Clock className="h-3.5 w-3.5" />
                  {word.timeTracked}s
                </Badge>
              )}
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex justify-between items-start gap-3 mb-3">
                <div>
                  <h3 className="text-[16px] font-semibold text-[#4b4b4b] tracking-[-0.4px] line-clamp-1">
                    {word.word}
                    {word.is_new && (<span className="ml-2 inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />)}
                  </h3>
                  <p className="text-[12px] text-[#606060] capitalize mt-1 font-medium">{word.part_of_speech}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleFlip(true); }} className="h-9 w-9 rounded-full -mt-1 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Info className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-[13px] text-[#4b4b4b] line-clamp-2 mb-3">{word.definition}</p>
              {word.example && (
                <div className="px-[12px] py-[8px] mb-4 text-[12px] text-[#606060] italic bg-[rgba(0,0,0,0.02)] rounded-[8px] border border-[rgba(0,0,0,0.05)] line-clamp-2">
                  &quot;{word.example}&quot;
                </div>
              )}
              <div className="flex items-center justify-between text-[12px] text-[#606060] font-medium mt-auto">
                <div className="flex items-center gap-2">
                  <span className="truncate max-w-[120px]">{word.show_name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-3 w-3" />
                  <span>{new Date(Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[12px] bg-transparent drop-shadow-[0px_0px_0.5px_rgba(0,0,0,0.35),-3px_3px_3.5px_rgba(0,0,0,0.04)] overflow-hidden">
          <div aria-hidden className="absolute bg-[#f5f5f5] inset-0 pointer-events-none rounded-[12px]" />
          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_0px_12px_0px_white,inset_0px_0px_0px_0px_white] z-20" />

          <div className="relative z-10 p-5 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[14px] font-semibold text-[#4b4b4b] tracking-[-0.2px]">Word Details</h3>
              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleFlip(false); }} className="h-8 w-8 rounded-full bg-white/60 hover:bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.04),inset_0px_-1px_0px_rgba(0,0,0,0.02)] border border-white/50">
                <X className="h-4 w-4 text-[#606060]" />
              </Button>
            </div>

            <div className="flex flex-col justify-start">
              <h4 className="text-[11px] font-medium text-[#666] capitalize mb-1.5 px-1">Metadata</h4>
              <div className="bg-[rgba(255,255,255,0.4)] rounded-[10px] p-2.5 shadow-[inset_0px_1px_3px_rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.04)] flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[#606060] font-medium">Platform</span>
                  <span className="text-[12px] font-semibold text-[#4b4b4b] capitalize flex items-center gap-1.5"><PlatformIcon platform={word.platform} className="h-3 w-3" /> {word.platform}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[#606060] font-medium">Source</span>
                  <span className="text-[12px] font-semibold text-[#4b4b4b] max-w-[120px] truncate text-right" title={word.show_name}>{word.show_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[#606060] font-medium">Time Tracked</span>
                  <span className="text-[12px] font-semibold text-[#4b4b4b]">{Math.floor(word.timeTracked / 60)}m {word.timeTracked % 60}s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[#606060] font-medium">Group</span>
                  <span className="text-[12px] font-semibold text-[#4b4b4b] max-w-[120px] truncate text-right">{word.group_name || 'None'}</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-[11px] font-medium text-[#666] capitalize mb-1.5 px-1">Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex flex-col items-center justify-center gap-1 bg-white/60 hover:bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.04),inset_0px_-1px_0px_rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.02)] rounded-[10px] p-2 transition-all outline-none group hover:-translate-y-[1px]">
                  <Bookmark className="size-4 text-[#1E78FF] transition-transform group-hover:scale-110 mb-0.5" />
                  <span className="text-[11px] font-semibold text-[#4b4b4b] tracking-[-0.2px]">{word.group_name ? "Change Group" : "Save Word"}</span>
                </button>

                <button className="flex flex-col items-center justify-center gap-1 bg-white/60 hover:bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.04),inset_0px_-1px_0px_rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.02)] rounded-[10px] p-2 transition-all outline-none group hover:-translate-y-[1px]">
                  <MessageSquare className="size-4 text-[#606060] transition-transform group-hover:scale-110 group-hover:text-[#4b4b4b] mb-0.5" />
                  <span className="text-[11px] font-semibold text-[#4b4b4b] tracking-[-0.2px]">Add Note</span>
                </button>

                <button className="flex flex-col items-center justify-center gap-1 bg-white/60 hover:bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.04),inset_0px_-1px_0px_rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.02)] rounded-[10px] p-2 transition-all outline-none group hover:-translate-y-[1px]">
                  <Share2 className="size-4 text-[#606060] transition-transform group-hover:scale-110 group-hover:text-[#4b4b4b] mb-0.5" />
                  <span className="text-[11px] font-semibold text-[#4b4b4b] tracking-[-0.2px]">Share</span>
                </button>

                <button className="flex flex-col items-center justify-center gap-1 bg-red-50/50 hover:bg-red-50 shadow-[0px_1px_2px_rgba(239,68,68,0.08),inset_0px_-1px_0px_rgba(239,68,68,0.02)] border border-[rgba(239,68,68,0.05)] rounded-[10px] p-2 transition-all outline-none group hover:-translate-y-[1px]" onClick={(e) => { e.stopPropagation(); onRemove(type, word._id); }}>
                  <Trash2 className="size-4 text-red-500 transition-transform group-hover:scale-110 mb-0.5" />
                  <span className="text-[11px] font-semibold text-red-500 tracking-[-0.2px]">Remove</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
