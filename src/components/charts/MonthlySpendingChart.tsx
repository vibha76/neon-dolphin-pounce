"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const MonthlySpendingChart: React.FC = () => {
  const { getMonthlyExpensesData } = useFinance(); // Changed to getMonthlyExpensesData
  const data = getMonthlyExpensesData(6); // Get data for the last 6 months

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending</CardTitle>
        <CardDescription>Your total spending over the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        {data.some(item => item.totalExpenses > 0) ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-sm" />
                <YAxis tickFormatter={(value) => `₹${value}`} className="text-sm" />
                <Tooltip formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Spending']} />
                <Legend />
                <Bar dataKey="totalExpenses" name="Total Spending" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-10">No spending data for the last 6 months. Make some withdrawals or transfers!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlySpendingChart;