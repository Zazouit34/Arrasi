'use client';

import { cn } from "@/lib/utils"

interface LoaderProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function GoldenLoader({ size = "md", className }: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className={cn(
          "animate-spin rounded-full border-t-transparent",
          "border-l-transparent border-r-amber-400/50",
          "border-b-amber-400 bg-gradient-to-tr from-amber-50/10 to-amber-400/20",
          sizeClasses[size],
          className,
        )}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
} 