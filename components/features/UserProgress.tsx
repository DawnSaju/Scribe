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

function Progress({ stat }: { stat: Stat }) {
  const stroke = useMotionValue(circumference);

  useEffect(() => {
    const target = circumference - (stat.value / 100) * circumference;
    animate(stroke, target, { duration: 1.5, ease: "easeInOut" });
  }, [stat.value, stroke]);

  return (
    <div key={stat.label} className="flex flex-col items-center gap-[8px]">
      <div className="relative w-[56px] h-[56px] flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            strokeWidth="6"
            fill="none"
            stroke="rgba(0,0,0,0.06)"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            strokeWidth="6"
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
          <span className="text-[14px] font-semibold text-[#4b4b4b]">
            {stat.value}
          </span>
          {stat.unit && (
            <span className="text-[9px] text-[#606060]">
              {stat.unit}
            </span>
          )}
        </div>
      </div>

      <div className="text-[12px] font-medium text-[#606060]">
        {stat.label}
      </div>
    </div>
  );
}

export function UserProgress({
  stats = [],
  className
}: UserProgressProps) {
  return (
    <div
      className={cn(
        "relative h-full rounded-[12px]",
        "transition-all duration-300",
        className
      )}
    >
      <div className="flex justify-center items-center gap-[16px] h-full">
        {stats.map((stat) => (
          <Progress key={stat.label} stat={stat} />
        ))}
      </div>
    </div>
  );
} 
