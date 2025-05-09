import { HeroSection } from "@/app/components/hero-section"
import { SearchFilter } from "@/app/components/search-filter"
import { VenueCard } from "@/app/components/venue-card"
import { getFilteredVenues } from "@/app/actions/venue-actions"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination"
import { Suspense } from "react"
import { VenueGridLoadingSkeleton } from "./components/venue-loading-skeleton"

interface SearchParams {
  city?: string
  guests?: string
  budget?: string
}

// Enable ISR for the homepage too
export const revalidate = 3600 // Revalidate every hour

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams & { page?: string }
}) {
  // Await the searchParams
  searchParams = await searchParams
  
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1
  const { venues, totalPages } = await getFilteredVenues({ ...searchParams, page: currentPage })

  // Function to generate pagination items
  const generatePaginationItems = () => {
    const items = []
    
    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink href={`/?page=1`} isActive={currentPage === 1}>
          1
        </PaginationLink>
      </PaginationItem>
    )

    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink href={`/?page=${i}`} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

    // Always show last page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href={`/?page=${totalPages}`} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

  return (
    <main className="min-h-screen">
      <div className="relative">
        <HeroSection />
        <SearchFilter />
      </div>
      <section className="container mx-auto px-4 py-12 mt-8">
        <Suspense fallback={<VenueGridLoadingSkeleton />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious href={`/?page=${currentPage - 1}`} />
                  </PaginationItem>
                )}
                
                {generatePaginationItems()}

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext href={`/?page=${currentPage + 1}`} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </Suspense>
      </section>
    </main>
  )
}