"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/context/FinanceContext";
import { showError } from "@/utils/toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowDown, ArrowUp, Repeat } from "lucide-react";

const Transactions: React.FC = () => {
  const { balance, transactions, deposit, withdraw, transfer, userProfile, registeredUsers } = useFinance();

  const [depositAmount, setDepositAmount] = useState("");
  const [depositDescription, setDepositDescription] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawDescription, setWithdrawDescription] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferRecipientMobile, setTransferRecipientMobile] = useState("");
  const [transferDescription, setTransferDescription] = useState("");

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

  const getTransactionIcon = (type: Transaction["type"]) => {
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

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-16rem)]">
      <Card className="w-full lg:w-1/2">
        <CardHeader>
          <CardTitle className="text-2xl">Current Balance: ₹{balance.toFixed(2)}</CardTitle>
          <CardDescription>Manage your deposits, withdrawals, and transfers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="deposit" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
              <TabsTrigger value="transfer">Transfer</TabsTrigger>
            </TabsList>
            <TabsContent value="deposit" className="mt-4">
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
            <TabsContent value="withdraw" className="mt-4">
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
            <TabsContent value="transfer" className="mt-4">
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

      <Card className="w-full lg:w-1/2">
        <CardHeader>
          <CardTitle className="text-2xl">Transaction History</CardTitle>
          <CardDescription>A record of all your financial activities.</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground">No transactions yet.</p>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(tx.type)}
                      <div>
                        <p className="font-medium">
                          {tx.type === "deposit" && `Deposit`}
                          {tx.type === "withdraw" && `Withdrawal`}
                          {tx.type === "transfer_out" && `Transfer to ${tx.recipientMobile}`}
                          {tx.type === "transfer_in" && `Transfer from ${tx.senderMobile}`}
                        </p>
                        <p className="text-sm text-muted-foreground">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;