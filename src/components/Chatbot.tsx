"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, X } from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { useNavigate } from "react-router-dom";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const { userProfile, balance, getTotalIncome, getTotalExpenses, getNetSavings, getSavingsRate } = useFinance();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const newUserMessage: Message = { text: inputMessage, sender: "user" };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
    }, 500);
  };

  const generateBotResponse = (message: string): string => {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      return `Hello ${userProfile?.name || "there"}! How can I help you with your finances today?`;
    } else if (lowerCaseMessage.includes("current balance") || lowerCaseMessage.includes("my balance")) {
      if (userProfile) {
        return `Your current account balance is ₹${balance.toFixed(2)}.`;
      }
      return "Please set up your profile first to check your balance.";
    } else if (lowerCaseMessage.includes("transactions")) {
      return "To view your transaction history or make new transactions, please visit the Transactions page. I can navigate you there if you like.";
    } else if (lowerCaseMessage.includes("loan")) {
      return "If you need to assess loan eligibility or detect potential fraud, head over to the Loan Assessment page. I can navigate you there if you like.";
    } else if (lowerCaseMessage.includes("investments") || lowerCaseMessage.includes("analytics")) {
      return "For financial insights and investment guidance, check out the Analytics & Investments page. I can navigate you there if you like.";
    } else if (lowerCaseMessage.includes("profile")) {
      return "You can view or update your profile details on the Profile page. I can navigate you there if you like.";
    } else if (lowerCaseMessage.includes("dashboard")) {
      return "The Dashboard provides an overview of your finances, including recent transactions and spending analysis. I can navigate you there if you like.";
    } else if (lowerCaseMessage.includes("navigate to dashboard")) {
      navigate("/dashboard");
      return "Navigating you to the Dashboard now!";
    } else if (lowerCaseMessage.includes("navigate to transactions")) {
      navigate("/transactions");
      return "Taking you to the Transactions page!";
    } else if (lowerCaseMessage.includes("navigate to loan")) {
      navigate("/loan-assessment");
      return "Redirecting you to the Loan Assessment page!";
    } else if (lowerCaseMessage.includes("navigate to investments") || lowerCaseMessage.includes("navigate to analytics")) {
      navigate("/analytics-investments");
      return "Heading to Analytics & Investments!";
    } else if (lowerCaseMessage.includes("navigate to profile")) {
      navigate("/profile");
      return "Opening your Profile page!";
    } else if (lowerCaseMessage.includes("help") || lowerCaseMessage.includes("support")) {
      return "I can help you with information about your balance, transactions, loans, investments, and profile. Just ask!";
    }
    // New finance and investment related queries
    else if (lowerCaseMessage.includes("budgeting tips") || lowerCaseMessage.includes("how to budget")) {
      return "Budgeting is key! Try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment. Track your expenses to see where your money is going.";
    } else if (lowerCaseMessage.includes("save money") || lowerCaseMessage.includes("saving tips")) {
      return "To save money, set clear goals, automate your savings, cut unnecessary expenses, and review your subscriptions. Small changes add up!";
    } else if (lowerCaseMessage.includes("investing for beginners") || lowerCaseMessage.includes("how to start investing")) {
      return "Start by understanding your risk tolerance. Consider low-cost index funds or ETFs for diversification. Begin with small, regular investments and learn continuously. The Analytics & Investments page has more info!";
    } else if (lowerCaseMessage.includes("what are stocks") || lowerCaseMessage.includes("stocks")) {
      return "Stocks represent ownership in a company. When you buy a stock, you own a small piece of that company. Their value can go up or down based on company performance and market conditions.";
    } else if (lowerCaseMessage.includes("what are mutual funds") || lowerCaseMessage.includes("mutual funds")) {
      return "Mutual funds pool money from multiple investors to invest in a diversified portfolio of stocks, bonds, or other securities. They are managed by professional fund managers.";
    } else if (lowerCaseMessage.includes("debt management") || lowerCaseMessage.includes("pay off debt")) {
      return "Prioritize high-interest debts first. Consider strategies like the debt snowball or debt avalanche method. Creating a budget and sticking to it is crucial for debt repayment.";
    } else if (lowerCaseMessage.includes("emergency fund")) {
      return "An emergency fund is crucial! Aim to save 3-6 months' worth of living expenses in an easily accessible, separate savings account. This protects you from unexpected financial shocks.";
    } else if (lowerCaseMessage.includes("financial goals")) {
      return "Setting financial goals is important. Define short-term (e.g., saving for a gadget), medium-term (e.g., down payment), and long-term goals (e.g., retirement). Make them SMART: Specific, Measurable, Achievable, Relevant, Time-bound.";
    } else if (lowerCaseMessage.includes("income") || lowerCaseMessage.includes("total income")) {
      if (userProfile) {
        const totalIncome = getTotalIncome();
        return `Your total recorded income is ₹${totalIncome.toFixed(2)}.`;
      }
      return "Please set up your profile first to track your income.";
    } else if (lowerCaseMessage.includes("expenses") || lowerCaseMessage.includes("total expenses")) {
      if (userProfile) {
        const totalExpenses = getTotalExpenses();
        return `Your total recorded expenses are ₹${totalExpenses.toFixed(2)}.`;
      }
      return "Please set up your profile first to track your expenses.";
    } else if (lowerCaseMessage.includes("net savings")) {
      if (userProfile) {
        const netSavings = getNetSavings();
        return `Your net savings (income minus expenses) are ₹${netSavings.toFixed(2)}.`;
      }
      return "Please set up your profile first to calculate net savings.";
    } else if (lowerCaseMessage.includes("savings rate")) {
      if (userProfile) {
        const savingsRate = getSavingsRate();
        return `Your current savings rate is ${savingsRate.toFixed(2)}%.`;
      }
      return "Please set up your profile first to calculate your savings rate.";
    }
    else {
      return "I'm a simple chatbot and currently can only answer predefined queries. Please try asking about 'balance', 'transactions', 'loan', 'investments', 'profile', 'budgeting tips', 'save money', 'investing for beginners', 'stocks', 'mutual funds', 'debt management', 'emergency fund', or 'financial goals'.";
    }
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
        <Card className="fixed bottom-4 right-4 w-80 h-[400px] flex flex-col shadow-xl z-50">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <CardTitle className="text-lg">FinAssist Chatbot</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close Chatbot</span>
            </Button>
          </CardHeader>
          <CardContent className="flex-grow p-4 overflow-hidden">
            <ScrollArea className="h-full pr-2">
              <div className="space-y-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-2 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {msg.text}
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