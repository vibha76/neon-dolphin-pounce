"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, X, Bot, User } from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from 'date-fns';

// Types
interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface FinancialData {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  spendingCategories: Record<string, number>;
  recentTransactions: any[];
  monthlyIncomeData: { name: string; totalIncome: number }[];
  monthlyExpensesData: { name: string; totalExpenses: number }[];
  userProfile: any;
}

// Utility functions
const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
};

// Financial data extractor
const extractFinancialData = (financeContext: ReturnType<typeof useFinance>): FinancialData => {
  const {
    balance,
    transactions,
    userProfile,
    getSpendingCategories,
    getMonthlyExpensesData,
    getMonthlyIncomeData,
    getTotalIncome,
    getTotalExpenses,
    getNetSavings,
    getSavingsRate,
    getRecentTransactions
  } = financeContext;

  return {
    balance,
    totalIncome: getTotalIncome(),
    totalExpenses: getTotalExpenses(),
    netSavings: getNetSavings(),
    savingsRate: getSavingsRate(),
    spendingCategories: getSpendingCategories(),
    recentTransactions: getRecentTransactions(5),
    monthlyIncomeData: getMonthlyIncomeData(6),
    monthlyExpensesData: getMonthlyExpensesData(6),
    userProfile
  };
};

// Enhanced rule-based response system
class FinancialResponseEngine {
  private financialData: FinancialData;
  private navigate: (path: string) => void;

  constructor(financialData: FinancialData, navigate: (path: string) => void) {
    this.financialData = financialData;
    this.navigate = navigate;
  }

  public generateResponse(message: string): string {
    const lowerCaseMessage = message.toLowerCase();
    
    // Check if profile is set up
    const profileCheckResult = this.checkProfile();
    if (profileCheckResult) return profileCheckResult;

    // Greetings
    if (this.isGreeting(lowerCaseMessage)) {
      return this.handleGreeting();
    }

    // Account information
    if (this.isAccountQuery(lowerCaseMessage)) {
      return this.handleAccountQuery(lowerCaseMessage);
    }

    // Spending analysis
    if (this.isSpendingQuery(lowerCaseMessage)) {
      return this.handleSpendingQuery();
    }

    // Transactions
    if (this.isTransactionQuery(lowerCaseMessage)) {
      return this.handleTransactionQuery(lowerCaseMessage);
    }

    // Investments
    if (this.isInvestmentQuery(lowerCaseMessage)) {
      return this.handleInvestmentQuery();
    }

    // Navigation
    if (this.isNavigationQuery(lowerCaseMessage)) {
      return this.handleNavigationQuery(lowerCaseMessage);
    }

    // Fallback response
    return this.handleFallback();
  }

  private checkProfile(): string | null {
    if (!this.financialData.userProfile) {
      return "It looks like your profile isn't fully set up yet. Please go to the Profile Setup page to enter your details and initial balance so I can provide personalized advice!";
    }
    return null;
  }

  private isGreeting(message: string): boolean {
    const greetings = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"];
    return greetings.some(greeting => message.includes(greeting));
  }

  private handleGreeting(): string {
    const name = this.financialData.userProfile?.name || "there";
    return `Hello ${name}! I'm FinAssist Bot. How can I help you manage your money or answer your financial questions today?`;
  }

  private isAccountQuery(message: string): boolean {
    const accountQueries = [
      "balance", "account", "money", "income", "expenses", "savings", "rate"
    ];
    return accountQueries.some(query => message.includes(query));
  }

