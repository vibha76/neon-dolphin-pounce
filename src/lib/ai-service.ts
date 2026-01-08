// Advanced mock AI service for FinAssist
// This file provides sophisticated AI responses based on the user's financial data with natural language processing

export interface AIContext {
  userProfile: {
    name: string;
    mobile: string;
    balance: number;
    email: string;
  } | null;
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  spendingCategories: Record<string, number>;
  recentTransactions: any[];
  monthlyIncomeData: { name: string; totalIncome: number }[];
  monthlyExpensesData: { name: string; totalExpenses: number }[];
}

export interface AIChatMessage {
  role: 'user' | 'model';
  parts: Array<{
    text: string;
  }>;
}

export class AIService {
  public isConfigured(): boolean {
    // Always return true for mock service
    return true;
  }

  public async sendMessage(
    message: string,
    context: AIContext,
    conversationHistory: AIChatMessage[] = []
  ): Promise<string> {
    try {
      // Simulate a delay to mimic API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate a response based on the message and context
      return this.generateResponse(message, context, conversationHistory);
    } catch (error: any) {
      console.error('AI Service Error:', error);
      return `Sorry, I encountered an error: ${error.message}. Please try again.`;
    }
  }

  private generateResponse(message: string, context: AIContext, conversationHistory: AIChatMessage[]): string {
    const lowerCaseMessage = message.toLowerCase();
    
    // Handle greetings
    if (this.isGreeting(lowerCaseMessage)) {
      const name = context.userProfile?.name || "there";
      return `Hello ${name}! I'm your FinAssist AI, your personal financial advisor. I can help you with budgeting, saving, investing, and loan advice. What would you like to discuss today?`;
    }
    
    // Handle goodbye
    if (this.isGoodbye(lowerCaseMessage)) {
      return "Goodbye! Feel free to reach out anytime if you have more financial questions. Have a great day!";
    }
    
    // Handle thanks
    if (this.isThanks(lowerCaseMessage)) {
      return "You're welcome! I'm here to help you achieve your financial goals. Is there anything else I can assist you with?";
    }
    
    // Handle balance inquiries
    if (this.isBalanceQuery(lowerCaseMessage)) {
      return this.handleBalanceQuery(context);
    }
    
    // Handle spending analysis
    if (this.isSpendingQuery(lowerCaseMessage)) {
      return this.handleSpendingQuery(context);
    }
    
    // Handle savings advice
    if (this.isSavingsQuery(lowerCaseMessage)) {
      return this.handleSavingsQuery(context);
    }
    
    // Handle investment advice
    if (this.isInvestmentQuery(lowerCaseMessage)) {
      return this.handleInvestmentQuery(context);
    }
    
    // Handle loan advice
    if (this.isLoanQuery(lowerCaseMessage)) {
      return this.handleLoanQuery(context);
    }
    
    // Handle budget advice
    if (this.isBudgetQuery(lowerCaseMessage)) {
      return this.handleBudgetQuery(context);
    }
    
    // Handle debt advice
    if (this.isDebtQuery(lowerCaseMessage)) {
      return this.handleDebtQuery(context);
    }
    
    // Handle emergency fund advice
    if (this.isEmergencyFundQuery(lowerCaseMessage)) {
      return this.handleEmergencyFundQuery(context);
    }
    
    // Handle retirement planning
    if (this.isRetirementQuery(lowerCaseMessage)) {
      return this.handleRetirementQuery(context);
    }
    
    // Handle tax advice
    if (this.isTaxQuery(lowerCaseMessage)) {
      return this.handleTaxQuery(context);
    }
    
    // Handle financial goal planning
    if (this.isGoalQuery(lowerCaseMessage)) {
      return this.handleGoalQuery(context);
    }
    
    // Handle transaction history
    if (this.isTransactionQuery(lowerCaseMessage)) {
      return this.handleTransactionQuery(context);
    }
    
    // Handle navigation requests
    if (this.isNavigationQuery(lowerCaseMessage)) {
      return this.handleNavigationQuery(lowerCaseMessage);
    }
    
    // Default response with context awareness
    return this.getDefaultResponse(message, context, conversationHistory);
  }

