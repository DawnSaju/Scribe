"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserPlus, Settings, MessageCircle, Check, X, CircleMinus, Search, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import SeeAllFriendsModal from "@/components/features/friends/SeeAllFriendsModal";

export default function ProfilePane() {
  const user = useQuery(api.users.current);
  const friends = useQuery(api.queries.getFriends);
  const sendFriendRequest = useMutation(api.queries.sendFriendRequest);
  const [hasMounted, setHasMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [seeAllOpen, setSeeAllOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalOpen) {
        setModalOpen(false);
      }
    };

    if (modalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [modalOpen]);

  type SearchUser = {
    id: string;
    email?: string;
    full_name?: string;
    avatar_url?: string;
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const convexSearchResults = useQuery(
    api.users.searchUsers,
    debouncedSearchQuery.trim() ? { userinput: debouncedSearchQuery } : "skip"
  );

  const isSearching = searchQuery.trim() !== '' && (searchQuery !== debouncedSearchQuery || convexSearchResults === undefined);
  const searchResults = convexSearchResults || [];

  const allRequests = useQuery(api.queries.getAllFriendRequests) || [];
  const pendingRequests = useQuery(api.queries.getPendingReceivedRequests);
  const respondToRequest = useMutation(api.queries.respondToFriendRequest);
  const removeFriend = useMutation(api.queries.removeFriend);
  const cancelFriendRequest = useMutation(api.queries.cancelFriendRequest);

  const getFriendStatus = (targetId: string) => {
    const relevantRequests = allRequests.filter(
      (req) => req.sender_id === targetId || req.receiver_id === targetId
    );

    if (relevantRequests.length === 0) return null;

    const accepted = relevantRequests.find(req => req.status === "accepted");
    if (accepted) return "accepted";

    const pending = relevantRequests.find(req => req.status === "pending");
    if (pending) {
      if (pending.sender_id === targetId) {
        return "pending_received";
      } else {
        return "pending_sent";
      }
    }

    return relevantRequests[0].status;
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleSendRequest = async (reciever: SearchUser) => {
    try {
      if (!user) return;
      await sendFriendRequest({
        sender_id: user._id,
        receiver_id: reciever.id,
      });



      setRequestSent(true);
      setTimeout(() => {
        setRequestSent(false);
        setModalOpen(false);
        setSearchQuery('');
      }, 1200);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleRespondRequest = async (requestId: any, status: "accepted" | "rejected") => {
    try {
      await respondToRequest({ requestId, status });
    } catch (error) {
      console.error('Error responding to friend request:', error);
    }
  };

  const handleRemoveFriend = async (friendId: any) => {
    try {
      await removeFriend({ friendId });
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const handleCancelRequest = async (receiverId: any) => {
    try {
      await cancelFriendRequest({ receiverId });
    } catch (error) {
      console.error('Error canceling friend request:', error);
    }
  };

  return (
    <div className="relative h-full flex flex-col rounded-[12px] bg-transparent drop-shadow-[0px_0px_0.5px_rgba(0,0,0,0.35),-3px_3px_3.5px_rgba(0,0,0,0.04)]">
      <div aria-hidden className="absolute bg-[#f5f5f5] inset-0 pointer-events-none rounded-[12px]" />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_0px_12px_0px_white,inset_0px_0px_0px_0px_white] z-20" />
      <div className="relative z-10 flex flex-col h-full overflow-hidden p-[16px]">
        <div className="w-full flex justify-between items-center mb-[16px]">
          <h2 className="text-[16px] font-semibold tracking-[-0.4px] text-[#4b4b4b]">Your Profile</h2>
          <button className="text-[#606060] hover:text-[#4b4b4b] transition-colors">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
          </button>
        </div>
        <div className="flex flex-col items-center mb-[24px]">
          <div className="rounded-full shadow-[0px_3px_5px_0px_rgba(0,0,0,0.22),0px_0px_0px_0px_rgba(96,96,96,0.31)] size-[70px] relative mb-[12px]">
            <div aria-hidden className="absolute bg-gradient-to-b from-[#f0f0f0] via-[rgba(240,240,240,0.6)] to-[#dadada] inset-0 pointer-events-none rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-gray-700 bg-transparent rounded-full overflow-hidden z-10">
              <Image
                className="object-cover"
                src={hasMounted && (user?.image || (user as any)?.avatar_url) ? (user?.image || (user as any)?.avatar_url) : './default.svg'}
                alt={hasMounted && user?.email ? user.email : 'User avatar'}
                fill
              />
            </div>
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_12px_0px_rgba(255,255,255,0.5),inset_0px_1px_0px_0px_rgba(255,255,255,0.44),inset_0px_-0.5px_0px_0px_rgba(255,255,255,0.31)] z-20" />
          </div>
          <div className="text-center">
            <h1 className="capitalize text-[16px] font-semibold text-[#4b4b4b] tracking-[-0.4px]">
              {hasMounted && (user?.name || (user as any)?.user_metadata?.full_name) ? (user?.name || (user as any)?.user_metadata?.full_name) : ''}
            </h1>
          </div>
        </div>
        <div className="flex justify-center gap-[16px] mb-[24px]">
          <Link href={"/settings"} className="drop-shadow-[0px_0px_0.5px_rgba(0,0,0,0.35),-3px_3px_3.5px_rgba(0,0,0,0.04)] relative rounded-[8px] w-[40px] h-[40px]">
            <div aria-hidden className="absolute bg-[#f5f5f5] inset-0 pointer-events-none rounded-[8px]" />
            <div className="absolute inset-0 flex items-center justify-center text-[#606060] hover:text-[#1E78FF] transition-colors z-10">
              <Settings className="w-[18px] h-[18px]" />
            </div>
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_0px_12px_0px_white,inset_0px_0px_0px_0px_white] z-20" />
          </Link>
          <Link href={"chat"} className="drop-shadow-[0px_0px_0.5px_rgba(0,0,0,0.35),-3px_3px_3.5px_rgba(0,0,0,0.04)] relative rounded-[8px] w-[40px] h-[40px]">
            <div aria-hidden className="absolute bg-[#f5f5f5] inset-0 pointer-events-none rounded-[8px]" />
            <div className="absolute inset-0 flex items-center justify-center text-[#606060] hover:text-[#1E78FF] transition-colors z-10">
              <MessageCircle className="w-[18px] h-[18px]" />
            </div>
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_0px_12px_0px_white,inset_0px_0px_0px_0px_white] z-20" />
          </Link>
        </div>
        <div className="bg-[rgba(0,0,0,0.11)] h-px w-full shadow-[0px_1px_0px_0px_white] mb-[16px]" />
        <div className="w-full flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-[12px]">
            <div className="text-[13px] font-semibold text-[#4b4b4b] tracking-[-0.325px]">Your Friends</div>
            <button className="drop-shadow-[0px_0px_0.5px_rgba(0,0,0,0.35),-3px_3px_3.5px_rgba(0,0,0,0.04)] relative rounded-[8px] w-[28px] h-[28px]" onClick={() => setModalOpen(true)}>
              <div aria-hidden className="absolute bg-[#f5f5f5] inset-0 pointer-events-none rounded-[8px]" />
              <div className="absolute inset-0 flex items-center justify-center text-[#606060] hover:text-[#1E78FF] transition-colors z-10">
                <UserPlus className="h-[14px] w-[14px]" />
              </div>
              <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_0px_12px_0px_white,inset_0px_0px_0px_0px_white] z-20" />
            </button>
          </div>
          <div className="space-y-[12px]">
            {friends === undefined ? (
              <div className="text-[13px] text-[#606060] text-center">Loading friends...</div>
            ) : friends.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-[24px]">
                <h3 className="text-[14px] font-semibold text-[#4b4b4b] mb-[2px]">No friends yet</h3>
                <p className="text-[13px] text-[#606060] leading-[17.875px] max-w-[150px] mx-auto">Use the + button above to add friends.</p>
              </div>
            ) : (
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 }
                  }
                }}
              >
                {friends.slice(0, 3).map((friend) => (
                  <motion.div 
                    key={friend.id} 
                    variants={{
                      hidden: { opacity: 0, scale: 0.95, y: 5 },
                      visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0, duration: 0.3 } }
                    }}
                    className="flex items-center gap-[12px] px-[8px] py-[6px] hover:bg-[rgba(0,0,0,0.02)] rounded-[8px] transition-colors group"
                  >
                    <div className="rounded-full shadow-[0px_3px_5px_0px_rgba(0,0,0,0.22),0px_0px_0px_0px_rgba(96,96,96,0.31)] size-[32px] relative flex-shrink-0">
                      <div aria-hidden className="absolute bg-gradient-to-b from-[#f0f0f0] via-[rgba(240,240,240,0.6)] to-[#dadada] inset-0 pointer-events-none rounded-full" />
                      <div className="absolute inset-0 flex items-center justify-center text-[12px] font-semibold text-gray-700 bg-transparent rounded-full overflow-hidden z-10">
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
                      <div className="text-[12px] font-medium text-[#4b4b4b] truncate">{friend.name || friend.email || "Unknown"}</div>
                    </div>
                    <button
                      onClick={() => setFriendToRemove({ id: friend.id, name: friend.name || friend.email || "this friend" })}
                      className="p-[6px] text-[#606060] hover:text-[#ef4444] rounded-[8px] opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                      title="Remove Friend"
                    >
                      <CircleMinus className="h-[16px] w-[16px]" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
          <AnimatePresence>
            {friends && friends.length > 3 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.95, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, scale: 1, height: 32, marginTop: 24 }}
                exit={{ opacity: 0, scale: 0.95, height: 0, marginTop: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                onClick={() => setSeeAllOpen(true)}
                className="w-full drop-shadow-[0px_0px_0.5px_rgba(0,0,0,0.35),-3px_3px_3.5px_rgba(0,0,0,0.04)] relative rounded-[8px] flex items-center justify-center transition-transform hover:scale-[0.98] active:scale-95 overflow-hidden"
              >
                <div aria-hidden className="absolute bg-[#f5f5f5] inset-0 pointer-events-none rounded-[8px]" />
                <span className="relative z-10 text-[12px] font-medium text-[#4b4b4b] leading-[16px]">See All</span>
                <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_0px_12px_0px_white,inset_0px_0px_0px_0px_white] z-20" />
              </motion.button>
            )}
          </AnimatePresence>

          {hasMounted && typeof document !== 'undefined' && <SeeAllFriendsModal isOpen={seeAllOpen} onClose={() => setSeeAllOpen(false)} onRemoveFriend={(friend) => setFriendToRemove(friend)} />}

          {hasMounted && typeof document !== 'undefined' && createPortal(
            <AnimatePresence>
              {friendToRemove && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-[rgba(0,0,0,0.2)] backdrop-blur-[8px]"
                    onClick={() => setFriendToRemove(null)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                    className="relative z-10 w-full max-w-[340px] bg-[#FCFCFC] rounded-[24px] shadow-[0px_8px_32px_rgba(0,0,0,0.08)] border border-[rgba(0,0,0,0.04)] overflow-hidden"
                  >
                    <div className="p-7 flex flex-col relative z-10 text-center">
                      <h3 className="scribe-stagger-1 text-[16px] font-semibold tracking-[-0.4px] text-[#4b4b4b]">Remove {friendToRemove.name}?</h3>
                      <p className="scribe-stagger-2 text-[13px] font-normal text-[#606060] leading-[17.875px] pt-1.5 mb-7">
                        Are you sure you want to remove this friend? You will no longer be able to share Scribes with them.
                      </p>
                      <div className="scribe-stagger-3 mt-auto flex items-center gap-3">
                        <button onClick={() => setFriendToRemove(null)} className="h-auto m-0 flex-1 drop-shadow-[0px_0px_0.5px_rgba(0,0,0,0.35),-3px_3px_3.5px_rgba(0,0,0,0.04)] relative rounded-[8px] scribe-btn-active flex items-center justify-center cursor-pointer border-none bg-transparent">
                          <div aria-hidden className="absolute bg-[#f5f5f5] inset-0 pointer-events-none rounded-[8px]" />
                          <div className="relative z-10 px-[12px] py-[8px] text-[12px] font-medium text-[#4b4b4b] leading-[16px]">Cancel</div>
                          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_0px_12px_0px_white,inset_0px_0px_0px_0px_white]" />
                        </button>
                        <button onClick={() => {
                          handleRemoveFriend(friendToRemove.id);
                          setFriendToRemove(null);
                        }} className="h-auto m-0 flex-1 drop-shadow-[0px_0px_0.5px_rgba(0,0,0,0.35),-3px_3px_3.5px_rgba(0,0,0,0.04)] relative rounded-[8px] scribe-btn-active flex items-center justify-center cursor-pointer bg-transparent hover:bg-transparent">
                          <div aria-hidden className="absolute bg-[#ef4444] inset-0 pointer-events-none rounded-[8px]" />
                          <div className="relative z-10 px-[12px] py-[8px] text-[12px] font-medium text-white leading-[16px]">Remove</div>
                          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_0px_12px_0px_rgba(255,255,255,0.3),inset_0px_0px_0px_0px_white]" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>,
            document.body
          )}

          {hasMounted && typeof document !== 'undefined' && createPortal(
            <AnimatePresence>
              {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-[rgba(239,240,238,0.4)] backdrop-blur-[8px]"
                    onClick={() => setModalOpen(false)}
                  />
                  <motion.div
                    layout
                    role="dialog"
                    aria-modal="true"
                    aria-label="Search for friends"
                    initial={{ opacity: 0, scale: 0.96, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -10 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    className="relative flex flex-col rounded-[24px] w-[540px] z-10 overflow-hidden drop-shadow-[0px_30px_60px_rgba(0,0,0,0.15)] shadow-[0px_0px_1px_rgba(0,0,0,0.1)]"
                  >
                    <div aria-hidden style={{ backdropFilter: 'blur(60px) saturate(200%)' }} className="absolute bg-[rgba(245,245,245,0.7)] inset-0 pointer-events-none rounded-[24px]" />
                    <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,1),inset_0px_0px_0px_1px_rgba(255,255,255,0.5)] z-20" />

                    <div className="relative z-10 flex flex-col w-full">
                      <div className="flex items-center px-[24px] h-[72px]">
                        <Search className="w-[24px] h-[24px] text-[#808080] mr-[16px] flex-shrink-0" />
                        <input
                          placeholder="Search for friends by name or email..."
                          autoComplete="off"
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          autoFocus
                          className="flex-1 bg-transparent border-none outline-none text-[20px] text-[#4b4b4b] placeholder:text-[#999] tracking-[-0.4px] font-medium"
                        />
                        {searchQuery && (
                          <button onClick={() => setSearchQuery('')} className="text-[12px] font-medium text-[#666] bg-[rgba(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.1)] px-[10px] py-[6px] rounded-[8px] transition-colors ml-[12px]">
                            Clear
                          </button>
                        )}
                      </div>

                      <AnimatePresence>
                        {searchQuery && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                            className="overflow-hidden"
                          >
                            <div className="bg-[rgba(0,0,0,0.06)] h-px w-full shadow-[0px_1px_0px_0px_rgba(255,255,255,0.5)]" />

                            <div className="p-[16px] max-h-[380px] overflow-y-auto">
                              {isSearching ? (
                                <motion.div key="searching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center py-[24px] text-[15px] text-[#606060]">Searching...</motion.div>
                              ) : requestSent ? (
                                <motion.div key="sent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[#1E78FF] text-[15px] font-medium text-center py-[24px]">Friend request sent!</motion.div>
                              ) : searchResults.length === 0 ? (
                                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[15px] text-[#606060] text-center py-[24px]">No users found for "{searchQuery}".</motion.div>
                              ) : (
                                <motion.div
                                  key="results"
                                  variants={{
                                    hidden: { opacity: 0 },
                                    show: {
                                      opacity: 1,
                                      transition: { staggerChildren: 0.04 }
                                    }
                                  }}
                                  initial="hidden"
                                  animate="show"
                                  className="flex flex-col gap-[6px]"
                                >
                                  {searchResults.map((user) => {
                                    const status = getFriendStatus(user.id);
                                    return (
                                      <motion.div
                                        key={user.id}
                                        variants={{
                                          hidden: { opacity: 0, y: 8, scale: 0.98 },
                                          show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0, duration: 0.4 } }
                                        }}
                                        className="flex items-center justify-between hover:bg-[rgba(0,0,0,0.04)] rounded-[14px] px-[14px] py-[10px] transition-colors"
                                      >
                                        <div className="flex items-center gap-[16px]">
                                          <div className="rounded-full shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1),0px_0px_0px_1px_rgba(0,0,0,0.05)] size-[44px] relative flex-shrink-0">
                                            <div className="absolute inset-0 flex items-center justify-center text-[15px] font-semibold text-gray-700 bg-white rounded-full overflow-hidden z-10">
                                              {user?.avatar_url ? (
                                                <Image src={user.avatar_url} alt={user.full_name || 'User'} fill className="object-cover" />
                                              ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[#606060] bg-[#f0f0f0]">
                                                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : "?"}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          <div>
                                            <div className="font-semibold text-[15px] text-[#4b4b4b] tracking-[-0.275px]">{user.full_name}</div>
                                            <div className="text-[13px] text-[#606060] leading-tight mt-[2px]">{user.email}</div>
                                          </div>
                                        </div>
                                        {(() => {
                                          if (status === "pending_sent") {
                                            return (
                                              <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleCancelRequest(user.id)}
                                                className="relative rounded-[8px] h-[32px] px-[14px] flex items-center justify-center group bg-[rgba(239,68,68,0.1)] hover:bg-[rgba(239,68,68,0.15)] transition-colors"
                                              >
                                                <span className="text-[13px] font-medium text-[#ef4444]">Cancel</span>
                                              </motion.button>
                                            );
                                          }
                                          if (status === "pending_received") {
                                            return (
                                              <div className="text-[13px] font-medium text-[#606060] bg-[rgba(0,0,0,0.05)] px-[12px] py-[8px] rounded-[8px]">
                                                Pending
                                              </div>
                                            );
                                          }
                                          if (status === "accepted") {
                                            return (
                                              <div className="flex items-center gap-[4px] text-[13px] font-medium text-[#1E78FF] bg-[rgba(30,120,255,0.08)] px-[12px] py-[8px] rounded-[8px]">
                                                <Check className="h-[16px] w-[16px]" /> Friends
                                              </div>
                                            );
                                          }
                                          return (
                                            <motion.button
                                              whileTap={{ scale: 0.95 }}
                                              onClick={() => handleSendRequest(user)}
                                              className="drop-shadow-[0px_0px_0.5px_rgba(0,0,0,0.35),-3px_3px_3.5px_rgba(0,0,0,0.04)] relative rounded-[8px] h-[32px] px-[14px] flex items-center justify-center transition-transform group"
                                            >
                                              <div aria-hidden className="absolute bg-[#1E78FF] group-hover:bg-[#1565df] transition-colors inset-0 pointer-events-none rounded-[8px]" />
                                              <span className="relative z-10 text-[12px] font-medium text-white flex items-center leading-[16px]">
                                                <UserPlus className="h-[16px] w-[16px] mr-[6px]" /> Add
                                              </span>
                                              <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_0px_12px_0px_rgba(255,255,255,0.2),inset_0px_0px_0px_0px_white] z-20" />
                                            </motion.button>
                                          );
                                        })()}
                                      </motion.div>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>,
            document.body
          )}

          <div className="mt-6">
            <div className="text-sm font-medium mb-2 text-gray-700">Requests</div>
            <div className="space-y-3">
              {pendingRequests === undefined ? (
                <div className="text-xs text-gray-400 text-center py-2">Loading requests...</div>
              ) : pendingRequests.length === 0 ? (
                <div className="text-xs text-gray-400 text-center">You&apos;re all caught up</div>
              ) : (
                <AnimatePresence>
                  {pendingRequests.map((req) => (
                    <motion.div
                      key={req._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, height: 0, marginTop: 0, marginBottom: 0, overflow: "hidden" }}
                      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                      className="flex flex-col gap-[8px] p-[12px] bg-[#f5f5f5] rounded-[12px] drop-shadow-[0px_2px_8px_rgba(0,0,0,0.06)] shadow-[inset_0px_1px_0px_rgba(255,255,255,1)] relative"
                    >
                      <div className="flex items-center gap-[12px]">
                        <div className="rounded-full shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1),0px_0px_0px_1px_rgba(0,0,0,0.05)] size-[36px] relative flex-shrink-0">
                          <div className="absolute inset-0 flex items-center justify-center text-[12px] font-semibold text-gray-700 bg-white rounded-full overflow-hidden z-10">
                            <Image
                              src={req.sender_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.sender_email || 'User')}&background=random&color=fff&size=70`}
                              alt={req.sender_name || req.sender_email || 'User'}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[14px] text-[#4b4b4b] tracking-tight truncate">{req.sender_name}</div>
                          <div className="text-[12px] text-[#808080] truncate leading-tight mt-[2px]">{req.sender_email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-[8px] mt-[4px]">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRespondRequest(req._id, "rejected")}
                          className="flex-1 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.05)] relative rounded-[8px] h-[28px] px-[12px] flex items-center justify-center transition-transform group bg-white hover:bg-[#f9f9f9] border border-gray-200"
                        >
                          <span className="relative z-10 text-[12px] font-semibold text-[#666] flex items-center leading-[16px]">
                            Reject
                          </span>
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRespondRequest(req._id, "accepted")}
                          className="flex-1 drop-shadow-[0px_0px_0.5px_rgba(0,0,0,0.35),-3px_3px_3.5px_rgba(0,0,0,0.04)] relative rounded-[8px] h-[28px] px-[12px] flex items-center justify-center transition-transform group"
                        >
                          <div aria-hidden className="absolute bg-[#1E78FF] group-hover:bg-[#1565df] transition-colors inset-0 pointer-events-none rounded-[8px]" />
                          <span className="relative z-10 text-[12px] font-semibold text-white flex items-center leading-[16px]">
                            Accept
                          </span>
                          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_0px_12px_0px_rgba(255,255,255,0.2),inset_0px_0px_0px_0px_white] z-20" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
