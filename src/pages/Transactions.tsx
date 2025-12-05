"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Transactions: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-16rem)]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">Deposit, Withdraw, and Transfer features will be implemented here.</p>
          <p className="text-sm text-muted-foreground">
            (Note: These operations will be simulated and not persistent in this frontend-only demo.)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;