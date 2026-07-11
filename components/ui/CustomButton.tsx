import React from "react";
import { cn } from "@/lib/utils";

export function CustomButton({ children, className = "", onClick, disabled }: { children: React.ReactNode; className?: string, onClick?: (e: React.MouseEvent) => void, disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className={cn("drop-shadow-[0px_0px_0.5px_rgba(0,0,0,0.35),-3px_3px_3.5px_rgba(0,0,0,0.04)] relative rounded-[8px] group active:shadow-[0px_0px_1px_0px_rgba(0,0,0,0.35),-3px_3px_7px_0px_rgba(0,0,0,0.04)]", disabled ? "opacity-50 cursor-not-allowed" : "", className)}>
      <div aria-hidden className="absolute bg-[#f5f5f5] inset-0 pointer-events-none rounded-[8px] group-hover:bg-[#f0f0f0] transition-colors" />
      <div className="relative z-10 px-[12px] py-[6px] flex items-center justify-center gap-[8px] text-[12px] font-medium text-[#4b4b4b] leading-[16px]">
        {children}
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_0px_12px_0px_white,inset_0px_0px_0px_0px_white]" />
    </button>
  );
}
