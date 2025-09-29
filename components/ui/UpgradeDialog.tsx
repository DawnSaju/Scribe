"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";

interface PlanOption {
  id: string;
  name: string;
  price: string;
  period: string;
  color: string;
  features: string[];
  accentRing: string;
}

const basePlans: PlanOption[] = [
  {
    id: "PREMIUM",
    name: "Scribe Premium",
    price: "$12.99",
    period: "month",
    color: "text-primary",
    features: [
      "Unlimited words",
      "All streaming platforms",
      "AI explanations",
      "Spaced repetition",
      "Advanced analytics",
      "Offline study modes",
    ],
    accentRing: "ring-primary",
  },
  {
    id: "ENTREPRISE",
    name: "Scribe Education",
    price: "$299",
    period: "month",
    color: "text-[#ff4f78]",
    features: [
      "Up to 50 seats",
      "Admin dashboard",
      "Progress reporting",
      "Custom content upload",
      "Collaboration",
    ],
    accentRing: "ring-[#ff4f78]",
  },
];

type Tier = "FREE" | "PREMIUM" | "ENTREPRISE";

interface User { 
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
}

interface UpgradeDialogProps {
  triggerLabel?: string;
  disabled?: boolean;
  currentTier?: Tier;
  isBeta?: boolean;
  userData: User;
}

export default function UpgradeDialog({
  triggerLabel = "Upgrade",
  disabled = false,
  currentTier = "FREE",
  isBeta = false,
  userData,
}: UpgradeDialogProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PlanOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tierOrder: Tier[] = ["FREE", "PREMIUM", "ENTREPRISE"];
  const normalizedTier: Tier = currentTier;
  const currentIndex = tierOrder.indexOf(normalizedTier);

  let plans: PlanOption[];

  if (isBeta) {
    plans = basePlans.map((plan) => ({
      ...plan,
      period: "beta",
      features: [...plan.features, "Beta Access"],
    }));
  } else {
    plans = basePlans.filter(
      (p) => p.id !== normalizedTier && tierOrder.includes(p.id as Tier)
    );
  }

  const isDowngrade = (plan: PlanOption) =>
    tierOrder.indexOf(plan.id as Tier) < currentIndex;
  const isUpgrade = (plan: PlanOption) =>
    tierOrder.indexOf(plan.id as Tier) > currentIndex;

  const handleCheckout = async () => {
    if (!selected) return;
  
    setIsProcessing(true);
    setError(null);
  
    try {
      const resp = await fetch('/api/tier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.id,
          planId: selected.id,
        }),
      });
  
      if (!resp.ok) {
        const j = await resp.json();
        throw new Error(j.error || 'Update failed');
      }
  
      console.log('Plan updated via server');
      setOpen(false);
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const resp = await fetch('/api/tier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.id,
          planId: "FREE",
        }),
      });

      if (!resp.ok) {
        const j = await resp.json();
        throw new Error(j.error || 'Update failed');
      }

      console.log('Subscription cancelled via server');
      setOpen(false);
    } catch (err: any) {
      console.error('Cancel subscription error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="w-full md:w-auto"
      >
        {triggerLabel}
      </Button>
      {normalizedTier !== "FREE" && (
        <Button
          type="button"
          disabled={disabled}
          onClick={() => handleCancelSubscription()}
          className="w-full md:w-auto !bg-transparent !text-destructive !border !border-destructive hover:!bg-destructive/10 hover:!text-destructive transition-colors font-medium"
        >
          Manage or Cancel Subscription
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {normalizedTier === "FREE"
                ? "Upgrade your plan"
                : "Change your plan"}
            </DialogTitle>
            <DialogDescription>
              {isBeta
                ? "You're in the beta program — enjoy all features for free!"
                : normalizedTier === "FREE"
                ? "Choose a plan to unlock more features."
                : "You can upgrade or downgrade your current subscription."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            {plans.map((plan) => {
              const active = selected?.id === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelected(plan)}
                  className={`relative text-left rounded-lg border p-4 flex flex-col gap-3 transition focus:outline-none focus-visible:ring-2 ${
                    active
                      ? `bg-accent/10 border-accent ${plan.accentRing} ring-2`
                      : "hover:border-foreground/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold text-lg ${plan.color}`}>
                      {plan.name}
                    </h3>
                    {active && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground select-none">
                        Selected
                      </span>
                    )}
                    {!active && isBeta && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 select-none">
                        Beta Access
                      </span>
                    )}
                    {!active && !isBeta && isUpgrade(plan) && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 select-none">
                        Upgrade
                      </span>
                    )}
                    {!active && !isBeta && isDowngrade(plan) && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 select-none">
                        Downgrade
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2">
                    {isBeta ? (
                      <>
                        <span className="text-sm text-muted-foreground line-through">
                          {plan.price}
                        </span>
                        <span className="text-2xl font-semibold text-blue-600">
                          $0
                        </span>
                        <span className="text-xs text-blue-600 ml-1 select-none">
                          beta
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl font-semibold">
                          {plan.price}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          / {plan.period}
                        </span>
                      </>
                    )}
                  </div>

                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground max-h-32 overflow-y-auto pr-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          {error && (
            <p className="text-xs text-destructive mt-3">{error}</p>
          )}

          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-[11px] text-muted-foreground">
              {isBeta
                ? "Beta users have free access to all tiers. No payment required."
                : selected
                ? isUpgrade(selected)
                  ? "This will initiate an upgrade flow. Pricing & proration will appear in checkout."
                  : "This will schedule a downgrade effective next billing cycle."
                : "Select a plan to continue. Billing integration coming soon."}
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={!selected || isProcessing}
                onClick={handleCheckout}
              >
                {isProcessing
                  ? "Processing..."
                  : selected
                  ? isBeta
                    ? `Select ${selected.name}`
                    : isUpgrade(selected)
                    ? `Upgrade to ${selected.name}`
                    : `Downgrade to ${selected.name}`
                  : "Choose a plan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
