"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { UserPlus, Settings, BarChart2, MessageCircle } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DialogDescription } from "@radix-ui/react-dialog";

export default function Sidebar() {
  type UserData = {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };

  type SearchUser = {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
  };
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserData(data.user as unknown as UserData);
      } else {
        console.error(error);
      }
    }
    checkUser();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    const res = await fetch('/api/searchUsers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userData?.id, userinput: query }),
    });
    const { users } = await res.json();
    setSearchResults(users || []);
    setIsSearching(false);
  };

  const handleSendRequest = async (reciever: SearchUser) => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .insert([
          {
            sender_id: userData?.id,
            receiver_id: reciever.id,
            status: 'pending'
          }
        ]);

      if (error) throw error;
      
      setRequestSent(true);
      setTimeout(() => {
        setRequestSent(false);
        setModalOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }, 1200);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto bg-white rounded-3xl p-6 relative overflow-hidden">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Your Profile</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
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
              src={userData?.user_metadata?.avatar_url || './default.svg'}
              alt={userData?.email || 'User avatar'}
              width={70}
              height={70}
            />
          </div>
        </div>
        <div className="text-center">
          <h1 className="capitalize text-lg font-semibold">{userData?.user_metadata?.full_name}</h1>
        </div>
      </div>
      <div className="flex justify-center gap-6 my-4">
        <button className="w-10 h-10 rounded-full border flex items-center justify-center text-gray-500 hover:bg-gray-100">
          <Settings className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-full border flex items-center justify-center text-gray-500 hover:bg-gray-100">
          <BarChart2 className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-full border flex items-center justify-center text-gray-500 hover:bg-gray-100">
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>
      <div className="w-full mt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-base font-semibold">Your Friends</div>
          <button className="w-7 h-7 rounded-full border flex items-center justify-center text-gray-500 hover:bg-gray-100" onClick={() => setModalOpen(true)}>
            <UserPlus className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div className="text-xs text-gray-400 text-center">No Friends yet.</div>
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
              onChange={e => handleSearch(e.target.value)}
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
                          alt={user.full_name || user.email} 
                          width={32} 
                          height={32} 
                          className="rounded-full object-cover" 
                        />
                        <div>
                          <div className="font-medium text-sm">{user.full_name}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </div>
                      </div>
                      <Button size="sm" className="rounded-full px-3 bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleSendRequest(user)}>
                        <UserPlus className="h-4 w-4 mr-1" /> Request
                      </Button>
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
              <div className="text-xs text-gray-400 text-center">You&apos;re all caught up</div>
          </div>
        </div>
      </div>
    </div>
  );
}
