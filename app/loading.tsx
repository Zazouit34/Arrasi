import { VenueGridLoadingSkeleton } from "./components/venue-loading-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomeLoading() {
  return (
    <main className="min-h-screen">
      <div className="relative">
        {/* Hero section skeleton */}
        <div className="w-full h-[500px] bg-muted relative">
          <div className="absolute inset-0 flex items-center justify-center flex-col p-6">
            <Skeleton className="h-12 w-3/4 md:w-1/2 mb-4" />
            <Skeleton className="h-6 w-2/3 md:w-1/3" />
          </div>
        </div>
        
        {/* Search filter skeleton */}
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl mx-auto -mt-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12 mt-8">
        <VenueGridLoadingSkeleton />
      </section>
    </main>
  )
} 