'use client';

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ListTodo, Heart, Clock, Wallet, Building } from "lucide-react";
import { DatePickerDemo } from "@/app/components/date-picker";
import { getUserProfile, updateUserProfile, getUserFavoritePlaceIds } from "@/lib/firebase-utils";
import { getFilteredVenues } from "@/app/actions/venue-actions";
import type { ProfileData } from "@/lib/firebase-utils";
import type { VenueDetails } from "@/app/types/venues";
import GoldenLoader from "@/app/components/golden-loader";

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

  // Load favorite venues
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      try {
        const favoriteIds = await getUserFavoritePlaceIds(user.uid);
        const { venues: allVenues } = await getFilteredVenues({});
        const userFavorites = allVenues.filter(venue => 
          favoriteIds.includes(venue.id)
        );
        setFavoriteVenues(userFavorites);
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, [user]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        const data = await getUserProfile(user.uid);
        if (data) {
          setProfileData(data);
          setBudgetItems(data.budgetItems || []);
          setTotalBudget(data.budget || 2500000);
          
          // Calculate guest statistics
          const guestsArray = Array.isArray(data.guests) ? data.guests : [];
          const confirmed = guestsArray.filter(guest => guest.status === 'Confirmed').length;
          const expectedWithPlusOnes = confirmed + 
            guestsArray.filter(guest => guest.status === 'Confirmed' && guest.plusOne).length;
          
          setGuestStats({
            totalInvited: guestsArray.length,
            confirmedGuests: confirmed,
            totalExpected: expectedWithPlusOnes
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfileData();
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
            </div>
            <Heart className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
      </div>

      {/* Activity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profileData.tasks
                .filter(task => !task.completed)
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .slice(0, 3)
                .map(task => (
                  <div key={task.id} className="flex items-start gap-2">
                    <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Budget Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Budget Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetItems.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-muted-foreground">
                    {item.amount.toLocaleString()} DZ
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Venues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Recently Saved Venues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {favoriteVenues.slice(0, 3).map(venue => (
                <div key={venue.id} className="flex items-center justify-between">
                  <span className="font-medium">{venue.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString('en-GB')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 