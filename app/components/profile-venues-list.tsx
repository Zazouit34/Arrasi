'use client';

import { VenueCard } from '@/app/components/venue-card';
import type { VenueDetails } from '@/app/types/venues';
import { Building } from 'lucide-react';

interface ProfileVenuesListProps {
  venues: VenueDetails[];
}

export default function ProfileVenuesList({ venues }: ProfileVenuesListProps) {
  if (venues.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-playfair mb-6 flex items-center gap-2">
        <Building className="h-6 w-6 text-primary" />
        Saved Venues
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} isFavorite={true} />
        ))}
      </div>
    </div>
  );
} 