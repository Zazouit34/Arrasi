'use client';

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Users, UserPlus, Mail} from "lucide-react";
import { getUserProfile, updateUserProfile } from "@/lib/firebase-utils";
import GoldenLoader from "@/app/components/golden-loader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Guest {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  plusOne: boolean;
  status: 'Invited' | 'Confirmed' | 'Declined' | 'Pending';
  dietary?: string;
  tableNumber?: string;
  notes?: string;
}

export default function GuestsPage() {
  const { user, loading } = useAuth();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newGuest, setNewGuest] = useState<Partial<Guest>>({
    name: '',
    phone: '',
    relationship: '',
    plusOne: false,
    status: 'Pending'
  });
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  // Calculate statistics
  const guestsArray = Array.isArray(guests) ? guests : [];
  const totalInvited = guestsArray.length;
  const confirmedGuests = guestsArray.filter(guest => guest.status === 'Confirmed').length;
  const declinedGuests = guestsArray.filter(guest => guest.status === 'Declined').length;
  const pendingGuests = guestsArray.filter(guest => guest.status === 'Pending').length;
  const totalExpected = confirmedGuests + guestsArray.filter(guest => guest.status === 'Confirmed' && guest.plusOne).length;

  // Load guests data
  useEffect(() => {
    const loadGuests = async () => {
      if (!user) return;
      try {
        const data = await getUserProfile(user.uid);
        if (data && data.guests) {
          setGuests(data.guests);
        }
      } catch (error) {
        console.error('Error loading guests:', error);
      }
    };

    loadGuests();
  }, [user]);

  // Save guests data
  const saveGuests = async (updatedGuests: Guest[]) => {
    if (!user) return;
    try {
      await updateUserProfile(user.uid, { guests: updatedGuests });
      setGuests(updatedGuests);
    } catch (error) {
      console.error('Error saving guests:', error);
    }
  };

  // Add new guest
  const handleAddGuest = async () => {
    if (!newGuest.name) return;

    const guestToAdd: Guest = {
      id: Date.now().toString(),
      name: newGuest.name,
      phone: newGuest.phone || '',
      relationship: newGuest.relationship || '',
      plusOne: newGuest.plusOne || false,
      status: 'Pending',
      ...(showOptionalFields && {
        dietary: newGuest.dietary,
        tableNumber: newGuest.tableNumber,
        notes: newGuest.notes
      })
    };

    const updatedGuests = [...guestsArray, guestToAdd];
    await saveGuests(updatedGuests);
    setNewGuest({
      name: '',
      phone: '',
      relationship: '',
      plusOne: false,
      status: 'Pending'
    });
    setShowOptionalFields(false);
  };

  // Update guest status
  const handleUpdateStatus = async (guestId: string, status: Guest['status']) => {
    const updatedGuests = guests.map(guest =>
      guest.id === guestId ? { ...guest, status } : guest
    );
    await saveGuests(updatedGuests);
  };

  // Delete guest
  const handleDeleteGuest = async (guestId: string) => {
    const updatedGuests = guests.filter(guest => guest.id !== guestId);
    await saveGuests(updatedGuests);
  };

  if (loading || !user) {
    return <GoldenLoader size="lg" />;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-4xl mx-auto">
        {/* Guest Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Invited</p>
                  <h3 className="text-2xl font-bold">{totalInvited}</h3>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
                  <h3 className="text-2xl font-bold">{confirmedGuests}</h3>
                </div>
                <UserPlus className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <h3 className="text-2xl font-bold">{pendingGuests}</h3>
                </div>
                <Mail className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Declined</p>
                  <h3 className="text-2xl font-bold">{declinedGuests}</h3>
                </div>
                <Users className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Expected</p>
                  <h3 className="text-2xl font-bold">{totalExpected}</h3>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add New Guest */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Guest</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                placeholder="Name"
                value={newGuest.name}
                onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
              />
              <Input
                placeholder="Phone"
                value={newGuest.phone}
                onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
              />
              <Input
                placeholder="Relationship (e.g., Family, Friend)"
                value={newGuest.relationship}
                onChange={(e) => setNewGuest({ ...newGuest, relationship: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newGuest.plusOne}
                  onChange={(e) => setNewGuest({ ...newGuest, plusOne: e.target.checked })}
                  className="rounded border-gray-300"
                />
                Allow +1
              </label>
              <Button
                variant="outline"
                onClick={() => setShowOptionalFields(!showOptionalFields)}
              >
                {showOptionalFields ? 'Hide' : 'Show'} Optional Fields
              </Button>
            </div>

            {showOptionalFields && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  placeholder="Dietary Preferences"
                  value={newGuest.dietary}
                  onChange={(e) => setNewGuest({ ...newGuest, dietary: e.target.value })}
                />
                <Input
                  placeholder="Table Number"
                  value={newGuest.tableNumber}
                  onChange={(e) => setNewGuest({ ...newGuest, tableNumber: e.target.value })}
                />
                <Input
                  placeholder="Notes"
                  className="md:col-span-2"
                  value={newGuest.notes}
                  onChange={(e) => setNewGuest({ ...newGuest, notes: e.target.value })}
                />
              </div>
            )}

            <Button onClick={handleAddGuest}>
              <Plus className="h-4 w-4 mr-2" />
              Add Guest
            </Button>
          </CardContent>
        </Card>

        {/* Guest List */}
        <Card>
          <CardHeader>
            <CardTitle>Guest List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {guestsArray.map((guest) => (
                <div key={guest.id} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{guest.name}</h4>
                      <p className="text-sm text-muted-foreground">{guest.relationship}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Select
                        value={guest.status}
                        onValueChange={(value: Guest['status']) => 
                          handleUpdateStatus(guest.id, value)
                        }
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Invited">Invited</SelectItem>
                          <SelectItem value="Confirmed">Confirmed</SelectItem>
                          <SelectItem value="Declined">Declined</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteGuest(guest.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="details">
                      <AccordionTrigger>Guest Details</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div>
                            <p className="text-sm font-medium">Phone</p>
                            <p className="text-sm text-muted-foreground">{guest.phone}</p>
                          </div>
                          {guest.dietary && (
                            <div>
                              <p className="text-sm font-medium">Dietary Preferences</p>
                              <p className="text-sm text-muted-foreground">{guest.dietary}</p>
                            </div>
                          )}
                          {guest.tableNumber && (
                            <div>
                              <p className="text-sm font-medium">Table Number</p>
                              <p className="text-sm text-muted-foreground">{guest.tableNumber}</p>
                            </div>
                          )}
                          {guest.notes && (
                            <div className="col-span-2">
                              <p className="text-sm font-medium">Notes</p>
                              <p className="text-sm text-muted-foreground">{guest.notes}</p>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 