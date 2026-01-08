import { useState, useCallback, useRef } from 'react';
import { aiService, AIContext, AIChatMessage } from '@/lib/ai-service';
import { useFinance } from '@/context/FinanceContext';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const useAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI financial assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const financeContext = useFinance();
  const conversationHistory = useRef<AIChatMessage[]>([]);

  const extractAIContext = useCallback((): AIContext => {
    const {
      balance,
      transactions,
      userProfile,
      getSpendingCategories,
      getMonthlyExpensesData,
      getMonthlyIncomeData,
      getTotalIncome,
      getTotalExpenses,
      getNetSavings,
      getSavingsRate,
      getRecentTransactions
    } = financeContext;

    return {
      userProfile,
      balance,
      totalIncome: getTotalIncome(),
      totalExpenses: getTotalExpenses(),
      netSavings: getNetSavings(),
      savingsRate: getSavingsRate(),
      spendingCategories: getSpendingCategories(),
      recentTransactions: getRecentTransactions(10),
      monthlyIncomeData: getMonthlyIncomeData(6),
      monthlyExpensesData: getMonthlyExpensesData(6)
    };
  }, [financeContext]);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get current financial context
      const context = extractAIContext();
      
      // Get AI response
      const aiResponse = await aiService.sendMessage(
        message,
        context,
        conversationHistory.current
      );

      // Add bot message
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, extractAIContext]);

  const clearConversation = useCallback(() => {
    setMessages([
      {
        id: '1',
        text: 'Hello! I\'m your AI financial assistant. How can I help you today?',
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    conversationHistory.current = [];
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearConversation
  };
};