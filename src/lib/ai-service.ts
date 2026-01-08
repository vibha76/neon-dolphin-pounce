// AI service integration for FinAssist
// This file handles integration with Google's Gemini API using a predefined API key

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
  private apiKey: string = "AIzaSyB6D6kENFR3WR9TochtUVPp211wlWAlnBQ"; // Predefined API key
  private apiUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  constructor() {
    // Check for API key in environment variables (for development override)
    const envApiKey = import.meta.env?.VITE_GEMINI_API_KEY || null;
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

      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: messages
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      // Check if response has content
      if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
        throw new Error("No content in response from Gemini API");
      }
      
      return data.candidates[0].content.parts[0].text.trim();
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

    // Format messages for Gemini API
    const formattedMessages = [
      {
        role: "user",
        parts: [{
          text: `${systemPrompt}\n\nUser's financial context:\n${context}\n\nUser's message: ${message}`
        }]
      }
    ];

    return formattedMessages;
  }
}

// Export a singleton instance
export const aiService = new AIService();