  private isGreeting(message: string): boolean {
    const greetings = [
      "hello", "hi", "hey", "good morning", "good afternoon", "good evening",
      "greetings", "hola", "namaste", "what's up", "howdy"
    ];
    return greetings.some(greeting => message.includes(greeting));
  }

  private isGoodbye(message: string): boolean {
    const goodbyes = [
      "bye", "goodbye", "see you", "farewell", "later", "catch you later",
      "take care", "adios", "ciao"
    ];
    return goodbyes.some(goodbye => message.includes(goodbye));
  }

  private isThanks(message: string): boolean {
    const thanks = [
      "thank you", "thanks", "appreciate", "grateful", "thankful"
    ];
    return thanks.some(thank => message.includes(thank));
  }

  private isBalanceQuery(message: string): boolean {
    const balanceQueries = [
      "balance", "account", "money", "funds", "cash", "current amount",
      "how much", "what is my", "check my", "view my"
    ];
    return balanceQueries.some(query => message.includes(query));
  }

  private isSpendingQuery(message: string): boolean {
    const spendingQueries = [
      "spending", "categories", "where", "expenses", "analysis", "spent",
      "expenditure", "transactions", "breakdown", "pattern"
    ];
    return spendingQueries.some(query => message.includes(query));
  }

  private isSavingsQuery(message: string): boolean {
    const savingsQueries = [
      "save", "savings", "rate", "emergency fund", "accumulate",
      "put aside", "stash", "reserve"
    ];
    return savingsQueries.some(query => message.includes(query));
  }

  private isInvestmentQuery(message: string): boolean {
    const investmentQueries = [
      "invest", "investment", "portfolio", "stocks", "mutual funds",
      "returns", "sip", "fd", "fixed deposit", "shares", "equity",
      "debt", "bonds", "nps", "ppf"
    ];
    return investmentQueries.some(query => message.includes(query));
  }

  private isLoanQuery(message: string): boolean {
    const loanQueries = [
      "loan", "borrow", "emi", "credit", "debt", "mortgage",
      "personal loan", "home loan", "car loan", "education loan",
      "eligibility", "interest rate"
    ];
    return loanQueries.some(query => message.includes(query));
  }

  private isBudgetQuery(message: string): boolean {
    const budgetQueries = [
      "budget", "plan", "allocate", "manage", "control", "limit",
      "monthly budget", "spending plan", "financial plan"
    ];
    return budgetQueries.some(query => message.includes(query));
  }

  private isDebtQuery(message: string): boolean {
    const debtQueries = [
      "debt", "owe", "credit card", "loan", "repay", "pay off",
      "debt consolidation", "reduce debt", "clear debt"
    ];
    return debtQueries.some(query => message.includes(query));
  }

  private isEmergencyFundQuery(message: string): boolean {
    const emergencyQueries = [
      "emergency", "fund", "rainy day", "unexpected", "financial cushion",
      "safety net", "backup", "contingency"
    ];
    return emergencyQueries.some(query => message.includes(query));
  }

  private isRetirementQuery(message: string): boolean {
    const retirementQueries = [
      "retire", "retirement", "pension", "nps", "ppf", "epf",
      "long term", "future", "old age", "golden years"
    ];
    return retirementQueries.some(query => message.includes(query));
  }

  private isTaxQuery(message: string): boolean {
    const taxQueries = [
      "tax", "income tax", "itr", "deduction", "exemption",
      "tax saving", "80c", "80d", "tax planning"
    ];
    return taxQueries.some(query => message.includes(query));
  }

  private isGoalQuery(message: string): boolean {
    const goalQueries = [
      "goal", "target", "objective", "aim", "plan to", "want to",
      "save for", "buy", "purchase", "vacation", "house", "car"
    ];
    return goalQueries.some(query => message.includes(query));
  }

  private isTransactionQuery(message: string): boolean {
    const transactionQueries = [
      "transaction", "history", "recent", "last", "previous",
      "activity", "statement", "record"
    ];
    return transactionQueries.some(query => message.includes(query));
  }

  private isNavigationQuery(message: string): boolean {
    const navigationQueries = [
      "go to", "navigate", "take me", "show me", "open", "visit"
    ];
    return navigationQueries.some(query => message.includes(query));
  }

