"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@/convex/_generated/api";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Check, Info, Crown, ShieldAlert } from 'lucide-react';
import UpgradeDialog from "@/components/features/UpgradeDialog";

const tierMeta: Record<string, { label: string; features: string[]; gradientFrom: string; gradientTo: string; icon: React.ReactNode; color: string; }> = {
  FREE: {
    label: 'Scribe Starter',
    features: ['25 words / month', 'Netflix integration', 'Basic definitions', 'Youtube integration', 'Simple review','Basic progress'],
    gradientFrom: 'from-primary/10',
    gradientTo: 'to-white',
    icon: <Info className='h-5 w-5 text-primary' />,
    color: 'hsl(var(--primary))'
  },
  PREMIUM: {
    label: 'Scribe Premium',
    features: ['Unlimited words','All platforms','AI explanations','Spaced repetition', 'Offline study'],
    gradientFrom: 'from-[#53ddc0]/15',
    gradientTo: 'to-white',
    icon: <Crown className='h-5 w-5' style={{ color: '#53ddc0' }} />,
    color: '#53ddc0'
  },
  ENTREPRISE: {
    label: 'Scribe Education',
    features: ['Up to 50 seats','Admin dashboard','Reporting','Custom uploads','Collaboration'],
    gradientFrom: 'from-[#ff4f78]/15',
    gradientTo: 'to-white',
    icon: <ShieldAlert className='h-5 w-5' style={{ color: '#ff4f78' }} />,
    color: '#ff4f78'
  }
};

