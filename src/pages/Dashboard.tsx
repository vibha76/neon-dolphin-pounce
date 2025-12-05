"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Your Dashboard!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is where your financial overview, spending patterns, and personalized guidance will appear.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            (Note: In this frontend-only demo, data is not persistent and features are simulated.)
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">₹ 0.00</p> {/* This will be dynamic later */}
          <p className="text-sm text-muted-foreground">Your available funds.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Deposit, Withdraw, Transfer (coming soon!)</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;