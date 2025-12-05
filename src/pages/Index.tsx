"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, PiggyBank, Handshake, BarChart2 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-5xl font-extrabold mb-6 text-primary">Welcome to FinAssist</h1>
      <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
        Your personal financial guide for smart spending, informed investments, and confident loan decisions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
        <Card className="flex flex-col items-center text-center p-6">
          <User className="h-12 w-12 text-accent-foreground mb-4" />
          <CardTitle className="mb-2">Set Up Profile</CardTitle>
          <CardDescription className="mb-4">Start by setting up your personal financial profile.</CardDescription>
          <Button asChild>
            <Link to="/profile-setup">Get Started</Link>
          </Button>
        </Card>

        <Card className="flex flex-col items-center text-center p-6">
          <PiggyBank className="h-12 w-12 text-accent-foreground mb-4" />
          <CardTitle className="mb-2">Manage Transactions</CardTitle>
          <CardDescription className="mb-4">Deposit, withdraw, and transfer funds easily.</CardDescription>
          <Button asChild>
            <Link to="/transactions">Go to Transactions</Link>
          </Button>
        </Card>

        <Card className="flex flex-col items-center text-center p-6">
          <Handshake className="h-12 w-12 text-accent-foreground mb-4" />
          <CardTitle className="mb-2">Loan Assessment</CardTitle>
          <CardDescription className="mb-4">Assess loan eligibility and detect potential fraud.</CardDescription>
          <Button asChild>
            <Link to="/loan-assessment">Assess Loan</Link>
          </Button>
        </Card>

        <Card className="flex flex-col items-center text-center p-6">
          <BarChart2 className="h-12 w-12 text-accent-foreground mb-4" />
          <CardTitle className="mb-2">Financial Insights</CardTitle>
          <CardDescription className="mb-4">Get insights into spending and investment guidance.</CardDescription>
          <Button asChild>
            <Link to="/dashboard">View Dashboard</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Index;