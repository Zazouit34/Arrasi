"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function VenueLoadingSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      {/* Image skeleton */}
      <div className="relative h-48 bg-muted animate-pulse" />
      
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
          
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-12 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function VenueGridLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6).fill(0).map((_, index) => (
        <VenueLoadingSkeleton key={index} />
      ))}
    </div>
  )
} 