import { db } from './firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  Timestamp 
} from 'firebase/firestore';

// Updated to use Google Place IDs
export const toggleFavoriteVenue = async (userId: string, placeId: string): Promise<void> => {
  const userFavoritesRef = doc(db, 'favorites', userId);
  
  try {
    const docSnap = await getDoc(userFavoritesRef);
    
    if (docSnap.exists()) {
      const favorites = docSnap.data().placeIds || [];
      const isAlreadyFavorite = favorites.includes(placeId);
      
      await updateDoc(userFavoritesRef, {
        placeIds: isAlreadyFavorite ? arrayRemove(placeId) : arrayUnion(placeId)
      });
    } else {
      await setDoc(userFavoritesRef, {
        placeIds: [placeId]
      });
    }
  } catch (error) {
    console.error('Error updating favorites:', error);
    throw error;
  }
};

export const getUserFavoritePlaceIds = async (userId: string): Promise<string[]> => {
  try {
    const userFavoritesRef = doc(db, 'favorites', userId);
    const docSnap = await getDoc(userFavoritesRef);
    
    if (!docSnap.exists()) return [];
    
    return docSnap.data().placeIds || [];
  } catch (error) {
    console.error('Error getting favorite place IDs:', error);
    throw error;
  }
};

// Export the ProfileData interface
export interface ProfileData {
  weddingDate: string | null;
  budget: number;
  guests: Array<{
    id: string;
    name: string;
    phone: string;
    relationship: string;
    plusOne: boolean;
    status: 'Invited' | 'Confirmed' | 'Declined' | 'Pending';
    dietary?: string;
    tableNumber?: string;
    notes?: string;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    dueDate: Date;
    completed: boolean;
  }>;
  venues: Array<{
    id: string;
    name: string;
    dateAdded: Date;
  }>;
  budgetItems: Array<{
    category: string;
    amount: number;
  }>;
}

interface FirestoreTask {
  id: string;
  title: string;
  dueDate: Timestamp;
  completed: boolean;
}

interface FirestoreVenue {
  id: string;
  name: string;
  dateAdded: Timestamp;
}

export const getUserProfile = async (userId: string): Promise<ProfileData | null> => {
  try {
    const profileRef = doc(db, 'profiles', userId);
    const docSnap = await getDoc(profileRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Convert Timestamp objects back to Dates
      const tasks = data.tasks?.map((task: FirestoreTask) => ({
        ...task,
        dueDate: task.dueDate instanceof Timestamp ? task.dueDate.toDate() : task.dueDate
      })) || [];
      
      const venues = data.venues?.map((venue: FirestoreVenue) => ({
        ...venue,
        dateAdded: venue.dateAdded instanceof Timestamp ? venue.dateAdded.toDate() : venue.dateAdded
      })) || [];

      return {
        ...data,
        tasks,
        venues
      } as ProfileData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, profileData: Partial<ProfileData>): Promise<void> => {
  try {
    const profileRef = doc(db, 'profiles', userId);
    await setDoc(profileRef, profileData, { merge: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}; 