import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Play, Tv2, Clock, MoreHorizontal, Bookmark, MessageSquare, Share2, Trash2, CalendarDays } from "lucide-react";
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
  return (
    <div
      role={onSelect ? "checkbox" : undefined}
      aria-checked={isSelected}
      tabIndex={onSelect ? 0 : undefined}
      onClick={() => onSelect && onSelect(word._id)}
      onKeyDown={e => { if (onSelect && (e.key === ' ' || e.key === 'Enter')) onSelect(word._id); }}
      className={`relative group overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-card shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${onSelect ? 'cursor-pointer select-none' : ''} ${isSelected ? 'border-2 border-primary ring-2 ring-primary' : ''}`}
    >
      <div className="relative aspect-video">
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
      <div className="p-5">
        <div className="flex justify-between items-start gap-3 mb-3">
          <div>
            <h3 className="text-xl font-semibold tracking-tight line-clamp-1">
              {word.word}
              {word.is_new && (<span className="ml-2 inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />)}
            </h3>
            <p className="text-sm text-muted-foreground capitalize mt-1">{word.part_of_speech}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full -mt-1 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl w-48">
              <DropdownMenuItem className="gap-2">
                <Bookmark className="h-4 w-4" />
                Save to group
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Add note
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator/>
              <DropdownMenuItem className="gap-2 text-red-500" onClick={() => onRemove(type, word._id)}>
                <Trash2 className="h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm line-clamp-2 mb-3">{word.definition}</p>
        {word.example && (
          <div className="px-3 py-2 mb-4 text-xs italic bg-accent/20 dark:bg-accent/10 rounded-lg border border-accent/30 line-clamp-2">
            &quot;{word.example}&quot;
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate max-w-[120px]">{word.show_name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="text-xs">{new Date(Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
