"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserPlus, Settings, MessageCircle, Check, X, CircleMinus } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DialogDescription } from "@radix-ui/react-dialog";

export default function ProfilePane() {
  const user = useQuery(api.users.current);
  const friends = useQuery(api.queries.getFriends);
  const sendFriendRequest = useMutation(api.queries.sendFriendRequest);
  const [hasMounted, setHasMounted] = useState(false);

  type SearchUser = {
    id: string;
    email?: string;
    full_name?: string;
    avatar_url?: string;
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const convexSearchResults = useQuery(
    api.users.searchUsers,
    searchQuery.trim() ? { userinput: searchQuery } : "skip"
  );

  const isSearching = searchQuery.trim() !== '' && convexSearchResults === undefined;
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
              <div className="text-[13px] text-[#606060] text-center">No Friends yet.</div>
            ) : (
              friends.map((friend) => (
                <div key={friend.id} className="flex items-center gap-[12px] px-[8px] py-[6px] hover:bg-[rgba(0,0,0,0.02)] rounded-[8px] transition-colors">
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
                    onClick={() => handleRemoveFriend(friend.id)}
                    className="p-[6px] text-[#606060] hover:text-[#ef4444] rounded-[8px] transition-colors"
                    title="Remove Friend"
                  >
                    <CircleMinus className="h-[16px] w-[16px]" />
                  </button>
                </div>
              ))
            )}
          </div>
          <button className="w-full mt-[24px] drop-shadow-[0px_0px_0.5px_rgba(0,0,0,0.35),-3px_3px_3.5px_rgba(0,0,0,0.04)] relative rounded-[8px] h-[32px] flex items-center justify-center transition-transform hover:scale-[0.98] active:scale-95">
            <div aria-hidden className="absolute bg-[#f5f5f5] inset-0 pointer-events-none rounded-[8px]" />
            <span className="relative z-10 text-[12px] font-medium text-[#4b4b4b] leading-[16px]">See All</span>
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_0px_12px_0px_white,inset_0px_0px_0px_0px_white] z-20" />
          </button>

          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add a Friend</DialogTitle>
                <DialogDescription>
                  Search for users by name or email to send a friend request.
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
                className="mb-4"
              />
              {searchQuery && (
                <div className="space-y-2 min-h-[60px]">
                  {isSearching ? (
                    <div className="flex justify-center py-4">Searching...</div>
                  ) : requestSent ? (
                    <div className="text-green-600 text-center py-4">Friend request sent!</div>
                  ) : searchResults.length === 0 ? (
                    <div className="text-xs text-gray-400 text-center">No users found.</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map(user => (
                      <div key={user.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-3">
                          <Image
                            src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'User')}&background=random&color=fff&size=70`}
                            alt={user.full_name || user.email || 'User'}
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-sm">{user.full_name}</div>
                            <div className="text-xs text-gray-400">{user.email}</div>
                          </div>
                        </div>
                        {(() => {
                          const status = getFriendStatus(user.id);
                          if (status === "pending_sent") {
                            return (
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full px-3 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                                onClick={() => handleCancelRequest(user.id)}
                              >
                                Cancel
                              </Button>
                            );
                          }
                          if (status === "pending_received") {
                            return (
                              <Button size="sm" className="rounded-full px-3 bg-gray-200 text-gray-500 cursor-not-allowed" disabled>
                                Respond below
                              </Button>
                            );
                          }
                          if (status === "accepted") {
                            return (
                              <Button size="sm" className="rounded-full px-3 bg-gray-200 text-gray-500 cursor-not-allowed" disabled>
                                Friends
                              </Button>
                            );
                          }
                          return (
                            <Button size="sm" className="rounded-full px-3 bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleSendRequest(user)}>
                              <UserPlus className="h-4 w-4 mr-1" /> Request
                            </Button>
                          );
                        })()}
                      </div>
                    ))
                  ) : null}
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setModalOpen(false)} className="w-full">Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="mt-6">
            <div className="text-sm font-medium mb-2 text-gray-700">Requests</div>
            <div className="space-y-3">
              {pendingRequests === undefined ? (
                <div className="text-xs text-gray-400 text-center py-2">Loading requests...</div>
              ) : pendingRequests.length === 0 ? (
                <div className="text-xs text-gray-400 text-center">You&apos;re all caught up</div>
              ) : (
                pendingRequests.map((req) => (
                  <div key={req._id} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Image
                        src={req.sender_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.sender_email || 'User')}&background=random&color=fff&size=70`}
                        alt={req.sender_name || req.sender_email || 'User'}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{req.sender_name}</div>
                        <div className="text-xs text-gray-400 truncate">{req.sender_email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleRespondRequest(req._id, "rejected")}>
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
                      <Button size="sm" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleRespondRequest(req._id, "accepted")}>
                        <Check className="h-4 w-4 mr-1" /> Accept
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
