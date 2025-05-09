import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function VenueLoading() {
  return (
    <main className="min-h-screen">
      {/* Gallery Section */}
      <section className="grid grid-cols-12 gap-4 p-4">
        <div className="col-span-8 space-y-4">
          {/* Main large image skeleton */}
          <div className="relative h-[600px]">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
          {/* Grid of additional images skeletons */}
          <div className="grid grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Sidebar skeleton */}
        <aside className="col-span-4 space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-6 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </aside>
      </section>

      {/* Details Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8">
            <div className="space-y-8">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-4">
            <Skeleton className="h-8 w-1/2 mb-6" />
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
} 