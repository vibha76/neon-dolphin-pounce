"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, X, Bot, User, RotateCcw, Sparkles } from "lucide-react";
import { useAIChat } from "@/hooks/use-ai-chat";
import { format } from 'date-fns';

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const { messages, isLoading, sendMessage, clearConversation } = useAIChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "" || isLoading) return;
    sendMessage(inputMessage);
    setInputMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  // Quick action buttons
  const quickActions = [
    { label: "Check Balance", message: "What's my current balance?" },
    { label: "Spending Analysis", message: "Show me my spending breakdown" },
    { label: "Savings Advice", message: "How can I save more money?" },
    { label: "Investment Options", message: "What should I invest in?" }
  ];

  const handleQuickAction = (message: string) => {
    sendMessage(message);
  };

  return (
    <>
      {!isOpen && (
        <Button 
          variant="default" 
          size="icon" 
          className="fixed bottom-4 right-4 rounded-full h-16 w-16 shadow-2xl z-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-110"
          onClick={() => setIsOpen(true)}
        >
          <div className="relative">
            <MessageSquare className="h-7 w-7" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-pulse" />
          </div>
          <span className="sr-only">Open AI Chatbot</span>
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-full max-w-md h-[600px] flex flex-col shadow-2xl z-50 border-0 bg-gradient-to-b from-background to-muted rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-lg flex items-center">
                FinAssist AI
                <Sparkles className="ml-2 h-4 w-4 text-yellow-300" />
              </CardTitle>
            </div>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={clearConversation} 
                className="h-8 w-8 text-white hover:bg-white/20"
                title="Clear Conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)} 
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close Chatbot</span>
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-grow p-0 overflow-hidden flex flex-col">
            <ScrollArea className="flex-grow p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[85%] p-3 rounded-2xl flex ${
                        msg.sender === "user" 
                          ? "bg-primary text-primary-foreground rounded-br-none" 
                          : "bg-muted text-muted-foreground rounded-bl-none"
                      }`}
                    >
                      {msg.sender === "bot" && (
                        <Bot className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-blue-500" />
                      )}
                      <div>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                        <div 
                          className={`text-xs mt-1 ${
                            msg.sender === "user" 
                              ? "text-primary-foreground/70" 
                              : "text-muted-foreground/70"
                          } text-right`}
                        >
                          {format(msg.timestamp, 'HH:mm')}
                        </div>
                      </div>
                      {msg.sender === "user" && (
                        <User className="h-5 w-5 ml-2 flex-shrink-0 mt-0.5 text-green-300" />
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] p-3 rounded-2xl bg-muted text-muted-foreground rounded-bl-none">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-75"></div>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-4 pb-3">
                <div className="text-xs text-muted-foreground mb-2">Quick Actions:</div>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 px-2"
                      onClick={() => handleQuickAction(action.message)}
                      disabled={isLoading}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="p-4 border-t bg-background">
            <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
              <Input 
                ref={inputRef}
                placeholder="Ask about your finances..." 
                value={inputMessage} 
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-grow" 
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || inputMessage.trim() === ""}
              >
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

export default AIChatbot;