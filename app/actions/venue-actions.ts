'use server'

import { cache } from 'react'
import { algeriaCities } from "@/app/config/cities"


const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

interface GooglePlaceResult {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  user_ratings_total?: number
  photos?: Array<{
    photo_reference: string
    width: number
    height: number
  }>
  opening_hours?: {
    open_now: boolean
  }
}

// Cache the fetch venues function
export const fetchVenuesForCity = cache(async (city: string) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(city)}+wedding+venue&key=${GOOGLE_PLACES_API_KEY}&type=establishment`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    
    const data = await response.json()
    
    if (!data.results) {
      throw new Error('No results found')
    }

    return data.results.map((result: GooglePlaceResult) => ({
      id: result.place_id,
      name: result.name,
      location: result.formatted_address,
      imageUrl: result.photos?.[0] 
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${result.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
        : '/default.jpeg',
      rating: result.rating,
      reviewCount: result.user_ratings_total,
      highlights: ['Wedding Venue', result.opening_hours?.open_now ? 'Open Now' : ''],
      price: Math.floor(Math.random() * (3000000 - 1000000) + 1000000),
      capacity: Math.floor(Math.random() * (400 - 50) + 50)
    }))
  } catch (error) {
    console.error('Error fetching venues:', error)
    return []
  }
})

// Cache the venue details fetch
export const fetchVenueDetails = cache(async (venueId: string) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${venueId}&key=${GOOGLE_PLACES_API_KEY}&fields=photos,reviews&reviews_no_translations=true`,
      { next: { revalidate: 3600 } }
    )
    
    const data = await response.json()
    return data.result
  } catch (error) {
    console.error('Error fetching venue details:', error)
    return null
  }
})

// Function to get all venues with filtering
export async function getFilteredVenues(searchParams: {
  city?: string,
  guests?: string,
  budget?: string,
  page?: number
}) {
  // Use the city from searchParams if provided, otherwise use all cities
  const citiesToFetch = searchParams.city 
    ? [searchParams.city]
    : algeriaCities

  const venuesPromises = citiesToFetch.map(city => fetchVenuesForCity(city))
  const venuesArrays = await Promise.all(venuesPromises)
  let allVenues = venuesArrays.flat()

  // Apply filters
  if (searchParams.guests) {
    const guestCount = parseInt(searchParams.guests)
    allVenues = allVenues.filter(venue => venue.capacity >= guestCount)
  }

  if (searchParams.budget) {
    const budgetLimit = parseInt(searchParams.budget)
    allVenues = allVenues.filter(venue => venue.price <= budgetLimit)
  }

  // Pagination logic
  const itemsPerPage = 12
  const currentPage = searchParams.page || 1
  const totalItems = allVenues.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  const paginatedVenues = allVenues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return {
    venues: paginatedVenues,
    totalPages,
    currentPage
  }
} 