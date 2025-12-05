"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFinance } from '@/context/FinanceContext';

const SpendingAnalysisCard: React.FC = () => {
  const { getSpendingCategories } = useFinance();
  const spendingCategories = getSpendingCategories();

  const totalSpending = Object.values(spendingCategories).reduce((sum, value) => sum + value, 0);

  const sortedCategories = Object.entries(spendingCategories)
    .sort(([, a], [, b]) => b - a);

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Spending Analysis</CardTitle>
        <CardDescription>Where your money goes.</CardDescription>
      </CardHeader>
      <CardContent>
        {totalSpending > 0 ? (
          <div className="space-y-4">
            <div>
              <p className="text-lg text-muted-foreground">Total Spending</p>
              <p className="text-3xl font-bold text-destructive">₹{totalSpending.toFixed(2)}</p>
            </div>
            <div className="space-y-3">
              {sortedCategories.map(([category, amount]) => {
                const percentage = (amount / totalSpending) * 100;
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{category}</span>
                      <span>₹{amount.toFixed(2)}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-10">No spending data to display yet. Make some withdrawals or transfers!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingAnalysisCard;