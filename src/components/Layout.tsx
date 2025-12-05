"use client";

import React from "react";
import { Link } from "react-router-dom";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Home, User, Landmark, PiggyBank, Handshake } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Landmark className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">FinAssist</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" /> Home
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/profile-setup">
                <User className="mr-2 h-4 w-4" /> Profile
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/transactions">
                <PiggyBank className="mr-2 h-4 w-4" /> Transactions
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/loan-assessment">
                <Handshake className="mr-2 h-4 w-4" /> Loan
              </Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-grow container py-8">{children}</main>
      <footer className="border-t bg-background">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Layout;