  private handleBalanceQuery(context: AIContext): string {
    const name = context.userProfile?.name || "User";
    return `Hello ${name}! Here's your current financial status:
    
💰 Current Balance: ₹${context.balance.toFixed(2)}

📊 Financial Summary:
• Total Income: ₹${context.totalIncome.toFixed(2)}
• Total Expenses: ₹${context.totalExpenses.toFixed(2)}
• Net Savings: ₹${context.netSavings.toFixed(2)}
• Savings Rate: ${context.savingsRate.toFixed(2)}%

Would you like me to analyze your spending patterns or provide advice on improving your savings?`;
  }

  private handleSpendingQuery(context: AIContext): string {
    const categories = context.spendingCategories;
    if (Object.keys(categories).length === 0) {
      return "You haven't recorded any spending yet. Make some transactions to see your spending analysis!";
    }
    
    const sortedCategories = Object.entries(categories)
      .sort(([, a], [, b]) => b - a);
    
    const totalSpending = Object.values(categories).reduce((sum, value) => sum + value, 0);
    
    let response = `Here's your spending breakdown (Total: ₹${totalSpending.toFixed(2)}):\n\n`;
    
    sortedCategories.forEach(([category, amount], index) => {
      const percentage = ((amount / totalSpending) * 100).toFixed(1);
      response += `${index + 1}. ${category}: ₹${amount.toFixed(2)} (${percentage}%)\n`;
    });
    
    // Provide insights
    if (sortedCategories.length > 0) {
      const highestCategory = sortedCategories[0][0];
      const highestAmount = sortedCategories[0][1];
      const highestPercentage = ((highestAmount / totalSpending) * 100).toFixed(1);
      
      response += `\n💡 Insight: Your highest spending category is "${highestCategory}" at ₹${highestAmount.toFixed(2)} (${highestPercentage}% of total spending).`;
      
      if (parseFloat(highestPercentage) > 30) {
        response += ` Consider reviewing this category for potential savings opportunities.`;
      }
    }
    
    return response;
  }

  private handleSavingsQuery(context: AIContext): string {
    if (context.savingsRate >= 20) {
      return `Excellent savings rate of ${context.savingsRate.toFixed(2)}%! 🎉
      
You're doing a fantastic job saving. Here are some suggestions:
1. Consider investing in mutual funds for better returns
2. Look into tax-saving instruments under Section 80C
3. Maintain your emergency fund at 6 months of expenses
4. Start planning for long-term goals like retirement

Would you like specific investment recommendations?`;
    } else if (context.savingsRate >= 10) {
      return `Good savings rate of ${context.savingsRate.toFixed(2)}%! 👍
      
You're saving a decent amount. To improve further:
1. Try to increase your savings rate to 20% for financial security
2. Automate your savings to ensure consistency
3. Review your spending categories to identify savings opportunities
4. Consider setting specific savings goals

Would you like help creating a budget to increase your savings?`;
    } else {
      return `Your savings rate is ${context.savingsRate.toFixed(2)}%, which is a bit low. Here's how to improve:
      
1. Track your expenses to understand where your money goes
2. Create a budget with specific spending limits
3. Automate transfers to savings accounts
4. Cut unnecessary subscriptions or dining expenses
5. Set specific savings goals to stay motivated

Would you like me to help you create a personalized budget plan?`;
    }
  }

  private handleInvestmentQuery(context: AIContext): string {
    if (context.balance < 10000) {
      return `Before investing, it's important to build an emergency fund first. Here's my recommendation:
      
1. Build an emergency fund of at least ₹50,000 (or 3-6 months of expenses)
2. Focus on saving more first
3. Once you have sufficient emergency funds, consider starting with:
   • Fixed Deposits (FDs) for guaranteed returns
   • Liquid funds for better liquidity than FDs

Would you like advice on building your emergency fund?`;
    } else if (context.balance < 100000) {
      return `With your balance, you're ready to start investing! Here are some suitable options:
      
1. Start with low-risk investments:
   • Fixed Deposits (FDs) - 6-7% returns
   • Debt Mutual Funds - 7-9% returns with better liquidity
   • Liquid Funds - For parking money temporarily

2. As you grow your corpus:
   • Balanced Mutual Funds (mix of equity & debt)
   • Systematic Investment Plans (SIPs) in equity funds

Would you like specific recommendations based on your risk profile?`;
    } else {
      return `You're in a great position to invest! Consider this allocation strategy:
      
1. Emergency Fund (10-15% of portfolio):
   • Keep 3-6 months of expenses in liquid funds/FDs

2. Debt Investments (20-30%):
   • Corporate Bond Funds
   • Banking & PSU Debt Funds

3. Equity Investments (50-70%):
   • Large-cap Index Funds (Nifty 50, Sensex)
   • Flexi-cap Funds for diversification
   • Mid-cap Funds for growth potential

Would you like me to explain any of these investment options in detail?`;
    }
  }

