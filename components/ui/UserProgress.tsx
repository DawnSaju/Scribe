"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect } from "react";

export interface Stat {
  label: string;
  value: number;
  unit?: string;
}

interface UserProgressProps {
  stats?: Stat[];
  className?: string;
}

const COLORS = {
  "Spent": "#FF2D55",
  "Watched": "#2CD758",
  Stand: "#007AFF", 
} as const;

const radius = 40; 
const circumference = 2 * Math.PI * radius;

export function UserProgress({
  stats = [],
  className
}: UserProgressProps) {
  return (
    <div
      className={cn(
        "relative h-full rounded-3xl p-6",
        "transition-all duration-300",
        className
      )}
    >
      <div className="flex justify-center items-center gap-4">
        {stats.map((stat) => {
          const stroke = useMotionValue(circumference);

          useEffect(() => {
            const target = circumference - (stat.value / 100) * circumference;
            animate(stroke, target, { duration: 1.5, ease: "easeInOut" });
          }, [stat.value, stroke]);

          return (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    strokeWidth="8"
                    fill="none"
                    className="stroke-zinc-200 dark:stroke-zinc-800/50"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r={radius}
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    style={{
                      stroke: COLORS[stat.label as keyof typeof COLORS],
                      strokeDasharray: circumference,
                      strokeDashoffset: stroke,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-zinc-900 dark:text-white">
                    {stat.value}
                  </span>
                  {stat.unit && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {stat.unit}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 
