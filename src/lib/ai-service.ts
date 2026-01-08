// AI service integration for FinAssist
// This file handles integration with OpenAI API using a predefined API key

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
  private apiKey: string = "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"; // Predefined API key
  private apiUrl: string = '/api/ai/chat'; // Proxy endpoint

  constructor() {
    // Check for API key in environment variables (for development override)
    const envApiKey = import.meta.env?.VITE_OPENAI_API_KEY || null;
    if (envApiKey) {
      this.apiKey = envApiKey;
    }
  }

  public isConfigured(): boolean {
    return !!this.apiKey;
  }

  public async sendMessage(
    message: string,
    context: AIContext,
    conversationHistory: AIChatMessage[] = []
  ): Promise<string> {
    try {
      const contextString = this.formatContextForAI(context);

      // Use relative path for development, absolute path for production
      const endpoint = import.meta.env?.MODE === 'development'
        ? 'http://localhost:8080/api/ai/chat'
        : '/api/ai/chat';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          context: contextString
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI Service error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();

      // Check if response has content
      if (!data.response) {
        throw new Error("No content in response from AI service");
      }

      return data.response;
    } catch (error: any) {
      console.error('AI Service Error:', error);
      return `Sorry, I encountered an error: ${error.message}. Please try again.`;
    }
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
}

// Export a singleton instance
export const aiService = new AIService();