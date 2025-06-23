"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSupabase } from "@/db/SupabaseProvider";

export default function Settings() {
  const router = useRouter();
  const { user, supabase } = useSupabase();
  const [value, setValue] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const namelength = 32;
  const isError = value.length > namelength;

  useEffect(() => {
    setValue(user?.user_metadata?.name || "");
  }, [user]);

  const deleteModal = () => {
    setDeleteModalOpen(true);
  }

  const handleDeleteACc = async () => {
    if (!user) {
        return;
    }
    setIsDeleting(true);
    
    try {
      const response = await fetch('/api/userControl/deleteUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
          body: JSON.stringify({ id: user.id }),
    });

      if (response.ok) {
          await supabase.auth.signOut();
          router.push("/auth");
      } else {
          console.error("Failed to delete account");
      }
    } catch (error) {
        console.error("An unexpected error occurred:", error);
    } finally {
        setIsDeleting(false);
        setDeleteModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col justify-center">
        <div className="w-full h-24">
            <div className="flex flex-col justify-center h-full p-8">
                <h1 className="font-['DM Sans'] font-bold text-black text-4xl">Settings</h1>
            </div>
            <hr />
        </div>
        <div className="flex flex-col w-full min-h-screen p-8 gap-4">
            <div className="w-full h-fit flex flex-col rounded-xl border-2 border-black/6 p-4 gap-4">
                <div className="flex flex-col justify-center gap-1">
                    <h1 className="font-['DM Sans'] font-semibold text-xl text-black">Avatar</h1>
                    <p className="font-['DM Sans'] text-sm text-black/50">Avatar is your profile picture - everyone who visits your profile will see this.</p>
                </div>
                <div className="flex flex-row items-center gap-4">
                    <img className="w-10 h-10 rounded-full object-cover" src={ user?.user_metadata?.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email ?? "")}&background=random&color=fff&size=70`} alt="User profile"/>
                    <div className="relative">
                        <Button type="button" variant="ghost" className="text-black border border-black/10 hover:bg-transparent flex items-center gap-2" asChild>
                            <label htmlFor="profile-upload" className="cursor-pointer">
                                <UploadIcon className="h-4 w-4" />
                                Upload
                            </label>
                        </Button>
                        <Input id="avatar-upload" type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"/>
                    </div>
                </div>
                <hr />
                <div className="flex flex-col justify-center items-end">
                    <Button className="bg-black text-white hover:bg-black hover:text-white cursor-pointer">Save</Button>
                </div>
            </div>

            <div className="w-full h-fit flex flex-col rounded-xl border-2 border-black/6 p-4 gap-4">
                <div className="flex flex-col justify-center gap-6">
                    <div className="flex flex-col justify-center gap-1">
                        <h1 className="font-['DM Sans'] font-semibold text-xl text-black">Display Name</h1>
                        <p className="font-['DM Sans'] text-sm text-black/50">Enter your full name or a display name you&apos;d like to use</p>
                    </div>
                    <Input value={value} onChange={(e) => setValue(e.target.value)} className={`max-w-xs ${isError ? 'max-w-xs border-destructive ring-1 ring-destructive' : ''} `} placeholder="Enter name" />
                    <hr />
                    <div className="flex flex-row justify-between items-center">
                        {isError ? (
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="h-4 w-4 text-destructive" />
                                <p className="font-['DM Sans'] text-sm text-destructive">
                                    Maximum allowed length is {namelength} characters.
                                </p>
                            </div>
                        ) : (
                            <p className="font-['DM Sans'] text-sm text-black/50">Maximum allowed length is 32 characters.</p>
                        )}
                        <Button className="bg-black text-white hover:bg-black hover:text-white cursor-pointer">Save</Button>
                    </div>
                </div>
            </div>

            <div className="w-full h-fit flex flex-col rounded-xl border-2 border-black/6 p-4 gap-4">
                <div className="flex flex-col justify-center gap-6">
                    <div className="flex flex-col justify-center gap-1">
                        <h1 className="font-['DM Sans'] font-semibold text-xl text-black">Delete account</h1>
                        <p className="font-['DM Sans'] text-sm text-black/50">This will permanently delete your Personal account. Please note that this action is irreversible, so proceed with caution</p>
                    </div>
                    <hr />
                    <div className="flex flex-row justify-between items-center">
                        <h1 className="font-['DM Sans'] font-medium text-sm text-red-500">This action cannot be undone!</h1>
                        <Button onClick={deleteModal} className="bg-red-600 text-white hover:bg-red-500 hover:text-white cursor-pointer">Delete account</Button>
                    </div>
                </div>
            </div>
        </div>
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you really sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove all your existing data on Scribe.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteACc} className="bg-red-600 text-white hover:bg-red-500" disabled={isDeleting}>
                      {isDeleting ? (
                          <span className="animate-spin inline-block h-5 w-5 rounded-full border-4 border-t-4 border-gray-200 border-t-red-600"></span>
                      ) : (
                          "Delete"
                      )}
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 
