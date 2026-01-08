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
    } else if (lowerCaseMessage.includes("total income") || lowerCaseMessage.includes("earnings") || lowerCaseMessage.includes("how much i earned")) {
      const totalIncome = getTotalIncome();
      return `Your total recorded income is ₹${totalIncome.toFixed(2)}. This includes all deposits and incoming transfers. Understanding your income helps in planning your budget!`;
    } else if (lowerCaseMessage.includes("total expenses") || lowerCaseMessage.includes("my spending") || lowerCaseMessage.includes("expenditure") || lowerCaseMessage.includes("how much i spent")) {
      const totalExpenses = getTotalExpenses();
      return `Your total recorded expenses are ₹${totalExpenses.toFixed(2)}. This includes withdrawals and outgoing transfers. Knowing your expenses is key to finding saving opportunities.`;
    } else if (lowerCaseMessage.includes("net savings") || lowerCaseMessage.includes("how much i saved") || lowerCaseMessage.includes("my savings")) {
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
    else if (lowerCaseMessage.includes("spending analysis") || lowerCaseMessage.includes("where does my money go") || lowerCaseMessage.includes("spending categories") || lowerCaseMessage.includes("expense breakdown") || lowerCaseMessage.includes("my expenses by category")) {
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
    else if (lowerCaseMessage.includes("transactions") || lowerCaseMessage.includes("transaction history") || lowerCaseMessage.includes("recent activity") || lowerCaseMessage.includes("money movement") || lowerCaseMessage.includes("view transactions")) {
      return "To view your complete transaction history or make new deposits, withdrawals, or transfers, please visit the Transactions page. I can navigate you there if you like.";
    } else if (lowerCaseMessage.includes("deposit money") || lowerCaseMessage.includes("add funds") || lowerCaseMessage.includes("make a deposit")) {
      return "You can deposit funds into your account from the Transactions page. Just specify the amount and a description. It's a great way to increase your balance!";
    } else if (lowerCaseMessage.includes("withdraw money") || lowerCaseMessage.includes("take out money") || lowerCaseMessage.includes("make a withdrawal")) {
      return "To withdraw money, go to the Transactions page, enter the amount, and a description. Remember to maintain sufficient balance for your needs!";
    } else if (lowerCaseMessage.includes("transfer money") || lowerCaseMessage.includes("send money") || lowerCaseMessage.includes("make a transfer")) {
      return "You can transfer funds to other registered users from the Transactions page. You'll need their mobile number and the amount. It's a quick way to send money to friends or family!";
    }

    // --- Loan Assessment ---
    else if (lowerCaseMessage.includes("loan") || lowerCaseMessage.includes("loan eligibility") || lowerCaseMessage.includes("fraud detection") || lowerCaseMessage.includes("borrow money") || lowerCaseMessage.includes("apply for loan")) {
      return "If you need to assess loan eligibility or detect potential fraud, head over to the Loan Assessment page. There, you can input various details to get an assessment. Understanding your loan options is important!";
    }

    // --- Investments & Analytics ---
    else if (lowerCaseMessage.includes("investments") || lowerCaseMessage.includes("analytics") || lowerCaseMessage.includes("financial insights") || lowerCaseMessage.includes("grow my money") || lowerCaseMessage.includes("investment options") || lowerCaseMessage.includes("where to invest") || lowerCaseMessage.includes("how to invest") || lowerCaseMessage.includes("investment advice") || lowerCaseMessage.includes("portfolio")) {
      const monthlyExpensesData = getMonthlyExpensesData(3);
      const averageMonthlyExpenses = monthlyExpensesData.length > 0
        ? monthlyExpensesData.reduce((sum, month) => sum + month.totalExpenses, 0) / monthlyExpensesData.length
        : 0;
      const emergencyFundTargetMin = averageMonthlyExpenses * 3;
      const emergencyFundTargetMax = averageMonthlyExpenses * 6;

      let response = `I can certainly help you with investment guidance, ${userProfile.name}!\n\n`;

      if (averageMonthlyExpenses > 0 && balance < emergencyFundTargetMin) {
        response += `Before diving into investments, it's crucial to build a solid emergency fund. Based on your average monthly expenses of ₹${averageMonthlyExpenses.toFixed(2)}, you should aim for an emergency fund of ₹${emergencyFundTargetMin.toFixed(2)} to ₹${emergencyFundTargetMax.toFixed(2)}. Your current balance is ₹${balance.toFixed(2)}. Let's focus on reaching that first!\n\n`;
        response += `Once your emergency fund is secure, we can explore investment opportunities. Would you like tips on how to save for your emergency fund?`;
      } else {
        response += `Great news! With your current balance of ₹${balance.toFixed(2)}, you're in a good position to consider growing your wealth through investments. Here's a general guide on different investment types and a recommended allocation strategy:\n\n`;
        response += `**Recommended Investment Allocation (based on your current balance):**\n`;
        response += `1. **Emergency Fund (Very Low Risk, 5-7% p.a. returns, Short-term, Liquid)**: Ensure you have this covered. Your current balance is ₹${balance.toFixed(2)}.\n`;
        response += `2. **Equity Mutual Funds (Moderate Risk, 10-14% p.a. returns, Time: 3-7+ years)**: Consider allocating around 40% of your investable surplus. This would be approximately ₹${(balance * 0.4).toFixed(2)}.\n`;
        response += `3. **Blue-chip Equity Stocks (Moderate to High Risk, 10-18% p.a. returns, Time: 5+ years)**: For higher risk tolerance, a smaller portion, say 20%, which is about ₹${(balance * 0.2).toFixed(2)}.\n`;
        response += `4. **Debt Mutual Funds/Government Bonds (Low Risk, 7-9% p.a. returns, Time: 1-5 years)**: For stability, about 20%, or ₹${(balance * 0.2).toFixed(2)}.\n`;
        response += `5. **Gold (Low to Moderate Risk, 8-10% p.a. returns, Time: 3-5+ years)**: A small allocation of 10%, or ₹${(balance * 0.1).toFixed(2)}, is often recommended as a hedge.\n\n`;
        response += `Remember to diversify and align investments with your personal risk tolerance and financial goals. You can find more visual insights and opportunities on the Analytics & Investments page. Would you like me to navigate you there?`;
      }
      return response;
    }

    // --- General Financial Planning & Goals ---
    else if (lowerCaseMessage.includes("budgeting tips") || lowerCaseMessage.includes("how to budget") || lowerCaseMessage.includes("create a budget") || lowerCaseMessage.includes("manage my money") || lowerCaseMessage.includes("financial planning") || lowerCaseMessage.includes("wealth management") || lowerCaseMessage.includes("financial advice")) {
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
      response += "\n\nFor more detailed financial planning and insights, I recommend visiting the Analytics & Investments page.";
      return response;
    } else if (lowerCaseMessage.includes("save money") || lowerCaseMessage.includes("saving tips") || lowerCaseMessage.includes("how to save") || lowerCaseMessage.includes("increase savings")) {
      const savingsRate = getSavingsRate();
      const monthlyExpensesData = getMonthlyExpensesData(3);
      const averageMonthlyExpenses = monthlyExpensesData.length > 0
        ? monthlyExpensesData.reduce((sum, month) => sum + month.totalExpenses, 0) / monthlyExpensesData.length
        : 0;

      let response = `Saving is a cornerstone of financial security, ${userProfile.name}!\n\n`;
      response += `Your current savings rate is ${savingsRate.toFixed(2)}%. Financial experts often recommend aiming for 15-20% or more of your income for long-term goals.\n\n`;

      if (averageMonthlyExpenses > 0) {
        const emergencyFundTargetMin = averageMonthlyExpenses * 3;
        const emergencyFundTargetMax = averageMonthlyExpenses * 6;
        response += `**Emergency Fund Goal:**\n`;
        response += `Based on your average monthly expenses of ₹${averageMonthlyExpenses.toFixed(2)}, a 3-6 month emergency fund would be between ₹${emergencyFundTargetMin.toFixed(2)} and ₹${emergencyFundTargetMax.toFixed(2)}. Your current balance is ₹${balance.toFixed(2)}.\n\n`;

        if (balance < emergencyFundTargetMin) {
          const needed = emergencyFundTargetMin - balance;
          response += `You're currently below your recommended emergency fund target. Prioritize building this fund! Try to save an additional ₹${needed.toFixed(2)} to reach the minimum. Consider setting up automated transfers to your savings and identifying areas to cut back on non-essential spending.\n`;
        } else if (balance >= emergencyFundTargetMax) {
          response += `You have a solid emergency fund! This is excellent. Now you can confidently explore other investment opportunities to make your money grow further.\n`;
        } else { // Between min and max
          response += `You're on your way to a strong emergency fund! Keep building it up. You have ₹${(emergencyFundTargetMax - balance).toFixed(2)} more to save to reach the upper end of the recommendation.\n`;
        }
      } else {
        response += "To set an emergency fund target, we need more data on your monthly expenses. Start by consistently recording your withdrawals and transfers in the Transactions page.\n";
      }

      if (savingsRate < 15 && savingsRate >= 0) {
        response += `\nTo boost your savings rate, consider increasing your automated transfers or finding areas to reduce spending. Even small, consistent savings add up over time!`;
      } else if (savingsRate < 0) {
        response += `\nCurrently, your spending exceeds your income. Focusing on reducing expenses is the first step to start saving. Review your spending analysis on the Dashboard to find areas to cut back.`;
      } else {
        response += `\nThat's a great savings rate! Keep it up and consider reviewing your investment options to make your savings work harder.`;
      }
      return response;
    }

    // --- What are Stocks/Mutual Funds (detailed) ---
    else if (lowerCaseMessage.includes("what are stocks") || lowerCaseMessage.includes("stocks explained") || lowerCaseMessage.includes("equity")) {
      return "Stocks represent ownership shares in a company. When you buy a stock, you own a small piece of that company. Their value can fluctuate based on company performance, industry trends, and overall market conditions. They offer potential for high returns (e.g., 10-18% p.a. for blue-chip stocks) but also come with higher risk and are generally suitable for a long-term investment horizon (5+ years).";
    } else if (lowerCaseMessage.includes("what are mutual funds") || lowerCaseMessage.includes("mutual funds explained") || lowerCaseMessage.includes("sip")) {
      return "Mutual funds pool money from many investors to invest in a diversified portfolio of stocks, bonds, or other securities. They are managed by professional fund managers, offering diversification and professional management for a fee. They are a popular option for systematic investment plans (SIPs) and can offer moderate returns (e.g., 10-14% p.a. for equity MFs) with moderate risk over a medium to long-term horizon (3-7 years).";
    }

    // --- Debt Management ---
    else if (lowerCaseMessage.includes("debt management") || lowerCaseMessage.includes("pay off debt") || lowerCaseMessage.includes("handle debt") || lowerCaseMessage.includes("reduce debt")) {
      const totalExpenses = getTotalExpenses();
      let response = "Effective debt management involves prioritizing high-interest debts first. Strategies like the debt snowball (pay smallest debt first) or debt avalanche (pay highest interest debt first) can be helpful. Creating a strict budget and avoiding new debt are also key.";
      if (totalExpenses > getTotalIncome()) {
        response += " Given your current expenses exceeding income, focusing on debt reduction and avoiding new debt is critical. Review your spending to free up funds for repayments.";
      }
      return response;
    } else if (lowerCaseMessage.includes("financial goals") || lowerCaseMessage.includes("set goals") || lowerCaseMessage.includes("my goals")) {
      const netSavings = getNetSavings();
      let response = "Setting financial goals is vital. Define short-term (e.g., saving for a gadget), medium-term (e.g., down payment), and long-term goals (e.g., retirement). Make them SMART: Specific, Measurable, Achievable, Relevant, and Time-bound.";
      if (netSavings > 0) {
        response += ` Your current net savings are ₹${netSavings.toFixed(2)}, which is a great start towards achieving your goals! Keep track of your progress.`;
      } else {
        response += ` Focus on increasing your savings to reach your financial goals faster. Review your budget to find extra funds.`;
      }
      response += "\n\nFor more insights on financial planning and goal setting, check out the Analytics & Investments page.";
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

    // --- Improved Fallback / Unrecognized Query ---
    else {
      return "I'm not sure how to answer that specific question, but I can help with common financial topics like your balance, transactions, loans, investments, budgeting, saving, debt, and financial goals. You can also ask me to 'navigate to dashboard' or other pages. Please try rephrasing your question or ask about one of these topics!";
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