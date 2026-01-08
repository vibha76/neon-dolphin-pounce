// Mock AI service for FinAssist
// This file provides simulated AI responses based on the user's financial data

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
      return this.generateResponse(message, context);
    } catch (error: any) {
      console.error('AI Service Error:', error);
      return `Sorry, I encountered an error: ${error.message}. Please try again.`;
    }
  }

  private generateResponse(message: string, context: AIContext): string {
    const lowerCaseMessage = message.toLowerCase();
    
    // Handle greetings
    if (this.isGreeting(lowerCaseMessage)) {
      const name = context.userProfile?.name || "there";
      return `Hello ${name}! I'm your FinAssist AI. How can I help you manage your finances today?`;
    }
    
    // Handle balance inquiries
    if (this.isBalanceQuery(lowerCaseMessage)) {
      return `Your current account balance is ₹${context.balance.toFixed(2)}. 
              Your total income is ₹${context.totalIncome.toFixed(2)} and your total expenses are ₹${context.totalExpenses.toFixed(2)}. 
              Your net savings are ₹${context.netSavings.toFixed(2)} (${context.savingsRate.toFixed(2)}% savings rate).`;
    }
    
    // Handle spending analysis
    if (this.isSpendingQuery(lowerCaseMessage)) {
      const categories = context.spendingCategories;
      if (Object.keys(categories).length === 0) {
        return "You haven't recorded any spending yet. Make some transactions to see your spending analysis!";
      }
      
      const sortedCategories = Object.entries(categories)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);
      
      let response = "Here's your spending breakdown:\n";
      sortedCategories.forEach(([category, amount], index) => {
        response += `${index + 1}. ${category}: ₹${amount.toFixed(2)}\n`;
      });
      
      return response;
    }
    
    // Handle savings advice
    if (this.isSavingsQuery(lowerCaseMessage)) {
      if (context.savingsRate >= 20) {
        return "Great job! You're saving well. Consider investing in mutual funds for better returns.";
      } else if (context.savingsRate >= 10) {
        return "You're saving a decent amount. Try to increase your savings rate to 20% for financial security.";
      } else {
        return "Your savings rate is a bit low. Try to cut unnecessary expenses and increase your savings to at least 10% of your income.";
      }
    }
    
    // Handle investment advice
    if (this.isInvestmentQuery(lowerCaseMessage)) {
      if (context.balance < 10000) {
        return "Before investing, build an emergency fund of at least ₹50,000. Focus on saving more first.";
      } else if (context.balance < 100000) {
        return "With your balance, consider starting with low-risk investments like fixed deposits or debt mutual funds.";
      } else {
        return "You're in a good position to invest! Consider a mix of equity and debt mutual funds based on your risk tolerance.";
      }
    }
    
    // Handle loan advice
    if (this.isLoanQuery(lowerCaseMessage)) {
      if (context.netSavings < 0) {
        return "Your expenses are currently higher than your income. It's not advisable to take a loan right now. Focus on reducing expenses.";
      } else {
        const expenseToIncomeRatio = context.totalExpenses / (context.totalIncome || 1);
        if (expenseToIncomeRatio > 0.7) {
          return "Your expenses are quite high relative to your income. If you need a loan, ensure your EMI doesn't exceed 30% of your income.";
        } else {
          return "You have a healthy financial position. You could consider a loan if needed, but ensure your EMI doesn't exceed 30% of your income.";
        }
      }
    }
    
    // Default response
    return this.getDefaultResponse(message, context);
  }

  private isGreeting(message: string): boolean {
    const greetings = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"];
    return greetings.some(greeting => message.includes(greeting));
  }

  private isBalanceQuery(message: string): boolean {
    const balanceQueries = ["balance", "account", "money", "funds", "cash"];
    return balanceQueries.some(query => message.includes(query));
  }

  private isSpendingQuery(message: string): boolean {
    const spendingQueries = ["spending", "categories", "where", "expenses", "analysis", "spent"];
    return spendingQueries.some(query => message.includes(query));
  }

  private isSavingsQuery(message: string): boolean {
    const savingsQueries = ["save", "savings", "rate", "emergency fund"];
    return savingsQueries.some(query => message.includes(query));
  }

  private isInvestmentQuery(message: string): boolean {
    const investmentQueries = ["invest", "investment", "portfolio", "stocks", "mutual funds", "returns"];
    return investmentQueries.some(query => message.includes(query));
  }

  private isLoanQuery(message: string): boolean {
    const loanQueries = ["loan", "borrow", "emi", "credit", "debt"];
    return loanQueries.some(query => message.includes(query));
  }

  private getDefaultResponse(message: string, context: AIContext): string {
    const responses = [
      `Based on your financial data, I can help you with budgeting, saving, investing, and loan advice. What specific aspect of your finances would you like to discuss?`,
      `I see you're asking about "${message}". I can provide personalized advice based on your balance of ₹${context.balance.toFixed(2)} and your spending patterns. What would you like to know?`,
      `With a savings rate of ${context.savingsRate.toFixed(2)}%, I can help you optimize your finances. Would you like tips on increasing your savings or investment advice?`,
      `I'm here to help with your financial questions. You can ask me about your balance, spending habits, savings strategies, or investment options.`
    ];
    
    // Return a random response
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Export a singleton instance
export const aiService = new AIService();