  private handleLoanQuery(context: AIContext): string {
    if (context.netSavings < 0) {
      return `⚠️ Financial Alert: Your expenses (₹${context.totalExpenses.toFixed(2)}) are currently higher than your income (₹${context.totalIncome.toFixed(2)}).
      
Taking a loan right now is not advisable. Focus on:
1. Reducing unnecessary expenses
2. Increasing income sources
3. Creating a positive cash flow

Would you like help identifying areas to cut expenses?`;
    } else {
      const expenseToIncomeRatio = context.totalExpenses / (context.totalIncome || 1);
      if (expenseToIncomeRatio > 0.7) {
        return `Your expenses are quite high relative to your income (${(expenseToIncomeRatio * 100).toFixed(1)}%).
        
If you need a loan, ensure your EMI doesn't exceed 30% of your income. Here's what to consider:
1. Calculate your exact EMI affordability
2. Compare interest rates from multiple lenders
3. Check your CIBIL score before applying
4. Consider secured loans for better rates

Would you like help calculating your loan eligibility?`;
      } else {
        return `You have a healthy financial position with ${(100 - expenseToIncomeRatio * 100).toFixed(1)}% of income available after expenses.
        
If considering a loan:
1. Ensure EMI doesn't exceed 30% of your income
2. Maintain emergency fund even after loan EMI
3. Compare lenders for best interest rates
4. Consider tax benefits (e.g., home loan interest deduction)

Would you like me to help calculate your loan eligibility or EMI?`;
      }
    }
  }

  private handleBudgetQuery(context: AIContext): string {
    const avgMonthlyIncome = context.monthlyIncomeData.length > 0 
      ? context.monthlyIncomeData.reduce((sum, month) => sum + month.totalIncome, 0) / context.monthlyIncomeData.length
      : 0;
    
    const avgMonthlyExpenses = context.monthlyExpensesData.length > 0
      ? context.monthlyExpensesData.reduce((sum, month) => sum + month.totalExpenses, 0) / context.monthlyExpensesData.length
      : 0;
    
    return `Here's a personalized budget plan based on your financial data:
    
💰 Average Monthly Income: ₹${avgMonthlyIncome.toFixed(2)}
💸 Average Monthly Expenses: ₹${avgMonthlyExpenses.toFixed(2)}
📊 Net Monthly Savings: ₹${(avgMonthlyIncome - avgMonthlyExpenses).toFixed(2)}

Recommended 50/30/20 Budget Allocation:
1. Needs (50%): ₹${(avgMonthlyIncome * 0.5).toFixed(2)}
   • Rent, utilities, groceries, transportation
2. Wants (30%): ₹${(avgMonthlyIncome * 0.3).toFixed(2)}
   • Dining, entertainment, shopping
3. Savings (20%): ₹${(avgMonthlyIncome * 0.2).toFixed(2)}
   • Emergency fund, investments, debt repayment

Would you like me to create a detailed monthly budget based on your spending categories?`;
  }

  private handleDebtQuery(context: AIContext): string {
    const totalDebt = context.recentTransactions
      .filter(t => t.type === "transfer_out" && t.description.toLowerCase().includes("loan"))
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (totalDebt > 0) {
      return `I see you have loan-related transactions. Here's how to manage debt effectively:
      
1. List all debts with interest rates
2. Prioritize high-interest debts (credit cards first)
3. Consider debt consolidation if you have multiple loans
4. Make more than minimum payments when possible
5. Avoid taking on new debt while repaying existing ones

Would you like help creating a debt repayment plan?`;
    } else {
      return `Great job! I don't see any loan-related transactions in your recent history.
      
To maintain a debt-free status:
1. Use credit cards responsibly (pay full amount each month)
2. Build an emergency fund to avoid borrowing for unexpected expenses
3. Save for big purchases instead of financing them
4. Monitor your credit report regularly

Would you like advice on maintaining good credit health?`;
    }
  }

