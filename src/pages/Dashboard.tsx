"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Separator } from "@/components/ui/separator";
import MonthlySpendingChart from "@/components/charts/MonthlySpendingChart";
import BalanceHistoryChart from "@/components/charts/BalanceHistoryChart";
import SpendingAnalysisCard from "@/components/dashboard/SpendingAnalysisCard"; // New import
import InfoCard from "@/components/dashboard/InfoCard"; // New import
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDown, ArrowUp, Repeat, Info, CheckCircle } from "lucide-react"; // Added Info and CheckCircle icons
import { format, parseISO } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#66CCFF', '#FFD700', '#ADFF2F', '#FF69B4', '#8884d8']; // Adjusted COLORS

const Dashboard: React.FC = () => {
  const { balance, userProfile, getSpendingCategories, getMonthlySpendingData, getBalanceHistoryData, getRecentTransactions, getSavingsRate } = useFinance();
  const spendingCategories = getSpendingCategories();
  const monthlySpendingData = getMonthlySpendingData(6);
  const balanceHistoryData = getBalanceHistoryData(6);
  const recentTransactions = getRecentTransactions(5); // Get top 5 recent transactions
  const savingsRate = getSavingsRate(3); // Calculate savings rate over last 3 months

  const pieChartData = Object.entries(spendingCategories).map(([name, value]) => ({
    name,
    value,
  }));

  const totalSpending = pieChartData.reduce((sum, item) => sum + item.value, 0);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      case "withdraw":
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      case "transfer_out":
        return <Repeat className="h-4 w-4 text-orange-500" />;
      case "transfer_in":
        return <Repeat className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

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

    const currentMonthSpending = monthlySpendingData[monthlySpendingData.length - 1]?.totalSpending || 0;
    const previousMonthSpending = monthlySpendingData[monthlySpendingData.length - 2]?.totalSpending || 0;

    if (currentMonthSpending > previousMonthSpending && previousMonthSpending > 0) {
      guidance += `Your spending increased this month compared to last. Review your recent transactions. `;
    } else if (currentMonthSpending < previousMonthSpending && previousMonthSpending > 0) {
      guidance += `Great job! Your spending decreased this month. Keep up the good work! `;
    }

    if (savingsRate > 10) {
      guidance += `With a healthy savings rate of **${savingsRate}%**, you're doing great at saving!`;
    } else if (savingsRate >= 0 && savingsRate <= 10) {
      guidance += `Your savings rate is **${savingsRate}%**. Consider ways to increase it for better financial security.`;
    } else {
      guidance += `Your spending currently exceeds your deposits, resulting in a savings rate of **${savingsRate}%**. It's crucial to review your budget and cut down on non-essential expenses.`;
    }

    return guidance;
  };

  const getInvestmentGuidance = () => {
    const balanceTrend = balanceHistoryData.length > 1 ? balanceHistoryData[balanceHistoryData.length - 1].balance - balanceHistoryData[0].balance : 0;

    let guidance = "";
    if (balanceTrend > 0) {
      guidance += "Your balance has been growing, indicating a good financial position for investments. ";
    } else if (balanceTrend < 0) {
      guidance += "Your balance has been declining. It might be wise to stabilize your finances before making new investments. ";
    }

    if (savingsRate < 10) {
      guidance += "With your current savings rate, focus on building an emergency fund first. Small, consistent savings are key before aggressive investments.";
    } else if (balance < 20000) {
      guidance += "Consider low-risk options like Fixed Deposits (FDs) or Recurring Deposits (RDs) in Indian banks. They offer stable returns with minimal risk.";
    } else if (balance < 100000) {
      guidance += "Explore diversified Mutual Funds (Equity, Debt, Hybrid) via SIPs (Systematic Investment Plans) for long-term growth. Look into Nifty 50 index funds for market exposure.";
    } else {
      guidance += "With a substantial balance and good savings rate, you can consider direct equity investments in blue-chip Indian companies, real estate, or even explore alternative investments. Always consult a financial advisor for personalized strategies.";
    }
    return guidance;
  };

  const getLoanGuidance = () => {
    const netSalary = userProfile?.balance || 0; // Using current balance as a proxy for net salary for demo
    if (netSalary === 0) {
      return "Please set up your profile with an initial balance to get personalized loan guidance.";
    }

    const maxEmiRatio = 0.4; // Max 40% of net salary for EMI
    const recommendedMaxEmi = netSalary * maxEmiRatio;

    let guidance = `Based on a simulated net salary of ₹${netSalary.toFixed(2)}, your recommended maximum EMI should not exceed **₹${recommendedMaxEmi.toFixed(2)}** per month. `;

    if (savingsRate < 5) {
      guidance += "Given your current savings rate, it's advisable to be cautious with new loans. Focus on improving your savings before taking on additional debt.";
    } else if (netSalary < 30000) {
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
      {/* Welcome Card - remains at the top */}
      <Card className="lg:col-span-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome, {userProfile?.name || "User"}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl">Your current balance: <span className="font-bold">₹{balance.toFixed(2)}</span></p>
          <p className="mt-2 text-sm opacity-80">
            Account: ACED6FE132BF {/* Placeholder account number */}
          </p>
        </CardContent>
      </Card>

      {/* Info Cards - Track Your Spending & Build Emergency Fund */}
      <InfoCard
        icon={Info}
        title="Track Your Spending"
        description="Monitor your expenses across categories to identify savings opportunities."
        iconColorClass="text-blue-500"
      />
      <InfoCard
        icon={CheckCircle}
        title="Build Emergency Fund"
        description="Aim to save 3-6 months of expenses for financial security."
        iconColorClass="text-green-500"
      />

      {/* Monthly Spending Chart and Balance History Chart */}
      <div className="md:col-span-2 grid gap-6">
        <MonthlySpendingChart />
        <BalanceHistoryChart />
      </div>

      {/* Spending Analysis Card (replaces old Spending Categories) */}
      <SpendingAnalysisCard />

      {/* Financial Health Card (with Savings Rate and Recent Transactions) */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Financial Health</CardTitle>
          <CardDescription>Key indicators of your financial well-being.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Savings Rate (Last 3 Months)</h3>
              <p className={`text-2xl font-bold ${savingsRate >= 10 ? 'text-green-600' : savingsRate >= 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                {savingsRate}%
              </p>
              <p className="text-sm text-muted-foreground">
                {savingsRate >= 10 ? "Excellent! You're saving a good portion of your income." :
                 savingsRate >= 0 ? "Good start, but there's room to grow your savings." :
                 "Your spending exceeds your income. Time to review your budget!"}
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold">Recent Transactions</h3>
              {recentTransactions.length === 0 ? (
                <p className="text-muted-foreground text-sm">No recent transactions.</p>
              ) : (
                <ScrollArea className="h-[150px] pr-4">
                  <div className="space-y-3">
                    {recentTransactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          {getTransactionIcon(tx.type)}
                          <div>
                            <p className="font-medium">{tx.description}</p>
                            <p className="text-xs text-muted-foreground">{format(parseISO(tx.date), 'MMM dd, hh:mm a')}</p>
                          </div>
                        </div>
                        <p className={`font-semibold ${tx.type === "deposit" || tx.type === "transfer_in" ? "text-green-600" : "text-red-600"}`}>
                          {tx.type === "deposit" || tx.type === "transfer_in" ? "+" : "-"}₹{tx.amount.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spending Insights Card */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
          <CardDescription>Personalized analysis of your spending habits.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: getSpendingGuidance() }}></p>
        </CardContent>
      </Card>

      {/* Investment Guidance Card */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Investment Guidance</CardTitle>
          <CardDescription>Smart ways to grow your money.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: getInvestmentGuidance() }}></p>
        </CardContent>
      </Card>

      {/* Loan Guidelines Card */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Loan Guidelines</CardTitle>
          <CardDescription>Understand how much loan to take and for what term.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: getLoanGuidance() }}></p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;