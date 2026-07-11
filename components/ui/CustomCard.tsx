import React from "react";

export function CustomCard({ children, className = "p-[16px]" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`drop-shadow-[0px_0px_0.5px_rgba(0,0,0,0.35),-3px_3px_3.5px_rgba(0,0,0,0.04)] relative rounded-[12px] ${className}`}>
      <div aria-hidden className="absolute bg-[#f5f5f5] inset-0 pointer-events-none rounded-[12px]" />
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_0px_12px_0px_white,inset_0px_0px_0px_0px_white] z-20" />
    </div>
  );
}