  private handleEmergencyFundQuery(context: AIContext): string {
    const avgMonthlyExpenses = context.monthlyExpensesData.length > 0
      ? context.monthlyExpensesData.reduce((sum, month) => sum + month.totalExpenses, 0) / context.monthlyExpensesData.length
      : 0;
    
    const emergencyFundTarget = avgMonthlyExpenses * 6;
    const currentBalance = context.balance;
    
    if (currentBalance >= emergencyFundTarget) {
      return `🎉 Excellent! You have an adequate emergency fund.
      
Your emergency fund (₹${currentBalance.toFixed(2)}) covers ${(currentBalance / avgMonthlyExpenses).toFixed(1)} months of expenses, which exceeds the recommended 6-month buffer.
      
To maintain your emergency fund:
1. Keep it in liquid instruments (FDs, liquid funds)
2. Replenish after using it for emergencies
3. Review and adjust annually for inflation

Would you like advice on where to park your emergency fund for optimal liquidity?`;
    } else {
      const gap = emergencyFundTarget - currentBalance;
      return `It's important to build your emergency fund. Here's your situation:
      
🎯 Target Emergency Fund: ₹${emergencyFundTarget.toFixed(2)} (6 months of expenses)
💰 Current Balance: ₹${currentBalance.toFixed(2)}
📉 Gap: ₹${gap.toFixed(2)}

Steps to build your emergency fund:
1. Set aside a fixed amount monthly (e.g., 20% of income)
2. Automate transfers to a separate savings account
3. Start with a smaller target (1-3 months) and gradually increase
4. Keep funds in easily accessible instruments

Would you like help creating a monthly savings plan to reach your emergency fund goal?`;
    }
  }

  private handleRetirementQuery(context: AIContext): string {
    const age = 30; // Placeholder - in a real app, this would come from user profile
    const yearsToRetirement = 65 - age;
    const monthlySavingsNeeded = context.balance > 0 ? (10000000 / (yearsToRetirement * 12)) : 25000;
    
    return `Planning for retirement is crucial for long-term financial security. Here's a roadmap:
    
📅 Years to Retirement: ${yearsToRetirement} years
💰 Monthly Savings Needed: ₹${monthlySavingsNeeded.toFixed(2)} (for ₹1 crore corpus)
📈 With 10% annual returns: ₹${(monthlySavingsNeeded * yearsToRetirement * 12 * 1.1).toFixed(2)} corpus

Recommended Retirement Investments:
1. National Pension System (NPS) - Government-backed, tax benefits
2. Public Provident Fund (PPF) - 15-year lock-in, guaranteed returns
3. Equity Mutual Funds SIP - For long-term growth potential
4. Employer Provident Fund (EPF) - If applicable

Would you like me to calculate a personalized retirement corpus based on your lifestyle goals?`;
  }

  private handleTaxQuery(context: AIContext): string {
    const annualIncome = context.totalIncome * 12; // Approximation
    let taxBracket = "No tax";
    
    if (annualIncome > 1500000) {
      taxBracket = "30% tax bracket";
    } else if (annualIncome > 1250000) {
      taxBracket = "25% tax bracket";
    } else if (annualIncome > 1000000) {
      taxBracket = "20% tax bracket";
    } else if (annualIncome > 500000) {
      taxBracket = "10% tax bracket";
    } else if (annualIncome > 250000) {
      taxBracket = "5% tax bracket";
    }
    
    return `Based on your income pattern, you likely fall in the ${taxBracket}.
    
Tax-Saving Investment Options:
1. Section 80C (₹1.5 lakh limit):
   • Public Provident Fund (PPF)
   • National Savings Certificate (NSC)
   • Equity Linked Savings Scheme (ELSS)
   • Life Insurance Premiums
   • Tuition Fees for children

2. Section 80D (Medical Insurance):
   • Health insurance premiums (₹25,000/self, ₹50,000/senior citizen)

3. Section 80TTA (Interest Income):
   • Up to ₹10,000 on savings account interest

Would you like specific recommendations for tax-saving investments based on your profile?`;
  }

