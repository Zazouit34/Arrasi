'use server'

// Use environment variable instead
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

interface GooglePlaceResult {
  place_id: string
  name: string
  formatted_address: string
  rating: number
  user_ratings_total: number
  photos: Array<{
    photo_reference: string
    width: number
    height: number
  }>
  opening_hours?: {
    open_now: boolean
  }
}

export async function fetchVenues(city: string) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(city)}+wedding+venue&key=${GOOGLE_PLACES_API_KEY}&type=establishment`
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
      // Example default values for missing API data
      price: Math.floor(Math.random() * (3000000 - 1000000) + 1000000),
      capacity: Math.floor(Math.random() * (400 - 50) + 50)
    }))
  } catch (error) {
    console.error('Error fetching venues:', error)
    return []
  }
} 