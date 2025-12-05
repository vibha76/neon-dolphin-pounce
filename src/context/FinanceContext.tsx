"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { showSuccess, showError } from "@/utils/toast";

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
  email: string; // Add email to UserProfile
}

interface FinanceContextType {
  balance: number;
  transactions: Transaction[];
  userProfile: UserProfile | null;
  registeredUsers: UserProfile[];
  deposit: (amount: number, description: string) => void;
  withdraw: (amount: number, description: string) => void;
  transfer: (amount: number, recipientMobile: string, description: string) => void;
  updateUserProfile: (name: string, mobile: string, initialBalance: number) => void;
  loginUser: (email: string, name?: string) => boolean; // Add loginUser function
  getSpendingCategories: () => Record<string, number>;
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

  useEffect(() => {
    localStorage.setItem("finassist_balance", balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("finassist_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("finassist_user_profile", JSON.stringify(userProfile));
    // Ensure the current user is in the registered users list if profile exists
    if (userProfile && !registeredUsers.some(u => u.mobile === userProfile.mobile)) {
      setRegisteredUsers(prev => [...prev, userProfile]);
    }
  }, [userProfile, registeredUsers]);

  useEffect(() => {
    localStorage.setItem("finassist_registered_users", JSON.stringify(registeredUsers));
  }, [registeredUsers]);


  const addTransaction = (type: Transaction["type"], amount: number, description: string, recipientMobile?: string, senderMobile?: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount,
      date: new Date().toLocaleString(),
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
    setBalance((prev) => prev + amount);
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
    setBalance((prev) => prev - amount);
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

    // Simulate transfer for sender
    setBalance((prev) => prev - amount);
    addTransaction("transfer_out", amount, description, recipientMobile, userProfile.mobile);
    showSuccess(`Transferred ₹${amount.toFixed(2)} to ${recipient.name} (${recipientMobile}).`);

    // Simulate transfer for recipient (update their balance in registeredUsers)
    setRegisteredUsers(prevUsers => prevUsers.map(user =>
      user.mobile === recipientMobile
        ? { ...user, balance: user.balance + amount }
        : user
    ));
    // Add a simulated 'transfer_in' transaction for the recipient (not visible to current user, but for data consistency)
    console.log(`Simulated transfer_in for ${recipient.name}: ₹${amount.toFixed(2)} from ${userProfile.name}`);
  };

  const updateUserProfile = (name: string, mobile: string, initialBalance: number) => {
    if (!userProfile) {
      showError("No user logged in to update profile.");
      return;
    }
    const updatedProfile: UserProfile = { ...userProfile, name, mobile, balance: initialBalance };
    setUserProfile(updatedProfile);
    setBalance(initialBalance); // Set initial balance from profile setup
    // Update the user in the registeredUsers list
    setRegisteredUsers(prev => prev.map(u => u.email === userProfile.email ? updatedProfile : u));
  };

  const loginUser = (email: string, name: string = "User"): boolean => {
    let foundUser = registeredUsers.find(user => user.email === email);

    if (foundUser) {
      // Simulate successful login for existing user
      setUserProfile(foundUser);
      setBalance(foundUser.balance);
      setTransactions(JSON.parse(localStorage.getItem(`finassist_transactions_${foundUser.email}`) || "[]"));
      localStorage.setItem("finassist_current_user_email", email);
      return true;
    } else {
      // Simulate new user registration
      const newProfile: UserProfile = {
        email,
        name,
        mobile: "", // Will be set in ProfileSetup
        balance: 0, // Will be set in ProfileSetup
      };
      setRegisteredUsers(prev => [...prev, newProfile]);
      setUserProfile(newProfile);
      setBalance(0);
      setTransactions([]);
      localStorage.setItem("finassist_current_user_email", email);
      return true;
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

  const logout = () => {
    localStorage.removeItem("finassist_balance");
    localStorage.removeItem("finassist_transactions");
    localStorage.removeItem("finassist_user_profile");
    localStorage.removeItem("finassist_current_user_email"); // Clear current user email
    // Note: We are not clearing `finassist_registered_users` to simulate multiple users
    setBalance(0);
    setTransactions([]);
    setUserProfile(null);
    showSuccess("Logged out successfully!");
  };

  // Load user profile and transactions on initial load based on current_user_email
  useEffect(() => {
    const currentUserEmail = localStorage.getItem("finassist_current_user_email");
    if (currentUserEmail) {
      const foundUser = registeredUsers.find(user => user.email === currentUserEmail);
      if (foundUser) {
        setUserProfile(foundUser);
        setBalance(foundUser.balance);
        setTransactions(JSON.parse(localStorage.getItem(`finassist_transactions_${foundUser.email}`) || "[]"));
      }
    }
  }, []); // Run only once on mount

  // Save transactions specific to the current user
  useEffect(() => {
    if (userProfile?.email) {
      localStorage.setItem(`finassist_transactions_${userProfile.email}`, JSON.stringify(transactions));
    }
  }, [transactions, userProfile?.email]);


  return (
    <FinanceContext.Provider
      value={{
        balance,
        transactions,
        userProfile,
        registeredUsers,
        deposit,
        withdraw,
        transfer,
        updateUserProfile,
        loginUser,
        getSpendingCategories,
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