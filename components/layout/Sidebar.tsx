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

export default function Sidebar() {
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
    <div className="flex flex-col items-center w-full max-w-sm mx-auto bg-white rounded-3xl p-6 relative overflow-hidden">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Your Profile</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
        </button>
      </div>
      <div className="flex flex-col items-center mb-4">
        <div className="relative w-24 h-24 mb-2">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="8" fill="none" />
            <circle cx="50" cy="50" r="40" stroke="#2563EB" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset="50" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-gray-700 bg-white rounded-full">
            <Image
              className="rounded-full object-cover"
              src={hasMounted && (user?.image || (user as any)?.avatar_url) ? (user?.image || (user as any)?.avatar_url) : './default.svg'}
              alt={hasMounted && user?.email ? user.email : 'User avatar'}
              width={70}
              height={70}
            />
          </div>
        </div>
        <div className="text-center">
          <h1 className="capitalize text-lg font-semibold">
            {hasMounted && (user?.name || (user as any)?.user_metadata?.full_name) ? (user?.name || (user as any)?.user_metadata?.full_name) : ''}
          </h1>
        </div>
      </div>
      <div className="flex justify-center gap-6 my-4">
        <Link href={"/settings"} className="w-10 h-10 rounded-full border flex items-center justify-center text-gray-500 hover:bg-gray-100">
          <Settings className="w-5 h-5" />
        </Link>
        <Link href={"chat"} className="w-10 h-10 rounded-full border flex items-center justify-center text-gray-500 hover:bg-gray-100">
          <MessageCircle className="w-5 h-5" />
        </Link>
      </div>
      <div className="w-full mt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-base font-semibold">Your Friends</div>
          <button className="w-7 h-7 rounded-full border flex items-center justify-center text-gray-500 hover:bg-gray-100" onClick={() => setModalOpen(true)}>
            <UserPlus className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          {friends === undefined ? (
            <div className="text-xs text-gray-400 text-center">Loading friends...</div>
          ) : friends.length === 0 ? (
            <div className="text-xs text-gray-400 text-center">No Friends yet.</div>
          ) : (
            friends.map((friend) => (
              <div key={friend.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative flex-shrink-0">
                  {friend.image ? (
                    <Image src={friend.image} alt={friend.name || "Friend"} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-medium text-gray-500">
                      {friend.name ? friend.name.charAt(0).toUpperCase() : "?"}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{friend.name || friend.email || "Unknown"}</div>
                </div>
                <button
                  onClick={() => handleRemoveFriend(friend.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove Friend"
                >
                  <CircleMinus className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
        <Button variant="outline" className="w-full mt-6 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl">See All</Button>

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
  );
}
