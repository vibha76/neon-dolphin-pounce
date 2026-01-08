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
  private apiUrl: string = 'https://api.openai.com/v1/chat/completions';

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
      const messages = this.prepareMessages(message, contextString, conversationHistory);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: messages,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      // Check if response has content
      if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
        throw new Error("No content in response from OpenAI API");
      }
      
      return data.choices[0].message.content.trim();
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

  private prepareMessages(
    message: string,
    context: string,
    conversationHistory: AIChatMessage[]
  ): any[] {
    const systemPrompt = `
      You are FinAssist AI, a financial assistant helping users manage their personal finances in India.
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
      Always respond in the same language the user uses.
      Format amounts in Indian Rupees (₹).
      Never provide investment advice that could be risky.
    `;

    // Format messages for OpenAI API
    const formattedMessages = [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: `User's financial context:\n${context}\n\nUser's message: ${message}`
      }
    ];

    return formattedMessages;
  }
}

// Export a singleton instance
export const aiService = new AIService();