"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button"; // Import Button

// Placeholder for new components

const FinancialSummaryCard: React.FC = () => {
  const { getTotalIncome, getTotalExpenses, getNetSavings, getSavingsRate } = useFinance();
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const netSavings = getNetSavings();
  const savingsRate = getSavingsRate();

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl">Financial Analytics</CardTitle>
        <CardDescription>A comprehensive overview of your financial performance.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <ArrowUpRight className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-xl font-bold">₹{totalIncome.toFixed(2)}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-red-100 text-red-600">
            <ArrowDownRight className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-xl font-bold">₹{totalExpenses.toFixed(2)}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Net Savings</p>
            <p className="text-xl font-bold">₹{netSavings.toFixed(2)}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Savings Rate</p>
            <p className="text-xl font-bold">{savingsRate.toFixed(2)}%</p>
          </div>
        </Card>
      </CardContent>
    </Card>
  );
};

const MonthlyTrendsChart: React.FC = () => {
  const { getMonthlyIncomeData, getMonthlyExpensesData } = useFinance();
  const incomeData = getMonthlyIncomeData(6);
  const expensesData = getMonthlyExpensesData(6);

  // Correctly calculate combined data with savings
  const combinedData = incomeData.map((incomeMonth) => {
    const expenseMonth = expensesData.find(exp => exp.name === incomeMonth.name);
    const totalIncome = incomeMonth.totalIncome;
    const totalExpenses = expenseMonth?.totalExpenses || 0;
    const savings = totalIncome - totalExpenses; // Correct savings calculation

    return {
      name: incomeMonth.name,
      totalIncome,
      totalExpenses,
      savings, // This will now correctly reflect Income - Expenses
    };
  });

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Monthly Trends</CardTitle>
        <CardDescription>Income vs Expenses over last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        {combinedData.some(item => item.totalIncome > 0 || item.totalExpenses > 0) ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={combinedData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-sm" />
                <YAxis tickFormatter={(value) => `₹${value}`} className="text-sm" />
                <Tooltip formatter={(value: number, name: string) => [`₹${value.toFixed(2)}`, name === 'totalIncome' ? 'Income' : name === 'totalExpenses' ? 'Expenses' : 'Savings']} />
                <Legend />
                <Bar dataKey="totalIncome" name="Income" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                <Bar dataKey="totalExpenses" name="Expenses" fill="#fa8072" radius={[4, 4, 0, 0]} />
                <Bar dataKey="savings" name="Savings" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-10">No income or expense data for the last 6 months.</p>
        )}
      </CardContent>
    </Card>
  );
};

interface InvestmentAllocationItemProps {
  title: string;
  percentage: number;
  amount: number;
  returns: string;
  risk: string;
  color: string;
}

const InvestmentAllocationItem: React.FC<InvestmentAllocationItemProps> = ({ title, percentage, amount, returns, risk, color }) => (
  <Card className="p-4 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-2xl font-bold" style={{ color }}>₹{amount.toFixed(2)}</p>
      </div>
      <span className="text-xl font-bold text-muted-foreground">{percentage}%</span>
    </div>
    <div className="text-sm text-muted-foreground">
      <p>{returns}</p>
      <p>Risk: {risk}</p>
    </div>
  </Card>
);

const RecommendedInvestmentAllocation: React.FC = () => {
  const { balance } = useFinance();
  const allocations = [
    {
      title: "Emergency Fund",
      percentage: 30,
      returns: "5-7%",
      risk: "Very Low",
      color: "#0088FE"
    },
    {
      title: "Equity MF",
      percentage: 40,
      returns: "12-15%",
      risk: "Moderate",
      color: "#00C49F"
    },
    {
      title: "Debt MF",
      percentage: 20,
      returns: "7-9%",
      risk: "Low",
      color: "#FFBB28"
    },
    {
      title: "Gold",
      percentage: 10,
      returns: "8-10%",
      risk: "Low",
      color: "#FF8042"
    },
  ];

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Recommended Investment Allocation</CardTitle>
        <CardDescription>Based on your balance of ₹{balance.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allocations.map((item, index) => (
          <InvestmentAllocationItem
            key={index}
            {...item}
            amount={balance * (item.percentage / 100)}
          />
        ))}
      </CardContent>
    </Card>
  );
};

interface InvestmentOpportunityProps {
  title: string;
  description: string;
  risk: string;
  returns: string;
}

const InvestmentOpportunityCard: React.FC<InvestmentOpportunityProps> = ({ title, description, risk, returns }) => (
  <Card className="p-4">
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-semibold text-lg">{title}</h3>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        risk === "Moderate Risk" ? "bg-yellow-100 text-yellow-800" :
        risk === "Low Risk" ? "bg-green-100 text-green-800" :
        "bg-blue-100 text-blue-800"
      }`}>
        {risk}
      </span>
    </div>
    <p className="text-sm text-muted-foreground mb-2">{description}</p>
    <p className="text-sm font-medium">Expected Returns: {returns}</p>
  </Card>
);

const TopInvestmentOpportunities: React.FC = () => (
  <Card className="lg:col-span-3">
    <CardHeader>
      <CardTitle>Top Investment Opportunities</CardTitle>
      <CardDescription>AI-powered recommendations for Indian markets</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <InvestmentOpportunityCard
        title="Nifty 50 Index Fund"
        description="Invest in the top 50 Indian companies, offering diversified exposure to the market."
        risk="Moderate Risk"
        returns="12-15% p.a."
      />
      <InvestmentOpportunityCard
        title="Government Bonds (G-Secs)"
        description="Low-risk investment backed by the Indian government, ideal for capital preservation."
        risk="Low Risk"
        returns="7-8% p.a."
      />
      <InvestmentOpportunityCard
        title="Blue-chip Equity Stocks"
        description="Direct investment in established, financially sound companies with a history of stable earnings."
        risk="Moderate Risk"
        returns="10-18% p.a."
      />
    </CardContent>
  </Card>
);

const AnalyticsAndInvestments: React.FC = () => {
  const { userProfile } = useFinance();

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-16rem)]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Profile Not Set Up</CardTitle>
            <CardDescription>
              Please set up your profile first to view financial analytics and investment guidance.
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
    <div className="grid gap-6">
      <FinancialSummaryCard />
      <MonthlyTrendsChart />
      <RecommendedInvestmentAllocation />
      <TopInvestmentOpportunities />
    </div>
  );
};

export default AnalyticsAndInvestments;