  private handleGoalQuery(context: AIContext): string {
    return `Setting financial goals is essential for financial success. Here's a framework:
    
🎯 SMART Goal Setting:
1. Specific: Define exactly what you want to achieve
2. Measurable: Assign a rupee value to your goal
3. Achievable: Ensure it aligns with your income
4. Relevant: Align with your values and priorities
5. Time-bound: Set a realistic timeline

Common Financial Goals:
1. Short-term (1-2 years): Emergency fund, vacation, gadget purchase
2. Medium-term (3-7 years): Home down payment, car purchase, education
3. Long-term (8+ years): Retirement, children's marriage, wealth creation

Would you like help setting a specific financial goal and creating a savings plan for it?`;
  }

  private handleTransactionQuery(context: AIContext): string {
    if (context.recentTransactions.length === 0) {
      return "You don't have any transactions recorded yet. Start by making deposits or recording expenses to see your transaction history.";
    }
    
    const recentTransactions = context.recentTransactions.slice(0, 5);
    let response = "Here are your recent transactions:\n\n";
    
    recentTransactions.forEach((tx, index) => {
      const typeSymbol = tx.type === "deposit" || tx.type === "transfer_in" ? "+" : "-";
      response += `${index + 1}. ${tx.description}: ${typeSymbol}₹${tx.amount.toFixed(2)}\n`;
    });
    
    response += "\nWould you like to see more transactions or analyze spending patterns?";
    return response;
  }

  private handleNavigationQuery(message: string): string {
    if (message.includes("dashboard")) {
      return "I can help you navigate to the Dashboard where you can see your balance, recent transactions, and spending analysis. Would you like me to explain what you can do on the Dashboard?";
    }
    
    if (message.includes("transaction")) {
      return "The Transactions page allows you to manage deposits, withdrawals, and transfers. You can also view your complete transaction history there. Would you like tips on managing transactions effectively?";
    }
    
    if (message.includes("loan")) {
      return "The Loan Assessment page helps you check loan eligibility and detect potential fraud. You can input your financial details to get a comprehensive loan analysis. Would you like to know what information you need for loan assessment?";
    }
    
    if (message.includes("analytics") || message.includes("investment")) {
      return "The Analytics & Investments page provides financial insights and investment recommendations based on your profile. You can explore different investment opportunities there. Would you like me to explain the features of this page?";
    }
    
    if (message.includes("profile")) {
      return "Your Profile page contains your personal and financial details. You can view and update your information there. Would you like to know what information is stored in your profile?";
    }
    
    return "I can help you navigate to different sections of the app. Where would you like to go?";
  }

  private getDefaultResponse(message: string, context: AIContext, conversationHistory: AIChatMessage[]): string {
    // Check if we've discussed a topic recently
    const lastBotMessage = conversationHistory.length > 0 
      ? conversationHistory[conversationHistory.length - 1] 
      : null;
    
    if (lastBotMessage && lastBotMessage.role === 'model') {
      return `Building on our previous discussion about "${lastBotMessage.parts[0].text.substring(0, 30)}...", ${this.getGeneralResponse(message, context)}`;
    }
    
    return this.getGeneralResponse(message, context);
  }

  private getGeneralResponse(message: string, context: AIContext): string {
    const responses = [
      `Based on your financial data (balance: ₹${context.balance.toFixed(2)}, savings rate: ${context.savingsRate.toFixed(2)}%), I can help you with budgeting, saving, investing, and loan advice. What specific aspect of your finances would you like to discuss?`,
      `I see you're asking about "${message}". I can provide personalized advice based on your balance of ₹${context.balance.toFixed(2)} and your spending patterns. What would you like to know?`,
      `With a savings rate of ${context.savingsRate.toFixed(2)}%, I can help you optimize your finances. Would you like tips on increasing your savings or investment advice?`,
      `I'm here to help with your financial questions. You can ask me about your balance, spending habits, savings strategies, investment options, loan eligibility, or tax planning. What's on your mind today?`,
      `As your financial assistant, I can help you with:
      1. Budget planning and expense tracking
      2. Savings strategies and emergency fund building
      3. Investment recommendations based on your risk profile
      4. Loan eligibility assessment
      5. Tax-saving investment options
      6. Retirement planning
      What area would you like to focus on?`
    ];
    
    // Return a random response
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Export a singleton instance
export const aiService = new AIService();