  private handleAccountQuery(message: string): string {
    if (message.includes("balance") || message.includes("account") || message.includes("money")) {
      return `Your current account balance is ${formatCurrency(this.financialData.balance)}. Would you like to see your recent transactions or a breakdown of your spending?`;
    }

    if (message.includes("income") || message.includes("earn")) {
      return `Your total recorded income is ${formatCurrency(this.financialData.totalIncome)}. This includes all deposits and incoming transfers.`;
    }

    if (message.includes("expenses") || message.includes("spend")) {
      return `Your total recorded expenses are ${formatCurrency(this.financialData.totalExpenses)}. This includes withdrawals and outgoing transfers.`;
    }

    if (message.includes("savings")) {
      const netSavings = this.financialData.netSavings;
      if (netSavings >= 0) {
        return `Your net savings (total income minus total expenses) are ${formatCurrency(netSavings)}. This is the money you have left after covering your expenses.`;
      } else {
        return `Your net savings are ${formatCurrency(netSavings)}. This indicates your expenses are currently higher than your income.`;
      }
    }

    if (message.includes("rate")) {
      const savingsRate = this.financialData.savingsRate;
      return `Your current savings rate is ${savingsRate.toFixed(2)}%. ${savingsRate >= 15 ? "That's a healthy savings rate!" : "Financial experts often recommend aiming for 15% or more."}`;
    }

    return `I can help with your account information. Your current balance is ${formatCurrency(this.financialData.balance)}.`;
  }

  private isSpendingQuery(message: string): boolean {
    const spendingQueries = ["spending", "categories", "where", "expenses", "analysis"];
    return spendingQueries.some(query => message.includes(query));
  }

  private handleSpendingQuery(): string {
    const categories = this.financialData.spendingCategories;
    const totalSpending = Object.values(categories).reduce((sum, value) => sum + value, 0);

    if (totalSpending === 0) {
      return "You haven't recorded any spending yet. Make some withdrawals or transfers to see your spending analysis!";
    }

    const sortedCategories = Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => `${category}: ${formatCurrency(amount)}`)
      .join(", ");

    return `Here's a breakdown of your top spending categories: ${sortedCategories}. Your total spending is ${formatCurrency(totalSpending)}.`;
  }

  private isTransactionQuery(message: string): boolean {
    const transactionQueries = ["transaction", "history", "deposit", "withdraw", "transfer", "send", "recent"];
    return transactionQueries.some(query => message.includes(query));
  }

  private handleTransactionQuery(message: string): string {
    if (message.includes("deposit")) {
      return "You can deposit funds into your account from the Transactions page. Just specify the amount and a description.";
    }

    if (message.includes("withdraw")) {
      return "To withdraw money, go to the Transactions page, enter the amount, and a description.";
    }

    if (message.includes("transfer") || message.includes("send")) {
      return "You can transfer funds to other registered users from the Transactions page. You'll need their mobile number and the amount.";
    }

    return "To view your complete transaction history or make new transactions, please visit the Transactions page.";
  }

  private isInvestmentQuery(message: string): boolean {
    const investmentQueries = ["invest", "loan", "portfolio", "stocks", "mutual", "fund", "analytics"];
    return investmentQueries.some(query => message.includes(query));
  }

  private handleInvestmentQuery(): string {
    const avgMonthlyExpenses = this.financialData.monthlyExpensesData.length > 0 
      ? this.financialData.monthlyExpensesData.reduce((sum, month) => sum + month.totalExpenses, 0) / this.financialData.monthlyExpensesData.length 
      : 0;

    const emergencyFundTarget = avgMonthlyExpenses * 3;
    
    if (avgMonthlyExpenses > 0 && this.financialData.balance < emergencyFundTarget) {
      const needed = emergencyFundTarget - this.financialData.balance;
      return `Before investing, it's important to build an emergency fund. Based on your average monthly expenses of ${formatCurrency(avgMonthlyExpenses)}, you should aim for at least ${formatCurrency(emergencyFundTarget)}. You need ${formatCurrency(needed)} more to reach this target.`;
    }

    return "You're in a good position to consider investments! For personalized investment recommendations, check out the Analytics & Investments page where you can explore different opportunities based on your financial situation.";
  }

  private isNavigationQuery(message: string): boolean {
    const navigationQueries = ["go to", "navigate", "take me", "show me"];
    return navigationQueries.some(query => message.includes(query));
  }

  private handleNavigationQuery(message: string): string {
    if (message.includes("dashboard")) {
      this.navigate("/dashboard");
      return "Navigating you to the Dashboard now! Here you can see your balance, recent transactions, and spending analysis.";
    }

    if (message.includes("transaction")) {
      this.navigate("/transactions");
      return "Taking you to the Transactions page! You can manage deposits, withdrawals, and transfers here.";
    }

    if (message.includes("loan")) {
      this.navigate("/loan-assessment");
      return "Redirecting you to the Loan Assessment page! Input details to check loan eligibility and fraud.";
    }

    if (message.includes("analytics") || message.includes("investment")) {
      this.navigate("/analytics-investments");
      return "Heading to Analytics & Investments! Explore financial insights and investment recommendations.";
    }

    if (message.includes("profile")) {
      this.navigate("/profile");
      return "Opening your Profile page! You can view and update your personal details here.";
    }

    return "I can help navigate you to different sections of the app. Where would you like to go?";
  }

  private handleFallback(): string {
    return "I can help with common financial topics like your balance, transactions, loans, investments, budgeting, saving, debt, and financial goals. You can also ask me to navigate to different pages. Please try rephrasing your question!";
  }
}

