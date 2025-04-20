import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Check, MapPin, Users } from "lucide-react"
import { fetchVenuesForCity, fetchVenueDetails } from "@/app/actions/venue-actions"
import { algeriaCities } from "@/app/config/cities"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Venue {
  id: string
  name: string
  location: string
  price: number
  capacity: number
  imageUrl: string
  rating?: number
  reviewCount?: number
  highlights: string[]
}

// Add this interface for reviews
interface Review {
  author_name: string
  rating: number
  relative_time_description: string
  text: string
  profile_photo_url: string
}

interface Photo {
  photo_reference: string
}

export default async function VenuePage({ params }: { params: { id: string } }) {
  // Parallel data fetching
  const [venueData, venueDetails] = await Promise.all([
    // Search through all cities in parallel
    Promise.all(algeriaCities.map(city => 
      fetchVenuesForCity(city)
    )).then((citiesResults: Venue[][]) => 
      citiesResults.flat().find(venue => venue.id === params.id)
    ),
    fetchVenueDetails(params.id)
  ])

  if (!venueData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-playfair mb-4">Venue Not Found</h1>
          <p className="text-muted-foreground">The venue you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </main>
    )
  }

  const reviews = venueDetails?.reviews || []
  const imageUrls = venueDetails?.photos?.map((photo: Photo) => 
    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${photo.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
  ) || [venueData.imageUrl]

  return (
    <main className="min-h-screen">
      {/* Gallery Section */}
      <section className="grid grid-cols-12 gap-4 p-4">
        <div className="col-span-8 space-y-4">
          {/* Main large image */}
          <div className="relative h-[600px]">
            <Image
              src={imageUrls[0]}
              alt={venueData.name}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
          {/* Grid of additional images */}
          <div className="grid grid-cols-3 gap-4">
            {imageUrls.slice(1).map((imageUrl: string, index: number) => (
              <div key={index} className="relative h-[200px]">
                <Image
                  src={imageUrl}
                  alt={`${venueData.name} ${index + 2}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Booking Sidebar */}
        <aside className="col-span-4 space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="font-playfair text-3xl">
                {venueData.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {venueData.location}
              </CardDescription>
              <p className="text-2xl font-playfair">
                From {venueData.price.toLocaleString()} DZD
              </p>
              {venueData.rating && (
                <p className="text-sm text-muted-foreground">
                  ⭐ {venueData.rating.toFixed(1)} ({venueData.reviewCount} reviews)
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Contact Venue
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-playfair">Contact Information</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <h4 className="font-medium mb-2">Email</h4>
                      <p className="text-sm text-muted-foreground">venue@example.com</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Phone</h4>
                      <p className="text-sm text-muted-foreground">+213 XX XX XX XX</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Business Hours</h4>
                      <p className="text-sm text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </aside>
      </section>

      {/* Details Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="description">
                <AccordionTrigger className="text-xl font-playfair">
                  About the Venue
                </AccordionTrigger>
                <AccordionContent className="prose">
                  <p>Contact venue for detailed information about this wedding venue.</p>
                  <div className="flex items-center gap-2 mt-4">
                    <Users className="h-5 w-5" />
                    <span>Capacity: up to {venueData.capacity} guests</span>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="highlights">
                <AccordionTrigger className="text-xl font-playfair">
                  Highlights
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="grid grid-cols-2 gap-4">
                    {venueData.highlights.filter(Boolean).map((highlight: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* New Reviews Accordion Item */}
              <AccordionItem value="reviews">
                <AccordionTrigger className="text-xl font-playfair">
                  Reviews {venueData.rating && `(⭐ ${venueData.rating.toFixed(1)})`}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {reviews.length > 0 ? (
                      reviews.map((review: Review, index: number) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                              <Image
                                src={review.profile_photo_url}
                                alt={review.author_name}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{review.author_name}</h4>
                                  <span className="text-sm text-muted-foreground">
                                    {review.relative_time_description}
                                  </span>
                                </div>
                                <div className="mt-1">
                                  {"⭐".repeat(review.rating)}
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                  {review.text}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No reviews available yet.</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Right Sidebar - Keep only the venue details card */}
          <div className="col-span-4">
            <h3 className="font-playfair text-2xl mb-6">Details & Reviews</h3>
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {venueData.rating && (
                      <div className="flex items-center justify-between">
                        <span>Rating</span>
                        <span>⭐ {venueData.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>Reviews</span>
                      <span>{venueData.reviewCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Capacity</span>
                      <span>Up to {venueData.capacity} guests</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}