"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, X } from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns'; // Import format for date handling

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
  const { userProfile, balance, getTotalIncome, getTotalExpenses, getNetSavings, getSavingsRate, getSpendingCategories, getMonthlyExpensesData } = useFinance();
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

    // Helper to check if profile is set up
    const checkProfile = () => {
      if (!userProfile) {
        return "It looks like your profile isn't fully set up yet. Please go to the Profile Setup page to enter your details and initial balance so I can provide personalized advice!";
      }
      return null;
    };

    const profileCheckResult = checkProfile();
    if (profileCheckResult) return profileCheckResult;

    // Now we know userProfile exists, so we can safely access its properties and other finance context data.

    // --- Personalized Greetings & Basic Info ---
    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi") || lowerCaseMessage.includes("hey")) {
      return `Hello ${userProfile.name}! I'm FinAssist Bot. How can I help you manage your money or answer your financial questions today?`;
    } else if (lowerCaseMessage.includes("my name")) {
      return `Your name is ${userProfile.name}.`;
    } else if (lowerCaseMessage.includes("my mobile")) {
      return `Your registered mobile number is ${userProfile.mobile}.`;
    }

    // --- Account Balance & Summary ---
    else if (lowerCaseMessage.includes("current balance") || lowerCaseMessage.includes("my balance") || lowerCaseMessage.includes("how much money do i have") || lowerCaseMessage.includes("account balance")) {
      return `Your current account balance is ₹${balance.toFixed(2)}. Would you like to see your recent transactions or a breakdown of your spending?`;
    } else if (lowerCaseMessage.includes("total income") || lowerCaseMessage.includes("earnings")) {
      const totalIncome = getTotalIncome();
      return `Your total recorded income is ₹${totalIncome.toFixed(2)}. This includes all deposits and incoming transfers. Understanding your income helps in planning your budget!`;
    } else if (lowerCaseMessage.includes("total expenses") || lowerCaseMessage.includes("my spending") || lowerCaseMessage.includes("expenditure")) {
      const totalExpenses = getTotalExpenses();
      return `Your total recorded expenses are ₹${totalExpenses.toFixed(2)}. This includes withdrawals and outgoing transfers. Knowing your expenses is key to finding saving opportunities.`;
    } else if (lowerCaseMessage.includes("net savings") || lowerCaseMessage.includes("how much i saved")) {
      const netSavings = getNetSavings();
      if (netSavings >= 0) {
        return `Your net savings (total income minus total expenses) are ₹${netSavings.toFixed(2)}. This is the money you have left after covering your expenses. Great job saving!`;
      } else {
        return `Your net savings are ₹${netSavings.toFixed(2)}. This indicates your expenses are currently higher than your income. Let's look at your spending analysis to find areas to improve.`;
      }
    } else if (lowerCaseMessage.includes("savings rate") || lowerCaseMessage.includes("how much i am saving")) {
      const savingsRate = getSavingsRate();
      let response = `Your current savings rate is ${savingsRate.toFixed(2)}%.`;
      if (savingsRate >= 15) {
        response += " That's a healthy savings rate, keep up the good work!";
      } else if (savingsRate >= 0) {
        response += " Financial experts often recommend aiming for 15-20% or more for long-term goals. Let's explore ways to boost it!";
      } else {
        response += " Your spending is currently exceeding your income. It's important to review your budget and find areas to cut back.";
      }
      return response;
    }

    // --- Spending Analysis ---
    else if (lowerCaseMessage.includes("spending analysis") || lowerCaseMessage.includes("where does my money go") || lowerCaseMessage.includes("spending categories") || lowerCaseMessage.includes("expense breakdown")) {
      const spendingCategories = getSpendingCategories();
      const totalSpending = Object.values(spendingCategories).reduce((sum, value) => sum + value, 0);

      if (totalSpending === 0) {
        return "You haven't recorded any spending yet. Make some withdrawals or transfers to see your spending analysis!";
      }

      const sortedCategories = Object.entries(spendingCategories)
        .sort(([, a], [, b]) => b - a)
        .map(([category, amount]) => `${category}: ₹${amount.toFixed(2)}`);

      return `Here's a breakdown of your spending: ${sortedCategories.join(", ")}. Your total spending is ₹${totalSpending.toFixed(2)}. Review these categories to identify areas where you might be able to cut back and save more! You can find a visual representation on the Dashboard.`;
    }

    // --- Transactions ---
    else if (lowerCaseMessage.includes("transactions") || lowerCaseMessage.includes("transaction history") || lowerCaseMessage.includes("recent activity") || lowerCaseMessage.includes("money movement")) {
      return "To view your complete transaction history or make new deposits, withdrawals, or transfers, please visit the Transactions page. I can navigate you there if you like.";
    } else if (lowerCaseMessage.includes("deposit money") || lowerCaseMessage.includes("add funds")) {
      return "You can deposit funds into your account from the Transactions page. Just specify the amount and a description. It's a great way to increase your balance!";
    } else if (lowerCaseMessage.includes("withdraw money") || lowerCaseMessage.includes("take out money")) {
      return "To withdraw money, go to the Transactions page, enter the amount, and a description. Remember to maintain sufficient balance for your needs!";
    } else if (lowerCaseMessage.includes("transfer money") || lowerCaseMessage.includes("send money")) {
      return "You can transfer funds to other registered users from the Transactions page. You'll need their mobile number and the amount. It's a quick way to send money to friends or family!";
    }

    // --- Loan Assessment ---
    else if (lowerCaseMessage.includes("loan") || lowerCaseMessage.includes("loan eligibility") || lowerCaseMessage.includes("fraud detection") || lowerCaseMessage.includes("borrow money")) {
      return "If you need to assess loan eligibility or detect potential fraud, head over to the Loan Assessment page. There, you can input various details to get an assessment. Understanding your loan options is important!";
    }

    // --- Investments & Analytics ---
    else if (lowerCaseMessage.includes("investments") || lowerCaseMessage.includes("analytics") || lowerCaseMessage.includes("financial insights") || lowerCaseMessage.includes("grow my money") || lowerCaseMessage.includes("investment options")) {
      let response = `For detailed financial insights, monthly trends, recommended investment allocations, and top investment opportunities, check out the Analytics & Investments page.`;
      if (balance > 10000) { // Suggest investment if balance is substantial
        response += ` With your current balance of ₹${balance.toFixed(2)}, you have a good foundation to start or grow your investments. Consider reviewing the recommended allocations on that page to diversify your portfolio.`;
      } else if (balance > 0) {
        response += ` Building up your balance (currently ₹${balance.toFixed(2)}) is a great first step before diving into investments. Focus on your emergency fund first!`;
      }
      response += ` I can navigate you there if you like.`;
      return response;
    }

    // --- General Financial Guidelines (with personalization) ---
    else if (lowerCaseMessage.includes("budgeting tips") || lowerCaseMessage.includes("how to budget") || lowerCaseMessage.includes("create a budget") || lowerCaseMessage.includes("manage my money")) {
      const totalIncome = getTotalIncome();
      const totalExpenses = getTotalExpenses();
      let response = "Budgeting is crucial for financial health! A popular method is the 50/30/20 rule: 50% for Needs, 30% for Wants, and 20% for Savings & Debt Repayment.";
      if (totalIncome > 0 && totalExpenses > 0) {
        response += ` With your current income of ₹${totalIncome.toFixed(2)} and expenses of ₹${totalExpenses.toFixed(2)}, you can start by categorizing your spending to see how you align with this rule.`;
        if (totalExpenses > totalIncome * 0.8) { // If expenses are high
          response += " It seems your expenses are quite high relative to your income. Let's identify areas in your spending analysis where you can cut back.";
        }
      } else {
        response += " Tracking your income and expenses is the first step to understanding where your money is going. Start by recording all your transactions!";
      }
      return response;
    } else if (lowerCaseMessage.includes("save money") || lowerCaseMessage.includes("saving tips") || lowerCaseMessage.includes("how to save") || lowerCaseMessage.includes("increase savings")) {
      const savingsRate = getSavingsRate();
      let response = "To save effectively, set clear financial goals (e.g., emergency fund, down payment), automate your savings by setting up recurring transfers, cut unnecessary expenses, and review your subscriptions regularly.";
      response += ` Your current savings rate is ${savingsRate.toFixed(2)}%.`;
      if (savingsRate < 15 && savingsRate >= 0) {
        response += " Consider increasing your automated transfers or finding areas to reduce spending to boost this rate. Even small, consistent savings add up over time!";
      } else if (savingsRate < 0) {
        response += " Currently, your spending exceeds your income. Focusing on reducing expenses is the first step to start saving.";
      } else {
        response += " That's a great savings rate! Keep it up and consider reviewing your investment options to make your savings work harder.";
      }
      return response;
    } else if (lowerCaseMessage.includes("investing for beginners") || lowerCaseMessage.includes("how to start investing") || lowerCaseMessage.includes("investment advice") || lowerCaseMessage.includes("where to invest")) {
      let response = "Starting to invest can be exciting! First, ensure you have an emergency fund. Then, understand your risk tolerance. Consider diversified options like low-cost index funds or ETFs. Start small, invest regularly, and continuously educate yourself.";
      if (balance > 50000) { // More specific advice for higher balance
        response += ` With your current balance of ₹${balance.toFixed(2)}, you have significant capital to begin. The Analytics & Investments page offers some recommendations tailored for Indian markets, including options like Nifty 50 Index Funds or Government Bonds.`;
      } else if (balance > 10000) {
        response += ` With ₹${balance.toFixed(2)}, you have a good starting point. Focus on consistent, small investments.`;
      } else {
        response += ` Building up your balance (currently ₹${balance.toFixed(2)}) and establishing an emergency fund should be your priority before significant investments.`;
      }
      return response;
    } else if (lowerCaseMessage.includes("what are stocks") || lowerCaseMessage.includes("stocks explained") || lowerCaseMessage.includes("equity")) {
      return "Stocks represent ownership shares in a company. When you buy a stock, you own a small piece of that company. Their value can fluctuate based on company performance, industry trends, and overall market conditions. They offer potential for high returns but also come with higher risk.";
    } else if (lowerCaseMessage.includes("what are mutual funds") || lowerCaseMessage.includes("mutual funds explained") || lowerCaseMessage.includes("sip")) {
      return "Mutual funds pool money from many investors to invest in a diversified portfolio of stocks, bonds, or other securities. They are managed by professional fund managers, offering diversification and professional management for a fee. They are a popular option for systematic investment plans (SIPs).";
    } else if (lowerCaseMessage.includes("debt management") || lowerCaseMessage.includes("pay off debt") || lowerCaseMessage.includes("handle debt") || lowerCaseMessage.includes("reduce debt")) {
      const totalExpenses = getTotalExpenses();
      let response = "Effective debt management involves prioritizing high-interest debts first. Strategies like the debt snowball (pay smallest debt first) or debt avalanche (pay highest interest debt first) can be helpful. Creating a strict budget and avoiding new debt are also key.";
      if (totalExpenses > getTotalIncome()) {
        response += " Given your current expenses exceeding income, focusing on debt reduction and avoiding new debt is critical. Review your spending to free up funds for repayments.";
      }
      return response;
    } else if (lowerCaseMessage.includes("emergency fund")) {
      const monthlyExpensesData = getMonthlyExpensesData(3); // Get last 3 months of expense data
      const averageMonthlyExpenses = monthlyExpensesData.length > 0
        ? monthlyExpensesData.reduce((sum, month) => sum + month.totalExpenses, 0) / monthlyExpensesData.length
        : 0;

      let response = "An emergency fund is a crucial safety net! It's typically 3-6 months' worth of living expenses saved in an easily accessible, separate account.";
      if (averageMonthlyExpenses > 0) {
        const emergencyFundTargetMin = averageMonthlyExpenses * 3;
        const emergencyFundTargetMax = averageMonthlyExpenses * 6;
        response += ` If your average monthly expenses are around ₹${averageMonthlyExpenses.toFixed(2)}, you should aim for an emergency fund of ₹${emergencyFundTargetMin.toFixed(2)} to ₹${emergencyFundTargetMax.toFixed(2)}. Your current balance is ₹${balance.toFixed(2)}. How close are you to this goal?`;
        if (balance < emergencyFundTargetMin) {
          response += " You're currently below your recommended emergency fund target. Prioritize building this fund before other investments.";
        } else if (balance >= emergencyFundTargetMax) {
          response += " You have a solid emergency fund! Now you can confidently explore other investment opportunities.";
        }
      } else {
        response += " Start by tracking your monthly expenses to determine a realistic target for your emergency fund. Once you have some transaction history, I can help you calculate a target.";
      }
      return response;
    } else if (lowerCaseMessage.includes("financial goals") || lowerCaseMessage.includes("set goals")) {
      const netSavings = getNetSavings();
      let response = "Setting financial goals is vital. Define short-term (e.g., saving for a gadget), medium-term (e.g., down payment), and long-term goals (e.g., retirement). Make them SMART: Specific, Measurable, Achievable, Relevant, and Time-bound.";
      if (netSavings > 0) {
        response += ` Your current net savings are ₹${netSavings.toFixed(2)}, which is a great start towards achieving your goals! Keep track of your progress.`;
      } else {
        response += ` Focus on increasing your savings to reach your financial goals faster. Review your budget to find extra funds.`;
      }
      return response;
    } else if (lowerCaseMessage.includes("retirement planning") || lowerCaseMessage.includes("plan for retirement")) {
      return "Retirement planning involves setting aside money over many years to ensure financial security in your later life. It often includes contributions to retirement accounts like provident funds, mutual funds, and other long-term investments. Start early and contribute consistently to benefit from compounding!";
    } else if (lowerCaseMessage.includes("credit score") || lowerCaseMessage.includes("cibil")) {
      return "Your CIBIL score (or credit score) is a three-digit number that reflects your creditworthiness. A higher score (typically 750+) makes it easier to get loans and credit cards with favorable terms. Pay bills on time, keep credit utilization low, and avoid opening too many new accounts to improve it.";
    } else if (lowerCaseMessage.includes("diversification") || lowerCaseMessage.includes("diversify investments")) {
      return "Diversification is spreading your investments across various assets (like stocks, bonds, real estate, gold) to reduce risk. The idea is that if one asset performs poorly, others might perform well, balancing out your portfolio. It's a cornerstone of smart investing!";
    } else if (lowerCaseMessage.includes("risk tolerance") || lowerCaseMessage.includes("investment risk")) {
      return "Risk tolerance is your ability and willingness to take on financial risk. It's crucial for investing. A high risk tolerance might mean you're comfortable with volatile assets like stocks, while a low tolerance might lead you towards safer options like bonds. Understand yours before investing!";
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