// Future AI service interface (placeholder)
interface AIChatService {
  sendMessage(message: string, context: any): Promise<string>;
}

// Mock AI service for future integration
class MockAIChatService implements AIChatService {
  async sendMessage(message: string, context: any): Promise<string> {
    // This is where we would integrate with a real AI service
    // For now, we'll return a placeholder response
    return `AI response to: "${message}" (This is a placeholder for future AI integration)`;
  }
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I assist you today?",
      sender: "bot",
      timestamp: new Date()
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAIEnabled, setIsAIEnabled] = useState(false); // Future toggle for AI mode
  const financeContext = useFinance();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Extract financial data
  const financialData = extractFinancialData(financeContext);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Create response engine
  const responseEngine = new FinancialResponseEngine(financialData, navigate);

  // Handle sending messages
  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputMessage.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Simulate bot response delay
    setTimeout(() => {
      let botResponse: string;
      
      if (isAIEnabled) {
        // Future AI integration point
        const aiService = new MockAIChatService();
        // In a real implementation, we would call:
        // botResponse = await aiService.sendMessage(inputMessage, financialData);
        botResponse = `AI mode is enabled. In a future update, this will connect to an AI service to provide personalized financial advice based on your data: "${inputMessage}"`;
      } else {
        // Use rule-based engine
        botResponse = responseEngine.generateResponse(inputMessage);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 500);
  }, [inputMessage, isAIEnabled, responseEngine]);

  // Toggle AI mode (for future use)
  const toggleAIMode = () => {
    setIsAIEnabled(!isAIEnabled);
  };

  return (
    <>
      {!isOpen && (
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg z-50"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-6 w-6" />
          <span className="sr-only">Open Chatbot</span>
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-80 h-[500px] flex flex-col shadow-xl z-50">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg">FinAssist Chatbot</CardTitle>
              {isAIEnabled && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  AI Mode
                </span>
              )}
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleAIMode}
                className="h-8 w-8"
                title={isAIEnabled ? "Switch to Rule-based Mode" : "Switch to AI Mode"}
              >
                <Bot className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close Chatbot</span>
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-grow p-4 overflow-hidden">
            <ScrollArea className="h-full pr-2">
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-lg flex ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted text-muted-foreground rounded-bl-none"
                      }`}
                    >
                      {msg.sender === "bot" && (
                        <Bot className="h-5 w-5 mr-2 flex-shrink-0" />
                      )}
                      <div>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                        <div className={`text-xs mt-1 ${msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground/70"} text-right`}>
                          {format(msg.timestamp, 'HH:mm')}
                        </div>
                      </div>
                      {msg.sender === "user" && (
                        <User className="h-5 w-5 ml-2 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          
          <CardFooter className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
              <Input
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send Message</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default Chatbot;