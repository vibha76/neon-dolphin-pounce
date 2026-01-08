import { useState, useCallback, useRef, useEffect } from 'react';
import { aiService, AIContext, AIChatMessage } from '@/lib/ai-service';
import { useFinance } from '@/context/FinanceContext';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const useAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = localStorage.getItem('finassist_ai_chat_messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (e) {
        console.error('Failed to parse saved messages', e);
      }
    }
    
    return [
      {
        id: '1',
        text: 'Hello! I\'m your AI financial assistant. How can I help you manage your finances today?',
        sender: 'bot',
        timestamp: new Date()
      }
    ];
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [conversationTopic, setConversationTopic] = useState<string | null>(null);
  const financeContext = useFinance();
  const conversationHistory = useRef<AIChatMessage[]>([]);
  
  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('finassist_ai_chat_messages', JSON.stringify(messages));
  }, [messages]);

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
      recentTransactions: getRecentTransactions(15),
      monthlyIncomeData: getMonthlyIncomeData(12),
      monthlyExpensesData: getMonthlyExpensesData(12)
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
      
      // Update conversation history
      conversationHistory.current = [
        ...conversationHistory.current,
        { role: 'user', parts: [{ text: message }] },
        { role: 'model', parts: [{ text: aiResponse }] }
      ];
      
      // Keep only the last 10 exchanges to manage context length
      if (conversationHistory.current.length > 20) {
        conversationHistory.current = conversationHistory.current.slice(-20);
      }
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        text: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, extractAIContext]);

  const clearConversation = useCallback(() => {
    const clearMessage: ChatMessage = {
      id: Date.now().toString(),
      text: 'Conversation cleared. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages([clearMessage]);
    conversationHistory.current = [];
    setConversationTopic(null);
    localStorage.removeItem('finassist_ai_chat_messages');
  }, []);

  const setTopic = useCallback((topic: string) => {
    setConversationTopic(topic);
  }, []);

  return {
    messages,
    isLoading,
    conversationTopic,
    sendMessage,
    clearConversation,
    setTopic
  };
};