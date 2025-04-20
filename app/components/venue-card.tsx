"use client"

import { useAuth } from "@/lib/auth-context";
import { toggleFavoriteVenue, getUserFavoritePlaceIds } from "@/lib/firebase-utils";
import { useState, useEffect } from "react";
import Link from "next/link"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
  import { Button } from "@/components/ui/button"
  import { Heart } from "lucide-react"
  import Image from "next/image"
  import { toast } from "sonner";
  
  interface VenueCardProps {
    venue: {
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
    isFavorite?: boolean
    onFavoriteToggle?: () => void
  }
  
  export function VenueCard({ venue, isFavorite = false, onFavoriteToggle }: VenueCardProps) {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(isFavorite);
  
    useEffect(() => {
      const checkFavoriteStatus = async () => {
        if (!user) return;
        
        try {
          const favoriteIds = await getUserFavoritePlaceIds(user.uid);
          setIsLiked(favoriteIds.includes(venue.id));
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      };
  
      checkFavoriteStatus();
    }, [user, venue.id]);
  
    const handleFavoriteClick = async (e: React.MouseEvent) => {
      e.preventDefault();
      if (!user) {
        toast.error("Please login to save favorites");
        return;
      }
  
      try {
        await toggleFavoriteVenue(user.uid, venue.id);
        setIsLiked(!isLiked);
        onFavoriteToggle?.();
        
        if (!isLiked) {
          toast.success(`${venue.name} added to favorites`);
        } else {
          toast.success(`${venue.name} removed from favorites`);
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
        toast.error("Something went wrong. Please try again.");
      }
    };
  
    return (
      <Link href={`/venues/${venue.id}`} className="block transition-transform hover:scale-[1.02]">
        <Card className="overflow-hidden h-full relative">
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white/90 rounded-full"
              onClick={handleFavoriteClick}
            >
              <Heart 
                className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
              />
            </Button>
          )}
          <div className="relative h-48">
            <Image
              src={venue.imageUrl}
              alt={venue.name}
              fill
              className="object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle className="font-playfair">{venue.name}</CardTitle>
            <CardDescription>{venue.location}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg font-playfair">
                From {venue.price.toLocaleString()} DZD
              </p>
              <p className="text-sm text-muted-foreground">
                Up to {venue.capacity} guests
              </p>
              {venue.rating && (
                <p className="text-sm text-muted-foreground">
                  ⭐ {venue.rating.toFixed(1)} ({venue.reviewCount} reviews)
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {venue.highlights.filter(Boolean).map((highlight, index) => (
                  <HoverCard key={index}>
                    <HoverCardTrigger asChild>
                      <span className="inline-block px-2 py-1 text-xs bg-secondary rounded-md cursor-help">
                        {highlight}
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="text-sm">
                      {highlight}
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }