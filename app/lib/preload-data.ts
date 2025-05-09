import { preloadAllVenues } from '@/app/actions/venue-actions';

export async function preloadAppData() {
  try {
    // Preload all venue data at app startup
    await preloadAllVenues();
  } catch (error) {
    console.error('Error preloading app data:', error);
  }
}

// Try to preload data in the background
preloadAppData().catch(console.error); 