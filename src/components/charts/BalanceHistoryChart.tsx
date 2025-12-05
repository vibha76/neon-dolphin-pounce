"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const BalanceHistoryChart: React.FC = () => {
  const { getBalanceHistoryData } = useFinance();
  const data = getBalanceHistoryData(6); // Get data for the last 6 months

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance History</CardTitle>
        <CardDescription>Your account balance trend over the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 1 ? ( // Need at least two points to draw a line
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
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
                <Tooltip formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Balance']} />
                <Legend />
                <Line type="monotone" dataKey="balance" name="Balance" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-10">Not enough balance history to display a trend. Make some transactions!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default BalanceHistoryChart;