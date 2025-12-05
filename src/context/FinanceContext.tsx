"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { showSuccess, showError } from "@/utils/toast";
import { format, parseISO, startOfMonth, isSameMonth, subMonths } from 'date-fns';

interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "transfer_out" | "transfer_in";
  amount: number;
  date: string;
  description: string;
  recipientMobile?: string;
  senderMobile?: string;
}

interface UserProfile {
  mobile: string;
  name: string;
  balance: number;
  email: string;
}

interface BalanceSnapshot {
  date: string;
  balance: number;
}

interface FinanceContextType {
  balance: number;
  transactions: Transaction[];
  userProfile: UserProfile | null;
  registeredUsers: UserProfile[];
  balanceHistory: BalanceSnapshot[];
  deposit: (amount: number, description: string) => void;
  withdraw: (amount: number, description: string) => void;
  transfer: (amount: number, recipientMobile: string, description: string) => void;
  updateUserProfile: (name: string, mobile: string, initialBalance: number) => void;
  loginUser: (email: string, name?: string) => UserProfile | null; // Updated return type
  getSpendingCategories: () => Record<string, number>;
  getMonthlySpendingData: (months?: number) => { name: string; totalSpending: number }[];
  getBalanceHistoryData: (months?: number) => { name: string; balance: number }[];
  getRecentTransactions: (limit?: number) => Transaction[];
  getSavingsRate: (months?: number) => number;
  logout: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(() => {
    const savedBalance = localStorage.getItem("finassist_balance");
    return savedBalance ? parseFloat(savedBalance) : 0;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem("finassist_transactions");
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const savedProfile = localStorage.getItem("finassist_user_profile");
    return savedProfile ? JSON.parse(savedProfile) : null;
  });
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    const savedUsers = localStorage.getItem("finassist_registered_users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  const [balanceHistory, setBalanceHistory] = useState<BalanceSnapshot[]>(() => {
    const savedHistory = localStorage.getItem("finassist_balance_history");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem("finassist_balance", balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("finassist_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("finassist_user_profile", JSON.stringify(userProfile));
    if (userProfile && !registeredUsers.some(u => u.mobile === userProfile.mobile)) {
      setRegisteredUsers(prev => [...prev, userProfile]);
    }
  }, [userProfile, registeredUsers]);

  useEffect(() => {
    localStorage.setItem("finassist_registered_users", JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem("finassist_balance_history", JSON.stringify(balanceHistory));
  }, [balanceHistory]);

  const recordBalanceSnapshot = (currentBalance: number) => {
    const today = new Date();
    const formattedDate = format(today, 'yyyy-MM-dd');
    setBalanceHistory(prev => {
      // Only add a new snapshot if the last one was from a different day or if it's the first snapshot
      const lastSnapshot = prev[prev.length - 1];
      if (!lastSnapshot || format(parseISO(lastSnapshot.date), 'yyyy-MM-dd') !== formattedDate) {
        return [...prev, { date: formattedDate, balance: currentBalance }];
      }
      // Update the last snapshot if it's from today
      return prev.map((snapshot, index) => 
        index === prev.length - 1 ? { ...snapshot, balance: currentBalance } : snapshot
      );
    });
  };

  // Record initial balance snapshot when userProfile or balance changes
  useEffect(() => {
    if (userProfile) {
      recordBalanceSnapshot(balance);
    }
  }, [balance, userProfile]);


  const addTransaction = (type: Transaction["type"], amount: number, description: string, recipientMobile?: string, senderMobile?: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount,
      date: new Date().toISOString(), // Store as ISO string for easier parsing
      description,
      recipientMobile,
      senderMobile,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const deposit = (amount: number, description: string) => {
    if (amount <= 0) {
      showError("Deposit amount must be positive.");
      return;
    }
    setBalance((prev) => {
      const newBalance = prev + amount;
      recordBalanceSnapshot(newBalance);
      return newBalance;
    });
    addTransaction("deposit", amount, description);
    showSuccess(`Successfully deposited ₹${amount.toFixed(2)}.`);
  };

  const withdraw = (amount: number, description: string) => {
    if (amount <= 0) {
      showError("Withdrawal amount must be positive.");
      return;
    }
    if (balance < amount) {
      showError("Insufficient balance.");
      return;
    }
    setBalance((prev) => {
      const newBalance = prev - amount;
      recordBalanceSnapshot(newBalance);
      return newBalance;
    });
    addTransaction("withdraw", amount, description);
    showSuccess(`Successfully withdrew ₹${amount.toFixed(2)}.`);
  };

  const transfer = (amount: number, recipientMobile: string, description: string) => {
    if (amount <= 0) {
      showError("Transfer amount must be positive.");
      return;
    }
    if (balance < amount) {
      showError("Insufficient balance.");
      return;
    }
    if (!userProfile) {
      showError("Please set up your profile first.");
      return;
    }
    if (userProfile.mobile === recipientMobile) {
      showError("Cannot transfer to your own mobile number.");
      return;
    }

    const recipient = registeredUsers.find(user => user.mobile === recipientMobile);

    if (!recipient) {
      showError("Recipient mobile number not registered.");
      return;
    }

    setBalance((prev) => {
      const newBalance = prev - amount;
      recordBalanceSnapshot(newBalance);
      return newBalance;
    });
    addTransaction("transfer_out", amount, description, recipientMobile, userProfile.mobile);
    showSuccess(`Transferred ₹${amount.toFixed(2)} to ${recipient.name} (${recipientMobile}).`);

    setRegisteredUsers(prevUsers => prevUsers.map(user =>
      user.mobile === recipientMobile
        ? { ...user, balance: user.balance + amount }
        : user
    ));
    console.log(`Simulated transfer_in for ${recipient.name}: ₹${amount.toFixed(2)} from ${userProfile.name}`);
  };

  const updateUserProfile = (name: string, mobile: string, initialBalance: number) => {
    if (!userProfile) {
      showError("No user logged in to update profile.");
      return;
    }
    const updatedProfile: UserProfile = { ...userProfile, name, mobile, balance: initialBalance };
    setUserProfile(updatedProfile);
    setBalance(initialBalance);
    recordBalanceSnapshot(initialBalance); // Record balance when profile is updated
    setRegisteredUsers(prev => prev.map(u => u.email === userProfile.email ? updatedProfile : u));
  };

  const loginUser = (email: string, name: string = "User"): UserProfile | null => {
    let foundUser = registeredUsers.find(user => user.email === email);

    if (foundUser) {
      setUserProfile(foundUser);
      setBalance(parseFloat(localStorage.getItem(`finassist_balance_${foundUser.email}`) || "0"));
      setTransactions(JSON.parse(localStorage.getItem(`finassist_transactions_${foundUser.email}`) || "[]"));
      setBalanceHistory(JSON.parse(localStorage.getItem(`finassist_balance_history_${foundUser.email}`) || "[]"));
      localStorage.setItem("finassist_current_user_email", email);
      return foundUser; // Return the found user profile
    } else {
      const newProfile: UserProfile = {
        email,
        name,
        mobile: "",
        balance: 0,
      };
      setRegisteredUsers(prev => [...prev, newProfile]);
      setUserProfile(newProfile);
      setBalance(0);
      setTransactions([]);
      setBalanceHistory([]);
      localStorage.setItem("finassist_current_user_email", email);
      return newProfile; // Return the new user profile
    }
  };

  const getSpendingCategories = () => {
    const categories: Record<string, number> = {};
    transactions.filter(t => t.type === "withdraw" || t.type === "transfer_out").forEach(t => {
      const desc = t.description.toLowerCase();
      let category = "Other";

      if (desc.includes("food") || desc.includes("restaurant") || desc.includes("groceries")) {
        category = "Food & Groceries";
      } else if (desc.includes("rent") || desc.includes("mortgage") || desc.includes("housing")) {
        category = "Housing";
      } else if (desc.includes("transport") || desc.includes("fuel") || desc.includes("travel")) {
        category = "Transportation";
      } else if (desc.includes("entertainment") || desc.includes("movie") || desc.includes("game")) {
        category = "Entertainment";
      } else if (desc.includes("bill") || desc.includes("utility") || desc.includes("electricity")) {
        category = "Bills & Utilities";
      } else if (desc.includes("loan emi") || desc.includes("emi")) {
        category = "Loan Payments";
      } else if (desc.includes("investment") || desc.includes("stock") || desc.includes("mutual fund")) {
        category = "Investments";
      } else if (desc.includes("shopping") || desc.includes("clothes")) {
        category = "Shopping";
      } else if (desc.includes("health") || desc.includes("medical")) {
        category = "Health";
      } else if (desc.includes("education") || desc.includes("school")) {
        category = "Education";
      } else if (t.type === "transfer_out") {
        category = "Transfers";
      }

      categories[category] = (categories[category] || 0) + t.amount;
    });
    return categories;
  };

  const getMonthlySpendingData = (months: number = 6) => {
    const monthlySpending: Record<string, number> = {};
    const today = new Date();

    transactions.filter(t => t.type === "withdraw" || t.type === "transfer_out").forEach(t => {
      const transactionDate = parseISO(t.date);
      // Only consider transactions within the last 'months'
      if (transactionDate >= subMonths(today, months)) {
        const monthKey = format(startOfMonth(transactionDate), 'MMM yyyy');
        monthlySpending[monthKey] = (monthlySpending[monthKey] || 0) + t.amount;
      }
    });

    // Generate data for the last 'months' even if no spending occurred
    const data = [];
    for (let i = months - 1; i >= 0; i--) {
      const date = subMonths(today, i);
      const monthKey = format(startOfMonth(date), 'MMM yyyy');
      data.push({
        name: monthKey,
        totalSpending: monthlySpending[monthKey] || 0,
      });
    }
    return data;
  };

  const getBalanceHistoryData = (months: number = 6) => {
    const data: { name: string; balance: number }[] = [];
    const today = new Date();
    const sixMonthsAgo = subMonths(today, months);

    // Filter snapshots to include only the last 'months'
    const relevantHistory = balanceHistory.filter(snapshot => parseISO(snapshot.date) >= sixMonthsAgo);

    // Aggregate to show one balance per month (e.g., end-of-month balance)
    const monthlyBalances: Record<string, number> = {};
    relevantHistory.forEach(snapshot => {
      const snapshotDate = parseISO(snapshot.date);
      const monthKey = format(startOfMonth(snapshotDate), 'MMM yyyy');
      // Keep the latest balance for each month
      monthlyBalances[monthKey] = snapshot.balance;
    });

    // Ensure all last 'months' are represented
    for (let i = months - 1; i >= 0; i--) {
      const date = subMonths(today, i);
      const monthKey = format(startOfMonth(date), 'MMM yyyy');
      const existingEntry = data.find(entry => entry.name === monthKey);
      if (!existingEntry) {
        // Find the latest balance for this month from the history
        const balanceForMonth = monthlyBalances[monthKey];
        if (balanceForMonth !== undefined) {
          data.push({ name: monthKey, balance: balanceForMonth });
        } else {
          // If no snapshot for the month, use the last known balance or 0
          const lastKnownBalance = data.length > 0 ? data[data.length - 1].balance : 0;
          data.push({ name: monthKey, balance: lastKnownBalance });
        }
      }
    }
    return data.sort((a, b) => parseISO(a.name).getTime() - parseISO(b.name).getTime());
  };

  const getRecentTransactions = (limit: number = 5) => {
    return transactions.slice(0, limit);
  };

  const getSavingsRate = (months: number = 3) => {
    const today = new Date();
    const periodStart = subMonths(today, months);

    let totalDeposits = 0;
    let totalSpending = 0;

    transactions.forEach(t => {
      const transactionDate = parseISO(t.date);
      if (transactionDate >= periodStart) {
        if (t.type === "deposit" || t.type === "transfer_in") {
          totalDeposits += t.amount;
        } else if (t.type === "withdraw" || t.type === "transfer_out") {
          totalSpending += t.amount;
        }
      }
    });

    if (totalDeposits + totalSpending === 0) {
      return 0; // Avoid division by zero if no activity
    }

    // Simple savings rate: (Deposits - Spending) / Deposits
    // If deposits are 0, but there's spending, it's -100%
    if (totalDeposits === 0) {
      return totalSpending > 0 ? -100 : 0;
    }
    
    const rate = ((totalDeposits - totalSpending) / totalDeposits) * 100;
    return parseFloat(rate.toFixed(2));
  };


  const logout = () => {
    if (userProfile?.email) {
      // Save current user's data before logging out
      localStorage.setItem(`finassist_balance_${userProfile.email}`, balance.toString());
      localStorage.setItem(`finassist_transactions_${userProfile.email}`, JSON.stringify(transactions));
      localStorage.setItem(`finassist_balance_history_${userProfile.email}`, JSON.stringify(balanceHistory));
    }

    localStorage.removeItem("finassist_balance");
    localStorage.removeItem("finassist_transactions");
    localStorage.removeItem("finassist_user_profile");
    localStorage.removeItem("finassist_balance_history");
    localStorage.removeItem("finassist_current_user_email");
    
    setBalance(0);
    setTransactions([]);
    setUserProfile(null);
    setBalanceHistory([]);
    showSuccess("Logged out successfully!");
  };

  // Load user profile and transactions on initial load based on current_user_email
  useEffect(() => {
    const currentUserEmail = localStorage.getItem("finassist_current_user_email");
    if (currentUserEmail) {
      const foundUser = registeredUsers.find(user => user.email === currentUserEmail);
      if (foundUser) {
        setUserProfile(foundUser);
        setBalance(parseFloat(localStorage.getItem(`finassist_balance_${foundUser.email}`) || "0"));
        setTransactions(JSON.parse(localStorage.getItem(`finassist_transactions_${foundUser.email}`) || "[]"));
        setBalanceHistory(JSON.parse(localStorage.getItem(`finassist_balance_history_${foundUser.email}`) || "[]"));
      }
    }
  }, []);

  // Save transactions and balance history specific to the current user
  useEffect(() => {
    if (userProfile?.email) {
      localStorage.setItem(`finassist_transactions_${userProfile.email}`, JSON.stringify(transactions));
      localStorage.setItem(`finassist_balance_history_${userProfile.email}`, JSON.stringify(balanceHistory));
      localStorage.setItem(`finassist_balance_${userProfile.email}`, balance.toString());
    }
  }, [transactions, balanceHistory, balance, userProfile?.email]);


  return (
    <FinanceContext.Provider
      value={{
        balance,
        transactions,
        userProfile,
        registeredUsers,
        balanceHistory,
        deposit,
        withdraw,
        transfer,
        updateUserProfile,
        loginUser,
        getSpendingCategories,
        getMonthlySpendingData,
        getBalanceHistoryData,
        getRecentTransactions,
        getSavingsRate,
        logout,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};