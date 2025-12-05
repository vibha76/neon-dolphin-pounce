"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Confirmed CardDescription import
import { useFinance } from "@/context/FinanceContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Separator } from "@/components/ui/separator";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6666', '#66CCFF', '#FFD700', '#ADFF2F', '#FF69B4'];

const Dashboard: React.FC = () => {
  const { balance, userProfile, getSpendingCategories } = useFinance();
  const spendingCategories = getSpendingCategories();

  const pieChartData = Object.entries(spendingCategories).map(([name, value]) => ({
    name,
    value,
  }));

  const totalSpending = pieChartData.reduce((sum, item) => sum + item.value, 0);

  // Agentic AI-like guidance (simulated)
  const getSpendingGuidance = () => {
    if (totalSpending === 0) {
      return "Start tracking your expenses to get personalized spending insights!";
    }

    const sortedCategories = Object.entries(spendingCategories).sort(([, a], [, b]) => b - a);
    const topCategory = sortedCategories[0];

    let guidance = "";
    if (topCategory) {
      guidance += `Your highest spending category is **${topCategory[0]}** (₹${topCategory[1].toFixed(2)}). `;
    }

    if (balance < 10000) {
      guidance += "Consider reviewing your expenses to build a stronger savings foundation. Focus on essential spending.";
    } else if (balance >= 10000 && balance < 50000) {
      guidance += "You have a healthy balance. Look for opportunities to save more or explore low-risk investments.";
    } else {
      guidance += "Excellent balance! You're in a great position to explore diverse investment options and plan for long-term goals.";
    }

    return guidance;
  };

  const getInvestmentGuidance = () => {
    if (balance < 5000) {
      return "Focus on building an emergency fund first. Small, consistent savings are key.";
    } else if (balance < 20000) {
      return "Consider low-risk options like Fixed Deposits (FDs) or Recurring Deposits (RDs) in Indian banks. They offer stable returns with minimal risk.";
    } else if (balance < 100000) {
      return "Explore diversified Mutual Funds (Equity, Debt, Hybrid) via SIPs (Systematic Investment Plans) for long-term growth. Look into Nifty 50 index funds for market exposure.";
    } else {
      return "With a substantial balance, you can consider direct equity investments in blue-chip Indian companies, real estate, or even explore alternative investments. Always consult a financial advisor for personalized strategies.";
    }
  };

  const getLoanGuidance = () => {
    const netSalary = userProfile?.balance || 0; // Using current balance as a proxy for net salary for demo
    if (netSalary === 0) {
      return "Please set up your profile with an initial balance to get personalized loan guidance.";
    }

    const maxEmiRatio = 0.4; // Max 40% of net salary for EMI
    const recommendedMaxEmi = netSalary * maxEmiRatio;

    let guidance = `Based on a simulated net salary of ₹${netSalary.toFixed(2)}, your recommended maximum EMI should not exceed **₹${recommendedMaxEmi.toFixed(2)}** per month. `;

    if (netSalary < 30000) {
      guidance += "For lower salaries, prioritize essential loans like home loans (if eligible) with longer terms to keep EMIs low. Avoid unnecessary personal loans.";
    } else if (netSalary < 80000) {
      guidance += "You can comfortably manage moderate loans. Consider home loans, car loans, or personal loans for essential needs. Aim for shorter terms if EMIs are manageable to reduce total interest.";
    } else {
      guidance += "With a higher salary, you have more flexibility. You can opt for larger loans or shorter terms. Explore business loans if you have entrepreneurial aspirations, ensuring a solid business plan.";
    }
    guidance += " Always compare interest rates and processing fees across different lenders.";
    return guidance;
  };


  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Welcome, {userProfile?.name || "User"}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">Your current balance: <span className="font-bold text-primary">₹{balance.toFixed(2)}</span></p>
          <p className="mt-2 text-sm text-muted-foreground">
            (Note: In this frontend-only demo, data is stored locally and features are simulated.)
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Spending Patterns</CardTitle>
          <CardDescription>Where your money goes.</CardDescription>
        </CardHeader>
        <CardContent>
          {pieChartData.length > 0 && totalSpending > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${(value as number).toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-muted-foreground">No spending data to display yet. Make some withdrawals or transfers!</p>
          )}
          <Separator className="my-4" />
          <h3 className="font-semibold text-md mb-2">Spending Insights:</h3>
          <p className="text-sm text-muted-foreground">{getSpendingGuidance()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Investment Guidance</CardTitle>
          <CardDescription>Smart ways to grow your money.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{getInvestmentGuidance()}</p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Loan Guidelines</CardTitle>
          <CardDescription>Understand how much loan to take and for what term.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{getLoanGuidance()}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;