export default function Settings() {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.current);
  const wordCount = useQuery(api.queries.getLearnedWordsCount, user ? { userId: user._id } : "skip");
  const updateUserMetadata = useMutation(api.users.updateUserMetadata);
  const deleteUser = useMutation(api.users.deleteUser);

  const [displayName, setDisplayName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.name || '');
    }
  }, [user]);

  useEffect(() => {
    if (user === null) {
      router.push('/auth');
    }
  }, [user, router]);

  if (user === undefined || user === null || wordCount === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary text-primary"></div>
      </div>
    );
  }

  const tier = user.tier?.toUpperCase() || 'FREE';
  const isBeta = user.beta || false;
  const email = user.email ?? null;
  const lastSignIn = user.last_sign_in_at ?? null;

  const meta = tierMeta[tier] || tierMeta.FREE;
  const wordLimit = 7;
  const usagePercent = tier === 'FREE' ? Math.min(100, (wordCount / wordLimit) * 100) : 100;

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = displayName.trim();
    if (!name || name.length > 32) return;
    setIsSavingName(true);
    try {
      await updateUserMetadata({ name });
      console.log("Name updated successfully");
    } catch (err) {
      console.error("Failed to update name:", err);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to permanently delete your account? This action is irreversible.")) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteUser({ id: user._id });
      await signOut();
      router.push('/auth');
    } catch (err) {
      console.error("Failed to delete account:", err);
      setIsDeleting(false);
    }
  };

  return (
    <div className='min-h-screen pb-16'>
      <header className='border-b bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='max-w-5xl mx-auto px-6 py-10'>
          <h1 className="font-['DM Sans'] font-bold text-3xl md:text-4xl tracking-tight">Account Settings</h1>
          <p className='mt-2 text-sm md:text-base text-muted-foreground max-w-2xl'>Manage your profile, subscription and account data.</p>
        </div>
      </header>
      <main className='max-w-5xl mx-auto px-6 mt-10 space-y-10'>
        <section className='rounded-2xl border bg-gradient-to-br p-6 md:p-8 shadow-sm relative overflow-hidden group transition-colors duration-300 border-border/60 hover:border-border/80 bg-background'>
          <div className={`absolute inset-0 pointer-events-none opacity-70 bg-gradient-to-r ${meta.gradientFrom} ${meta.gradientTo}`} />
          <div className='relative flex flex-col md:flex-row md:items-start gap-8'>
            <div className='flex-1 space-y-4'>
              <div className='inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ring-black/20' style={{ color: meta.color, backgroundColor: meta.color + '1A', borderColor: meta.color + '33' }}>
                {meta.icon}
                <span>{meta.label}</span>
              </div>
              <div>
                <h2 className='text-xl md:text-2xl font-semibold tracking-tight'>Subscription</h2>
                <p className='text-sm text-muted-foreground mt-1'>You are on the <span className='font-medium' style={{ color: meta.color }}>{tier}</span> plan.</p>
              </div>
              {tier === 'FREE' && (
                <div className='max-w-md space-y-3'>
                  <div className='flex justify-between text-xs font-medium'><span className='text-muted-foreground'>Monthly words</span><span>{wordCount}/{wordLimit}</span></div>
                  <Progress value={usagePercent} className='h-2' />
                  <p className='text-[11px] text-muted-foreground'>Upgrade to remove limits and unlock AI & advanced features.</p>
                </div>
              )}
              {tier !== 'FREE' && (
                <div className='text-xs font-medium text-muted-foreground'>Usage: <span className='text-green-600'>Unlimited</span></div>
              )}
              <ul className='grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm mt-4'>
                {meta.features.map(f => (
                  <li key={f} className='flex items-start gap-2'><Check className='h-4 w-4 mt-0.5' style={{ color: meta.color }} /> <span className='text-muted-foreground leading-snug'>{f}</span></li>
                ))}
              </ul>
            </div>
            <div className='w-full md:w-auto flex flex-col gap-3 md:items-end'>
              <UpgradeDialog
                currentTier={tier as any}
                isBeta={isBeta}
                triggerLabel={
                  tier === 'FREE' ? 'Upgrade to Premium' :
                  tier === 'PREMIUM' || tier === 'PREMIUM' ? 'Change Plan' :
                  tier === 'ENTREPRISE' ? 'Change / Downgrade Plan' : 'Change Plan'
                }
              />
            </div>
          </div>
        </section>

        <section className='rounded-xl border p-6 md:p-8 bg-card shadow-sm space-y-8'>
          <div>
            <h2 className='text-lg md:text-xl font-semibold tracking-tight'>Profile</h2>
            <p className='text-sm text-muted-foreground mt-1'>Public information.</p>
          </div>
            <form onSubmit={handleUpdateName} className='flex flex-col sm:flex-row gap-6'>
              <div className='flex items-start gap-4'>
                <div className='w-16 h-16 rounded-full bg-muted flex items-center justify-center text-sm font-medium'>
                  {displayName?.charAt(0)?.toUpperCase() || email?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className='space-y-3'>
                  <div>
                    <p className='text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1'>Display Name</p>
                    <Input name='displayName' value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={32} className='max-w-xs' required />
                    <p className='mt-1 text-[11px] text-muted-foreground'>Max length 32 characters.</p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Button size='sm' className='px-5' disabled={isSavingName}>
                      {isSavingName ? "Saving..." : "Save Name"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
        </section>

        <section className='rounded-xl border p-6 md:p-8 bg-card shadow-sm space-y-6'>
          <div>
            <h2 className='text-lg md:text-xl font-semibold tracking-tight'>Account Information</h2>
            <p className='text-sm text-muted-foreground mt-1'>Session & security data.</p>
          </div>
          <div className='grid sm:grid-cols-2 gap-6 text-sm'>
            <div className='space-y-1'>
              <p className='text-xs uppercase tracking-wide text-muted-foreground font-medium'>Email</p>
              <p className='font-medium break-all'>{email}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-xs uppercase tracking-wide text-muted-foreground font-medium'>Last Sign In</p>
              <p>{lastSignIn ? new Date(lastSignIn).toLocaleString() : '—'}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-xs uppercase tracking-wide text-muted-foreground font-medium'>Tier</p>
              <p className='font-medium' style={{ color: meta.color }}>{tier}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-xs uppercase tracking-wide text-muted-foreground font-medium'>User ID</p>
              <p className='font-mono text-xs bg-muted/50 px-2 py-1 rounded-md w-fit'>{user._id.slice(0,12)}…</p>
            </div>
          </div>
        </section>

        <section className='rounded-xl border p-6 md:p-8 bg-card shadow-sm space-y-6 border-destructive/40'>
          <div>
            <h2 className='text-lg md:text-xl font-semibold tracking-tight text-destructive'>Danger Zone</h2>
            <p className='text-sm text-muted-foreground mt-1'>Irreversible destructive actions.</p>
          </div>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4'>
              <div className='space-y-1'>
                <p className='font-medium text-destructive'>Delete Account</p>
                <p className='text-xs text-muted-foreground max-w-md'>This permanently deletes your account & data.</p>
              </div>
              <form onSubmit={handleDeleteAccount} className='md:w-auto w-full'>
                <Button type='submit' variant='destructive' className='w-full' disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
