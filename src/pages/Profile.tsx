"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/utils/toast";
import { useFinance } from "@/context/FinanceContext";

const Profile: React.FC = () => {
  const { userProfile, updateUserProfile } = useFinance();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setMobile(userProfile.mobile);
      setBalance(userProfile.balance.toFixed(2));
    }
  }, [userProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !balance) {
      showError("Please fill in all fields.");
      return;
    }
    const balanceNum = parseFloat(balance);
    if (isNaN(balanceNum) || balanceNum < 0) {
      showError("Please enter a valid balance.");
      return;
    }

    updateUserProfile(name, mobile, balanceNum);
    showSuccess("Profile updated successfully!");
  };

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-16rem)]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Profile Not Set Up</CardTitle>
            <CardDescription>
              Please set up your profile first to view and edit your details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/profile-setup">Go to Profile Setup</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-16rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Your Profile</CardTitle>
          <CardDescription>
            View and update your personal and financial details.
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
              <Label htmlFor="balance">Current Balance (₹)</Label>
              <Input
                id="balance"
                type="number"
                placeholder="50000.00"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;