'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from 'lucide-react';

interface BudgetItem {
  category: string;
  amount: number;
}

interface ProfileBudgetSectionProps {
  budgetItems: BudgetItem[];
  totalBudget: number;
}

export default function ProfileBudgetSection({ budgetItems, totalBudget }: ProfileBudgetSectionProps) {
  // Calculate total spent
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const remaining = totalBudget - totalSpent;
  
  // Calculate category percentages
  const categoryData = budgetItems.map(item => ({
    ...item,
    percentage: Math.round((item.amount / totalBudget) * 100)
  }));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Budget Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Budget Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <h3 className="text-sm font-medium text-muted-foreground">Total Budget</h3>
              <p className="text-xl font-bold">{totalBudget.toLocaleString()} DZ</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <h3 className="text-sm font-medium text-muted-foreground">Remaining</h3>
              <p className="text-xl font-bold">{remaining.toLocaleString()} DZ</p>
            </div>
          </div>
          
          {/* Category Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Expense Categories</h3>
            {categoryData.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.amount.toLocaleString()} DZ ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 