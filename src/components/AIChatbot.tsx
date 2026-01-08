"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, X, Bot, User, RotateCcw } from "lucide-react";
import { useAIChat } from "@/hooks/use-ai-chat";
import { format } from 'date-fns';

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const { messages, isLoading, sendMessage, clearConversation } = useAIChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputMessage.trim() === "" || isLoading) return;

    sendMessage(inputMessage);
    setInputMessage("");
  };

  return (
    <>
      {!isOpen && (
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg z-50 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-6 w-6" />
          <span className="sr-only">Open AI Chatbot</span>
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-96 h-[550px] flex flex-col shadow-2xl z-50 border-0 bg-gradient-to-b from-background to-muted">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-lg">FinAssist AI</CardTitle>
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
          
          <CardContent className="flex-grow p-4 overflow-hidden">
            <ScrollArea className="h-full pr-2">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-lg flex ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted text-muted-foreground rounded-bl-none"
                      }`}
                    >
                      {msg.sender === "bot" && (
                        <Bot className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                        <div className={`text-xs mt-1 ${msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground/70"} text-right`}>
                          {format(msg.timestamp, 'HH:mm')}
                        </div>
                      </div>
                      {msg.sender === "user" && (
                        <User className="h-5 w-5 ml-2 flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] p-3 rounded-lg bg-muted text-muted-foreground rounded-bl-none">
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
          </CardContent>
          
          <CardFooter className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
              <Input
                placeholder="Ask about your finances..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
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