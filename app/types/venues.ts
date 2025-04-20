export interface Place {
  id: string
  name: string
  formatted_address: string
  rating?: number
  user_ratings_total?: number
  photos?: {
    photo_reference: string
    width: number
    height: number
  }[]
  opening_hours?: {
    open_now: boolean
  }
}

export interface VenueDetails extends Place {
  location: string
  price: number
  capacity: number
  imageUrl: string
  reviewCount?: number
  highlights: string[]
}