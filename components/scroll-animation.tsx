"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale";
  delay?: number;
  threshold?: number;
  once?: boolean;
}

export function ScrollAnimation({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  threshold = 0.1,
  once = true,
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, once]);

  const animationClasses = {
    "fade-up": {
      initial: "translate-y-8 opacity-0",
      visible: "translate-y-0 opacity-100",
    },
    "fade-in": {
      initial: "opacity-0",
      visible: "opacity-100",
    },
    "slide-left": {
      initial: "translate-x-8 opacity-0",
      visible: "translate-x-0 opacity-100",
    },
    "slide-right": {
      initial: "-translate-x-8 opacity-0",
      visible: "translate-x-0 opacity-100",
    },
    scale: {
      initial: "scale-95 opacity-0",
      visible: "scale-100 opacity-100",
    },
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible
          ? animationClasses[animation].visible
          : animationClasses[animation].initial,
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale";
}

export function StaggerChildren({
  children,
  className,
  staggerDelay = 100,
  animation = "fade-up",
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const animationClasses = {
    "fade-up": {
      initial: "translate-y-6 opacity-0",
      visible: "translate-y-0 opacity-100",
    },
    "fade-in": {
      initial: "opacity-0",
      visible: "opacity-100",
    },
    "slide-left": {
      initial: "translate-x-6 opacity-0",
      visible: "translate-x-0 opacity-100",
    },
    "slide-right": {
      initial: "-translate-x-6 opacity-0",
      visible: "translate-x-0 opacity-100",
    },
    scale: {
      initial: "scale-95 opacity-0",
      visible: "scale-100 opacity-100",
    },
  };

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={index}
              className={cn(
                "transition-all duration-500 ease-out",
                isVisible
                  ? animationClasses[animation].visible
                  : animationClasses[animation].initial
              )}
              style={{ transitionDelay: isVisible ? `${index * staggerDelay}ms` : "0ms" }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}
