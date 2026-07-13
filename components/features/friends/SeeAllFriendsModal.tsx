import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, CircleMinus } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";

interface SeeAllFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRemoveFriend: (friend: any) => void;
}

export default function SeeAllFriendsModal({ isOpen, onClose, onRemoveFriend }: SeeAllFriendsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const friends = useQuery(api.queries.getFriends) || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const filteredFriends = friends.filter((friend: any) => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = friend.name?.toLowerCase().includes(searchLower);
    const emailMatch = friend.email?.toLowerCase().includes(searchLower);
    return nameMatch || emailMatch;
  });

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-[24px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[rgba(0,0,0,0.2)] backdrop-blur-[8px]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="relative z-10 w-full max-w-[480px] h-full max-h-[600px] flex flex-col bg-[#FCFCFC] rounded-[24px] shadow-[0px_8px_32px_rgba(0,0,0,0.08)] border border-[rgba(0,0,0,0.04)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-[24px] pt-[24px] pb-[16px] border-b border-[rgba(0,0,0,0.04)]">
              <h2 className="text-[20px] font-semibold text-[#4b4b4b] tracking-[-0.4px]">Your Friends</h2>
              <button 
                onClick={onClose}
                className="p-[6px] rounded-full hover:bg-[rgba(0,0,0,0.04)] transition-colors text-[#808080]"
              >
                <X className="w-[20px] h-[20px]" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex-shrink-0 p-[16px] bg-[#FCFCFC] z-10">
              <div className="relative flex items-center w-full h-[40px] bg-white rounded-[12px] shadow-[0px_1px_2px_rgba(0,0,0,0.05),0px_0px_0px_1px_rgba(0,0,0,0.05)] px-[12px]">
                <Search className="w-[16px] h-[16px] text-[#808080] flex-shrink-0 mr-[8px]" />
                <input
                  type="text"
                  placeholder="Search friends by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-[13px] text-[#4b4b4b] placeholder:text-[#999] font-medium"
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => setSearchQuery('')} 
                      className="text-[11px] font-medium text-[#666] hover:text-[#4b4b4b] transition-colors ml-[8px]"
                    >
                      Clear
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Friend List */}
            <div className="flex-1 overflow-y-auto px-[16px] pb-[24px] relative">
              <AnimatePresence mode="popLayout">
                {filteredFriends.length > 0 ? (
                  <ul className="flex flex-col gap-[4px]">
                    {filteredFriends.map((friend: any, index: number) => (
                      <motion.li
                        key={friend.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4, delay: Math.min(index * 0.04, 0.4) }}
                        className="flex items-center gap-[12px] p-[12px] bg-white rounded-[16px] shadow-[0px_1px_3px_rgba(0,0,0,0.02),0px_0px_0px_1px_rgba(0,0,0,0.02)] group hover:shadow-[0px_4px_12px_rgba(0,0,0,0.04),0px_0px_0px_1px_rgba(0,0,0,0.04)] transition-shadow cursor-pointer"
                      >
                        <div className="rounded-full shadow-[0px_3px_5px_0px_rgba(0,0,0,0.22),0px_0px_0px_0px_rgba(96,96,96,0.31)] size-[40px] relative flex-shrink-0">
                          <div aria-hidden className="absolute bg-gradient-to-b from-[#f0f0f0] via-[rgba(240,240,240,0.6)] to-[#dadada] inset-0 pointer-events-none rounded-full" />
                          <div className="absolute inset-0 flex items-center justify-center text-[14px] font-semibold text-gray-700 bg-transparent rounded-full overflow-hidden z-10">
                            {friend.image ? (
                              <Image src={friend.image} alt={friend.name || "Friend"} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#606060]">
                                {friend.name ? friend.name.charAt(0).toUpperCase() : "?"}
                              </div>
                            )}
                          </div>
                          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_12px_0px_rgba(255,255,255,0.5),inset_0px_1px_0px_0px_rgba(255,255,255,0.44),inset_0px_-0.5px_0px_0px_rgba(255,255,255,0.31)] z-20" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[14px] text-[#4b4b4b] tracking-tight truncate">{friend.name || "Unknown"}</div>
                          {friend.email && (
                            <div className="text-[12px] text-[#808080] truncate leading-tight mt-[2px]">{friend.email}</div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => onRemoveFriend({ id: friend.id, name: friend.name || friend.email || "this friend" })}
                          className="p-[6px] text-[#606060] hover:text-[#ef4444] rounded-[8px] opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                          title="Remove Friend"
                        >
                          <CircleMinus className="h-[16px] w-[16px]" />
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-[200px] flex flex-col items-center justify-center text-center px-[24px]"
                  >
                    <div className="w-[48px] h-[48px] bg-[rgba(0,0,0,0.03)] rounded-full flex items-center justify-center mb-[16px]">
                      <Search className="w-[20px] h-[20px] text-[#999]" />
                    </div>
                    <h3 className="text-[14px] font-semibold text-[#4b4b4b] tracking-[-0.2px]">No friends found</h3>
                    <p className="text-[13px] text-[#808080] mt-[4px]">Try adjusting your search query.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
