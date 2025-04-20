'use client';

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { getUserProfile, updateUserProfile } from "@/lib/firebase-utils";
import type { ProfileData } from "@/lib/firebase-utils";
import GoldenLoader from "@/app/components/golden-loader";

export default function BudgetPage() {
  const { user, loading } = useAuth();
  const [totalBudget, setTotalBudget] = useState(2500000);
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [totalBudgetInput, setTotalBudgetInput] = useState('');
  const [budgetItems, setBudgetItems] = useState<ProfileData['budgetItems']>([]);

  // Calculate total spent and remaining
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const remaining = totalBudget - totalSpent;
  const progressPercentage = (totalSpent / totalBudget) * 100;

  // Load budget data
  useEffect(() => {
    const loadBudgetData = async () => {
      if (!user) return;
      try {
        const data = await getUserProfile(user.uid);
        if (data) {
          setBudgetItems(data.budgetItems || []);
          setTotalBudget(data.budget || 2500000);
        }
      } catch (error) {
        console.error('Error loading budget data:', error);
      }
    };

    loadBudgetData();
  }, [user]);

  // Save budget data
  const saveBudgetData = async (newBudgetItems: ProfileData['budgetItems']) => {
    if (!user) return;
    try {
      await updateUserProfile(user.uid, {
        budgetItems: newBudgetItems,
        budget: totalBudget
      });
      setBudgetItems(newBudgetItems);
    } catch (error) {
      console.error('Error saving budget data:', error);
    }
  };

  // Format number with commas
  const formatNumber = (value: string) => {
    const number = value.replace(/[^0-9]/g, '');
    return number ? Number(number).toLocaleString() : '';
  };

  // Handle total budget change
  const handleUpdateTotalBudget = (value: string) => {
    const formattedValue = formatNumber(value);
    setTotalBudgetInput(formattedValue);
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    if (!isNaN(numericValue)) {
      setTotalBudget(numericValue);
      updateUserProfile(user?.uid || '', { budget: numericValue });
    }
  };

  // Handle new amount change
  const handleNewAmountChange = (value: string) => {
    const formattedValue = formatNumber(value);
    setNewAmount(formattedValue);
  };

  // Add new budget item
  const handleAddItem = async () => {
    if (!newCategory || !newAmount) return;
    
    const amount = parseInt(newAmount.replace(/,/g, ''));
    if (isNaN(amount)) return;

    const newItems = [...budgetItems, { category: newCategory, amount }];
    await saveBudgetData(newItems);
    setNewCategory('');
    setNewAmount('');
  };

  // Delete budget item
  const handleDeleteItem = async (index: number) => {
    const newItems = budgetItems.filter((_, i) => i !== index);
    await saveBudgetData(newItems);
  };

  if (loading || !user) {
    return <GoldenLoader size="lg" />;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-2xl mx-auto">
        {/* Budget Overview Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Budget Overview</span>
              <div className="relative w-40">
                <Input
                  type="text"
                  placeholder="Total Budget"
                  value={totalBudgetInput}
                  onChange={(e) => handleUpdateTotalBudget(e.target.value)}
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  DZ
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="10"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-primary stroke-current"
                    strokeWidth="10"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    strokeDasharray={`${progressPercentage * 2.51} 251.2`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{Math.round(progressPercentage)}%</span>
                  <span className="text-sm text-muted-foreground">Used</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="px-6 pb-6 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Spent</p>
              <p className="text-xl font-bold text-primary">{totalSpent.toLocaleString()} DZ</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-xl font-bold text-green-600">{remaining.toLocaleString()} DZ</p>
            </div>
          </div>
        </Card>

        {/* Add New Item Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add Budget Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1"
              />
              <div className="relative w-40">
                <Input
                  type="text"
                  placeholder="Amount"
                  value={newAmount}
                  onChange={(e) => handleNewAmountChange(e.target.value)}
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  DZ
                </span>
              </div>
              <Button onClick={handleAddItem}>
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Budget Items List */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="font-medium">{item.category}</span>
                  <div className="flex items-center gap-4">
                    <span>{item.amount.toLocaleString()} DZ</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteItem(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 