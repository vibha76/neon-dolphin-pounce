"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDown, ArrowUp, Repeat, Info, CheckCircle } from "lucide-react";
import { format, parseISO } from 'date-fns';
import SpendingAnalysisCard from "@/components/dashboard/SpendingAnalysisCard";
import InfoCard from "@/components/dashboard/InfoCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showError, showSuccess } from "@/utils/toast";


const Dashboard: React.FC = () => {
  const { balance, userProfile, getRecentTransactions, deposit, withdraw, transfer, registeredUsers, getMonthlyIncomeData } = useFinance();
  const recentTransactions = getRecentTransactions(5);
  const monthlyIncomeData = getMonthlyIncomeData(1); // Get current month's income
  const currentMonthIncome = monthlyIncomeData[0]?.totalIncome || 0;

  const [depositAmount, setDepositAmount] = useState("");
  const [depositDescription, setDepositDescription] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawDescription, setWithdrawDescription] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferRecipientMobile, setTransferRecipientMobile] = useState("");
  const [transferDescription, setTransferDescription] = useState("");

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

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      showError("Please enter a valid positive amount for deposit.");
      return;
    }
    deposit(amount, depositDescription || "General Deposit");
    setDepositAmount("");
    setDepositDescription("");
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      showError("Please enter a valid positive amount for withdrawal.");
      return;
    }
    withdraw(amount, withdrawDescription || "General Withdrawal");
    setWithdrawAmount("");
    setWithdrawDescription("");
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) {
      showError("Please set up your profile first to make transfers.");
      return;
    }
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      showError("Please enter a valid positive amount for transfer.");
      return;
    }
    transfer(amount, transferRecipientMobile, transferDescription || "Fund Transfer");
    setTransferAmount("");
    setTransferRecipientMobile("");
    setTransferDescription("");
  };


  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Welcome Card */}
      <Card className="lg:col-span-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-3xl flex justify-between items-center">
            <span>₹{balance.toFixed(2)}</span>
            <span className="text-sm font-normal opacity-80">Monthly Income: ₹{currentMonthIncome.toFixed(2)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-end">
          <div>
            <p className="text-sm opacity-80">Account: ACED6FE132BF</p>
          </div>
          <p className="text-sm opacity-80">software engineer</p> {/* Placeholder for profession */}
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

      {/* Transactions and Recent Transactions */}
      <Card className="md:col-span-2">
        <CardContent className="p-0">
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
              <TabsTrigger value="transactions" className="rounded-none">Transactions</TabsTrigger>
              <TabsTrigger value="deposit" className="rounded-none">Deposit</TabsTrigger>
              <TabsTrigger value="withdraw" className="rounded-none">Withdraw</TabsTrigger>
              <TabsTrigger value="transfer" className="rounded-none">Transfer</TabsTrigger>
            </TabsList>
            <TabsContent value="transactions" className="mt-0 p-6">
              <h3 className="font-semibold text-lg mb-4">Recent Transactions</h3>
              {recentTransactions.length === 0 ? (
                <p className="text-muted-foreground text-sm">No recent transactions.</p>
              ) : (
                <ScrollArea className="h-[250px] pr-4">
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
            </TabsContent>
            <TabsContent value="deposit" className="mt-0 p-6">
              <form onSubmit={handleDeposit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="deposit-amount">Amount (₹)</Label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    placeholder="1000.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deposit-description">Description</Label>
                  <Input
                    id="deposit-description"
                    type="text"
                    placeholder="Salary, Gift, etc."
                    value={depositDescription}
                    onChange={(e) => setDepositDescription(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Deposit Funds
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="withdraw" className="mt-0 p-6">
              <form onSubmit={handleWithdraw} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="withdraw-amount">Amount (₹)</Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="500.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="withdraw-description">Description</Label>
                  <Input
                    id="withdraw-description"
                    type="text"
                    placeholder="Rent, Shopping, etc."
                    value={withdrawDescription}
                    onChange={(e) => setWithdrawDescription(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Withdraw Funds
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="transfer" className="mt-0 p-6">
              <form onSubmit={handleTransfer} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="transfer-recipient">Recipient Mobile Number</Label>
                  <Input
                    id="transfer-recipient"
                    type="tel"
                    placeholder="9876543210"
                    value={transferRecipientMobile}
                    onChange={(e) => setTransferRecipientMobile(e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Registered users for transfer: {registeredUsers.map(u => u.mobile).join(", ")}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="transfer-amount">Amount (₹)</Label>
                  <Input
                    id="transfer-amount"
                    type="number"
                    placeholder="200.00"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="transfer-description">Description</Label>
                  <Input
                    id="transfer-description"
                    type="text"
                    placeholder="Family, Friend, etc."
                    value={transferDescription}
                    onChange={(e) => setTransferDescription(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Transfer Funds
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Spending Analysis Card */}
      <SpendingAnalysisCard />
    </div>
  );
};

export default Dashboard;