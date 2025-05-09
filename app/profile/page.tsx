'use client';

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense, lazy } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, ListTodo, Heart, Wallet } from "lucide-react";
import { DatePickerDemo } from "@/app/components/date-picker";
import { getUserProfile, updateUserProfile, getUserFavoritePlaceIds } from "@/lib/firebase-utils";
import { getFilteredVenues } from "@/app/actions/venue-actions";
import type { ProfileData } from "@/lib/firebase-utils";
import type { VenueDetails } from "@/app/types/venues";
import GoldenLoader from "@/app/components/golden-loader";

// Lazy load components that aren't immediately visible
const ProfileVenuesList = lazy(() => import('@/app/components/profile-venues-list'));
const ProfileBudgetSection = lazy(() => import('@/app/components/profile-budget-section'));
const ProfileTaskSection = lazy(() => import('@/app/components/profile-task-section'));

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData>({
    weddingDate: null,
    budget: 2500000,
    guests: [],
    tasks: [
      { id: '1', title: 'Book the caterer', dueDate: new Date('2024-06-15'), completed: false },
      { id: '2', title: 'Send invitations', dueDate: new Date('2024-07-01'), completed: false },
      { id: '3', title: 'Wedding dress fitting', dueDate: new Date('2024-07-15'), completed: false },
    ],
    budgetItems: [
      { category: 'Caterer', amount: 400000 },
      { category: 'Venue', amount: 1200000 },
      { category: 'Photography', amount: 150000 },
    ],
    venues: []
  });
  const [favoriteVenues, setFavoriteVenues] = useState<VenueDetails[]>([]);
  const [budgetItems, setBudgetItems] = useState<ProfileData['budgetItems']>([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [guestStats, setGuestStats] = useState({
    totalInvited: 0,
    confirmedGuests: 0,
    totalExpected: 0
  });

  // Calculate budget stats
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const remaining = totalBudget - totalSpent;
  const remainingPercentage = Math.round((remaining / totalBudget) * 100);

  // Calculate task statistics
  const pendingTasks = profileData.tasks.filter(task => !task.completed).length;
  const completedTasks = profileData.tasks.filter(task => task.completed).length;
  const totalTasks = profileData.tasks.length;
  const taskCompletionPercentage = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate days until wedding
  const calculateDaysLeft = () => {
    if (!profileData.weddingDate) return null;
    const weddingDate = new Date(profileData.weddingDate);
    const today = new Date();
    const diffTime = Math.abs(weddingDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Combined data loading function
  useEffect(() => {
    const loadAllData = async () => {
      if (!user) return;
      
      try {
        // Load all data in parallel
        const [profileData, favoriteIds, venues] = await Promise.all([
          getUserProfile(user.uid),
          getUserFavoritePlaceIds(user.uid),
          getFilteredVenues({})
        ]);
        
        if (profileData) {
          setProfileData(profileData);
          setBudgetItems(profileData.budgetItems || []);
          setTotalBudget(profileData.budget || 2500000);
          
          // Calculate guest statistics
          const guestsArray = Array.isArray(profileData.guests) ? profileData.guests : [];
          const confirmed = guestsArray.filter(guest => guest.status === 'Confirmed').length;
          const expectedWithPlusOnes = confirmed + 
            guestsArray.filter(guest => guest.status === 'Confirmed' && guest.plusOne).length;
          
          setGuestStats({
            totalInvited: guestsArray.length,
            confirmedGuests: confirmed,
            totalExpected: expectedWithPlusOnes
          });
        }
        
        // Filter favorite venues
        const userFavorites = venues.venues.filter(venue => 
          favoriteIds.includes(venue.id)
        );
        setFavoriteVenues(userFavorites);
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    loadAllData();
  }, [user]);

  // Save profile data
  const saveProfileData = async (newData: Partial<ProfileData>) => {
    if (!user) return;

    try {
      const updatedData = { ...profileData, ...newData };
      await updateUserProfile(user.uid, updatedData);
      setProfileData(updatedData);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <GoldenLoader size="lg" />;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      {/* Wedding Details Section */}
      <div className="mb-12 text-center">
        <div className="max-w-md mx-auto bg-card rounded-xl shadow p-6">
          <h3 className="text-lg font-medium mb-4">Wedding Date</h3>
          <div className="flex justify-center mb-4">
            <DatePickerDemo 
              date={profileData.weddingDate ? new Date(profileData.weddingDate) : undefined}
              onDateChange={(date) => saveProfileData({ weddingDate: date?.toISOString() })}
            />
          </div>
          {profileData.weddingDate && (
            <p className="mt-4 text-lg font-medium text-primary">
              {calculateDaysLeft()} days until your special day!
            </p>
          )}
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="bg-primary/5">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Remaining Budget</p>
              <h3 className="text-2xl font-bold">{remaining.toLocaleString()} DZ</h3>
              <span className="text-sm text-muted-foreground">{remainingPercentage}% remaining</span>
            </div>
            <Wallet className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Expected Guests</p>
              <h3 className="text-2xl font-bold">{guestStats.totalExpected}</h3>
              <span className="text-sm text-muted-foreground">
                {guestStats.confirmedGuests} confirmed of {guestStats.totalInvited} invited
              </span>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
              <h3 className="text-2xl font-bold">{pendingTasks}</h3>
              <span className="text-sm text-muted-foreground">{taskCompletionPercentage}% completed</span>
            </div>
            <ListTodo className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Saved Venues</p>
              <h3 className="text-2xl font-bold">{favoriteVenues.length}</h3>
              <span className="text-sm text-muted-foreground">Saved for consideration</span>
            </div>
            <Heart className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
      </div>

      {/* Secondary Content - Lazy Loaded */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Suspense fallback={<div className="col-span-2"><GoldenLoader /></div>}>
          {/* Budget Information */}
          <div className="lg:col-span-2">
            <ProfileBudgetSection 
              budgetItems={budgetItems}
              totalBudget={totalBudget}
            />
          </div>
        </Suspense>

        <Suspense fallback={<div><GoldenLoader /></div>}>
          {/* Countdown Card */}
          <div>
            <ProfileTaskSection 
              tasks={profileData.tasks}
              pendingTasks={pendingTasks}
            />
          </div>
        </Suspense>
      </div>

      {/* Favorite Venues */}
      <Suspense fallback={<GoldenLoader />}>
        <ProfileVenuesList venues={favoriteVenues} />
      </Suspense>
    </div>
  );
} 