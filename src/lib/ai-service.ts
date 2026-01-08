// Placeholder for AI service integration
// This file will be expanded when connecting to actual AI services

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
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class AIService {
  private apiKey: string | null = null;
  private apiUrl: string = 'https://api.openai.com/v1/chat/completions';

  constructor(apiKey?: string) {
    if (apiKey) {
      this.apiKey = apiKey;
    }
  }

  public setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  public async sendMessage(
    message: string,
    context: AIContext,
    conversationHistory: AIChatMessage[] = []
  ): Promise<string> {
    // This is where we would implement the actual AI service integration
    // For now, we return a placeholder response
    
    if (!this.apiKey) {
      return "AI service is not configured. Please set up your API key to enable AI-powered financial advice.";
    }

    // In a real implementation, we would:
    // 1. Format the context data for the AI
    // 2. Prepare the conversation history
    // 3. Make an API call to the AI service
    // 4. Process and return the response
    
    return `This is a placeholder for an AI-generated response to: "${message}". In a future update, this will connect to an AI service to provide personalized financial advice based on your data.`;
  }

  private formatContextForAI(context: AIContext): string {
    return JSON.stringify({
      user: context.userProfile,
      balance: context.balance,
      totalIncome: context.totalIncome,
      totalExpenses: context.totalExpenses,
      netSavings: context.netSavings,
      savingsRate: context.savingsRate,
      spendingCategories: context.spendingCategories,
      recentTransactions: context.recentTransactions.map(t => ({
        type: t.type,
        amount: t.amount,
        description: t.description,
        date: t.date
      })),
      monthlyIncomeData: context.monthlyIncomeData,
      monthlyExpensesData: context.monthlyExpensesData
    }, null, 2);
  }

  private prepareMessages(
    message: string,
    context: string,
    conversationHistory: AIChatMessage[]
  ): AIChatMessage[] {
    const systemPrompt = `
      You are FinAssist AI, a financial assistant helping users manage their personal finances.
      You have access to the user's financial data including:
      - Current balance
      - Income and expense history
      - Spending categories
      - Transaction history
      - Savings rate
      
      Provide personalized financial advice based on their actual data.
      Be concise, helpful, and avoid generic advice.
      When appropriate, suggest specific actions based on their spending patterns.
      If asked about features not available, explain what the app can do.
    `;

    return [
      { role: 'system', content: systemPrompt },
      { role: 'system', content: `User's financial context:\n${context}` },
      ...conversationHistory,
      { role: 'user', content: message }
    ];
  }
}

// Export a singleton instance
export const aiService = new AIService();