'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getUserFavoritePlaceIds } from '@/lib/firebase-utils';
import {VenueCard} from '@/app/components/venue-card';
import { useRouter } from 'next/navigation';
import { getFilteredVenues } from '@/app/actions/venue-actions';
import type { VenueDetails } from "@/app/types/venues";
import GoldenLoader from "@/app/components/golden-loader";

// You'll need to import or define this type based on your Google Places API implementation

export default function FavoritesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<VenueDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login'); // Redirect to login if not authenticated
      return;
    }

    const loadFavorites = async () => {
      if (!user) return;

      try {
        const favoriteIds = await getUserFavoritePlaceIds(user.uid);
        const { venues: allVenues } = await getFilteredVenues({});
        const favoriteVenues = allVenues.filter((venue) => 
          favoriteIds.includes(venue.id)
        );
        setFavorites(favoriteVenues);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadFavorites();
    }
  }, [user, loading, router]);

  if (loading || isLoading) {
    return <GoldenLoader size="lg" />;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-6">My Favorite Venues</h1>
      {favorites.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">You haven&apos;t added any venues to your favorites yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              isFavorite={true}
              onFavoriteToggle={() => {
                setFavorites(favorites.filter(v => v.id !== venue.id));
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
} 

