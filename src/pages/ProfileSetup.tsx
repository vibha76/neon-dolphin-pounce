"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { useFinance } from "@/context/FinanceContext"; // Import useFinance

const ProfileSetup: React.FC = () => {
  const { updateUserProfile, userProfile } = useFinance(); // Use useFinance hook
  const [name, setName] = useState(userProfile?.name || "");
  const [mobile, setMobile] = useState(userProfile?.mobile || "");
  const [initialBalance, setInitialBalance] = useState(userProfile?.balance.toString() || "");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !initialBalance) {
      showError("Please fill in all fields.");
      return;
    }
    const balanceNum = parseFloat(initialBalance);
    if (isNaN(balanceNum) || balanceNum < 0) {
      showError("Please enter a valid initial balance.");
      return;
    }

    updateUserProfile(name, mobile, balanceNum); // Update profile via context
    showSuccess("Profile setup successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-16rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Set Up Your Profile</CardTitle>
          <CardDescription>
            Provide your basic details to get started with FinAssist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="9876543210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="balance">Initial Balance (₹)</Label>
              <Input
                id="balance"
                type="number"
                placeholder="50000"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;