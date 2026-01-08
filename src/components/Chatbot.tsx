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
  const { userProfile, balance, getTotalIncome, getTotalExpenses, getNetSavings, getSavingsRate, getSpendingCategories } = useFinance();
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

    // --- Personalized Greetings & Basic Info ---
    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      return `Hello ${userProfile?.name || "there"}! I'm FinAssist Bot. How can I help you manage your money or answer your financial questions today?`;
    } else if (lowerCaseMessage.includes("my name")) {
      return userProfile?.name ? `Your name is ${userProfile.name}.` : "I don't have your name yet. Please set up your profile!";
    } else if (lowerCaseMessage.includes("my mobile")) {
      return userProfile?.mobile ? `Your registered mobile number is ${userProfile.mobile}.` : "I don't have your mobile number. Please set up your profile!";
    }

    // --- Account Balance & Summary ---
    else if (lowerCaseMessage.includes("current balance") || lowerCaseMessage.includes("my balance") || lowerCaseMessage.includes("how much money do i have")) {
      if (userProfile) {
        return `Your current account balance is ₹${balance.toFixed(2)}. Would you like to see your recent transactions or spending analysis?`;
      }
      return "Please set up your profile first to check your balance. You can do this on the Profile Setup page.";
    } else if (lowerCaseMessage.includes("total income")) {
      if (userProfile) {
        const totalIncome = getTotalIncome();
        return `Your total recorded income is ₹${totalIncome.toFixed(2)}. This includes all deposits and incoming transfers.`;
      }
      return "Please set up your profile first to track your income.";
    } else if (lowerCaseMessage.includes("total expenses") || lowerCaseMessage.includes("my spending")) {
      if (userProfile) {
        const totalExpenses = getTotalExpenses();
        return `Your total recorded expenses are ₹${totalExpenses.toFixed(2)}. This includes withdrawals and outgoing transfers.`;
      }
      return "Please set up your profile first to track your expenses.";
    } else if (lowerCaseMessage.includes("net savings")) {
      if (userProfile) {
        const netSavings = getNetSavings();
        return `Your net savings (total income minus total expenses) are ₹${netSavings.toFixed(2)}.`;
      }
      return "Please set up your profile first to calculate your net savings.";
    } else if (lowerCaseMessage.includes("savings rate")) {
      if (userProfile) {
        const savingsRate = getSavingsRate();
        return `Your current savings rate is ${savingsRate.toFixed(2)}%. A higher rate means you're saving more of your income!`;
      }
      return "Please set up your profile first to calculate your savings rate.";
    }

    // --- Spending Analysis ---
    else if (lowerCaseMessage.includes("spending analysis") || lowerCaseMessage.includes("where does my money go") || lowerCaseMessage.includes("spending categories")) {
      if (userProfile) {
        const spendingCategories = getSpendingCategories();
        const totalSpending = Object.values(spendingCategories).reduce((sum, value) => sum + value, 0);

        if (totalSpending === 0) {
          return "You haven't recorded any spending yet. Make some withdrawals or transfers to see your spending analysis!";
        }

        const sortedCategories = Object.entries(spendingCategories)
          .sort(([, a], [, b]) => b - a)
          .map(([category, amount]) => `${category}: ₹${amount.toFixed(2)}`);

        return `Here's a breakdown of your spending: ${sortedCategories.join(", ")}. Your total spending is ₹${totalSpending.toFixed(2)}. You can find a visual representation on the Dashboard.`;
      }
      return "Please set up your profile first to get a personalized spending analysis.";
    }

    // --- Transactions ---
    else if (lowerCaseMessage.includes("transactions") || lowerCaseMessage.includes("transaction history") || lowerCaseMessage.includes("recent activity")) {
      return "To view your complete transaction history or make new deposits, withdrawals, or transfers, please visit the Transactions page. I can navigate you there if you like.";
    } else if (lowerCaseMessage.includes("deposit")) {
      return "You can deposit funds into your account from the Transactions page. Just specify the amount and a description.";
    } else if (lowerCaseMessage.includes("withdraw")) {
      return "To withdraw money, go to the Transactions page, enter the amount, and a description. Remember to maintain sufficient balance!";
    } else if (lowerCaseMessage.includes("transfer")) {
      return "You can transfer funds to other registered users from the Transactions page. You'll need their mobile number and the amount.";
    }

    // --- Loan Assessment ---
    else if (lowerCaseMessage.includes("loan") || lowerCaseMessage.includes("loan eligibility") || lowerCaseMessage.includes("fraud detection")) {
      return "If you need to assess loan eligibility or detect potential fraud, head over to the Loan Assessment page. There, you can input various details to get an assessment.";
    }

    // --- Investments & Analytics ---
    else if (lowerCaseMessage.includes("investments") || lowerCaseMessage.includes("analytics") || lowerCaseMessage.includes("financial insights")) {
      return "For detailed financial insights, monthly trends, recommended investment allocations, and top investment opportunities, check out the Analytics & Investments page. It's a great place to plan your financial future!";
    }

    // --- General Financial Guidelines ---
    else if (lowerCaseMessage.includes("budgeting tips") || lowerCaseMessage.includes("how to budget") || lowerCaseMessage.includes("create a budget")) {
      return "Budgeting is crucial for financial health! A popular method is the 50/30/20 rule: 50% for Needs, 30% for Wants, and 20% for Savings & Debt Repayment. Start by tracking your income and expenses to understand where your money is going.";
    } else if (lowerCaseMessage.includes("save money") || lowerCaseMessage.includes("saving tips") || lowerCaseMessage.includes("how to save")) {
      return "To save effectively, set clear financial goals (e.g., emergency fund, down payment), automate your savings by setting up recurring transfers, cut unnecessary expenses, and review your subscriptions regularly. Small, consistent savings add up over time!";
    } else if (lowerCaseMessage.includes("investing for beginners") || lowerCaseMessage.includes("how to start investing") || lowerCaseMessage.includes("investment advice")) {
      return "Starting to invest can be exciting! First, ensure you have an emergency fund. Then, understand your risk tolerance. Consider diversified options like low-cost index funds or ETFs. Start small, invest regularly, and continuously educate yourself. The Analytics & Investments page offers some recommendations.";
    } else if (lowerCaseMessage.includes("what are stocks") || lowerCaseMessage.includes("stocks explained")) {
      return "Stocks represent ownership shares in a company. When you buy a stock, you own a small piece of that company. Their value can fluctuate based on company performance, industry trends, and overall market conditions.";
    } else if (lowerCaseMessage.includes("what are mutual funds") || lowerCaseMessage.includes("mutual funds explained")) {
      return "Mutual funds pool money from many investors to invest in a diversified portfolio of stocks, bonds, or other securities. They are managed by professional fund managers, offering diversification and professional management for a fee.";
    } else if (lowerCaseMessage.includes("debt management") || lowerCaseMessage.includes("pay off debt") || lowerCaseMessage.includes("handle debt")) {
      return "Effective debt management involves prioritizing high-interest debts first. Strategies like the debt snowball (pay smallest debt first) or debt avalanche (pay highest interest debt first) can be helpful. Creating a strict budget and avoiding new debt are also key.";
    } else if (lowerCaseMessage.includes("emergency fund")) {
      return "An emergency fund is a crucial safety net! It's typically 3-6 months' worth of living expenses saved in an easily accessible, separate account. This fund protects you from unexpected events like job loss, medical emergencies, or car repairs without going into debt.";
    } else if (lowerCaseMessage.includes("financial goals")) {
      return "Setting financial goals is vital. Define short-term (e.g., saving for a gadget), medium-term (e.g., down payment), and long-term goals (e.g., retirement). Make them SMART: Specific, Measurable, Achievable, Relevant, and Time-bound.";
    } else if (lowerCaseMessage.includes("retirement planning")) {
      return "Retirement planning involves setting aside money over many years to ensure financial security in your later life. It often includes contributions to retirement accounts like provident funds, mutual funds, and other long-term investments. Start early and contribute consistently!";
    } else if (lowerCaseMessage.includes("credit score") || lowerCaseMessage.includes("cibil")) {
      return "Your CIBIL score (or credit score) is a three-digit number that reflects your creditworthiness. A higher score (typically 750+) makes it easier to get loans and credit cards with favorable terms. Pay bills on time and manage credit responsibly to improve it.";
    }

    // --- Navigation ---
    else if (lowerCaseMessage.includes("navigate to dashboard")) {
      navigate("/dashboard");
      return "Navigating you to the Dashboard now! Here you can see your balance, recent transactions, and spending analysis.";
    } else if (lowerCaseMessage.includes("navigate to transactions")) {
      navigate("/transactions");
      return "Taking you to the Transactions page! You can manage deposits, withdrawals, and transfers here.";
    } else if (lowerCaseMessage.includes("navigate to loan")) {
      navigate("/loan-assessment");
      return "Redirecting you to the Loan Assessment page! Input details to check loan eligibility and fraud.";
    } else if (lowerCaseMessage.includes("navigate to investments") || lowerCaseMessage.includes("navigate to analytics")) {
      navigate("/analytics-investments");
      return "Heading to Analytics & Investments! Explore financial insights and investment recommendations.";
    } else if (lowerCaseMessage.includes("navigate to profile")) {
      navigate("/profile");
      return "Opening your Profile page! You can view and update your personal details here.";
    } else if (lowerCaseMessage.includes("navigate to profile setup")) {
      navigate("/profile-setup");
      return "Taking you to the Profile Setup page to get started!";
    }

    // --- Fallback / Unrecognized Query ---
    else {
      return "I'm still learning, but I can help with questions about your balance, transactions, loans, investments, budgeting, saving, debt, and financial goals. You can also ask me to 'navigate to dashboard' or other pages. What else can I assist you with?";
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