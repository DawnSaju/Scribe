import * as React from "react"
import { cn } from "@/lib/utils"

interface PlatformProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  pauseOnHover?: boolean
  direction?: "left" | "right"
  speed?: number
}

export function Platforms({
  children,
  pauseOnHover = false,
  direction = "left",
  speed = 30,
  className,
  ...props
}: PlatformProps) {
  return (
    <div 
      className={cn(
        className,
        "flex justify-center items-center"
      )} 
      {...props}
    >
      <div className="relative flex max-w-[90vw] overflow-hidden py-5">
        <div 
          className={cn(
            "flex w-max",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}