"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  speed?: "slow" | "normal" | "fast";
}

export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = true,
  speed = "normal",
}: MarqueeProps) {
  const id = useId().replace(/:/g, "");
  
  const speedMap = {
    slow: 40,
    normal: 25,
    fast: 15,
  };

  const gap = 32; // 2rem in pixels
  const duration = speedMap[speed];
  const direction = reverse ? "reverse" : "normal";

  const keyframes = `
    @keyframes marquee-${id} {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(calc(-100% - ${gap}px));
      }
    }
  `;

  const animationStyle: React.CSSProperties = {
    animation: `marquee-${id} ${duration}s linear infinite ${direction}`,
    gap: `${gap}px`,
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      <div
        className={cn("group flex overflow-hidden", className)}
        style={{
          maskImage:
            "linear-gradient(to right, transparent, white 5%, white 95%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, white 5%, white 95%, transparent)",
        }}
      >
        <div
          className={cn(
            "flex shrink-0 items-center justify-around",
            pauseOnHover && "group-hover:[animation-play-state:paused]"
          )}
          style={animationStyle}
        >
          {children}
        </div>
        <div
          className={cn(
            "flex shrink-0 items-center justify-around",
            pauseOnHover && "group-hover:[animation-play-state:paused]"
          )}
          style={animationStyle}
          aria-hidden
        >
          {children}
        </div>
      </div>
    </>
  );
}
