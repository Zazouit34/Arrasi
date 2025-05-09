'use server'

import { cache } from 'react'
import { algeriaCities } from "@/app/config/cities"

// Create a server-side cache object that persists between requests
const VENUES_CACHE = new Map();
const VENUE_DETAILS_CACHE = new Map();

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

// Preload function to prefetch all venues during build/startup
export async function preloadAllVenues() {
  if (VENUES_CACHE.size > 0) return; // Only load once
  
  console.log('Preloading all venues data...');
  const citiesPromises = algeriaCities.map(city => fetchVenuesForCity(city));
  await Promise.all(citiesPromises);
  console.log('Venues preloaded successfully');
}

// Cache the fetch venues function
export const fetchVenuesForCity = cache(async (city: string) => {
  // Check if we have the data in our in-memory cache
  if (VENUES_CACHE.has(city)) {
    return VENUES_CACHE.get(city);
  }
  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(city)}+wedding+venue&key=${GOOGLE_PLACES_API_KEY}&type=establishment`,
      { next: { revalidate: 86400 } } // Cache for 24 hours (extended from 1 hour)
    )
    
    const data = await response.json()
    
    if (!data.results) {
      throw new Error('No results found')
    }

    const venues = data.results.map((result: GooglePlaceResult) => ({
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
    
    // Store in our in-memory cache
    VENUES_CACHE.set(city, venues);
    
    return venues;
  } catch (error) {
    console.error('Error fetching venues:', error)
    return []
  }
})

// New function to directly fetch a venue by ID (much more efficient)
export const fetchVenueById = cache(async (venueId: string) => {
  // Check if we have the data in our in-memory cache
  if (VENUE_DETAILS_CACHE.has(venueId)) {
    return VENUE_DETAILS_CACHE.get(venueId);
  }
  
  // Check if the venue exists in any of our city venue caches
  for (const venues of VENUES_CACHE.values()) {
    const venue = venues.find((v: { id: string }) => v.id === venueId);
    if (venue) {
      VENUE_DETAILS_CACHE.set(venueId, venue);
      return venue;
    }
  }
  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${venueId}&key=${GOOGLE_PLACES_API_KEY}&fields=name,formatted_address,rating,user_ratings_total,photos,opening_hours`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    )
    
    const data = await response.json()
    if (!data.result) {
      throw new Error('Venue not found')
    }
    
    const result = data.result
    const venue = {
      id: venueId,
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
    }
    
    // Store in our in-memory cache
    VENUE_DETAILS_CACHE.set(venueId, venue);
    
    return venue;
  } catch (error) {
    console.error('Error fetching venue by ID:', error)
    return null
  }
})

// Cache the venue details fetch
export const fetchVenueDetails = cache(async (venueId: string) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${venueId}&key=${GOOGLE_PLACES_API_KEY}&fields=photos,reviews&reviews_no_translations=true`,
      { next: { revalidate: 86400 } } // Cache for 24 hours (extended from 1 hour)
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
  // Ensure venues are preloaded
  await preloadAllVenues();
  
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