"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, X } from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { useNavigate } from "react-router-dom";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const { userProfile } = useFinance();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const newUserMessage: Message = { text: inputMessage, sender: "user" };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
    }, 500);
  };

  const generateBotResponse = (message: string): string => {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      return `Hello ${userProfile?.name || "there"}! How can I help you with your finances today?`;
    } else if (lowerCaseMessage.includes("balance")) {
      return "You can check your current balance on the Dashboard or Profile page. Would you like me to navigate you there?";
    } else if (lowerCaseMessage.includes("transactions")) {
      return "To view your transaction history or make new transactions, please visit the Transactions page.";
    } else if (lowerCaseMessage.includes("loan")) {
      return "If you need to assess loan eligibility or detect potential fraud, head over to the Loan Assessment page.";
    } else if (lowerCaseMessage.includes("investments") || lowerCaseMessage.includes("analytics")) {
      return "For financial insights and investment guidance, check out the Analytics & Investments page.";
    } else if (lowerCaseMessage.includes("profile")) {
      return "You can view or update your profile details on the Profile page.";
    } else if (lowerCaseMessage.includes("dashboard")) {
      return "The Dashboard provides an overview of your finances. You can find it in the navigation.";
    } else if (lowerCaseMessage.includes("navigate to dashboard")) {
      navigate("/dashboard");
      return "Navigating you to the Dashboard now!";
    } else if (lowerCaseMessage.includes("navigate to transactions")) {
      navigate("/transactions");
      return "Taking you to the Transactions page!";
    } else if (lowerCaseMessage.includes("navigate to loan")) {
      navigate("/loan-assessment");
      return "Redirecting you to the Loan Assessment page!";
    } else if (lowerCaseMessage.includes("navigate to investments") || lowerCaseMessage.includes("navigate to analytics")) {
      navigate("/analytics-investments");
      return "Heading to Analytics & Investments!";
    } else if (lowerCaseMessage.includes("navigate to profile")) {
      navigate("/profile");
      return "Opening your Profile page!";
    } else if (lowerCaseMessage.includes("help") || lowerCaseMessage.includes("support")) {
      return "I can help you with information about your balance, transactions, loans, investments, and profile. Just ask!";
    } else {
      return "I'm a simple chatbot and currently can only answer predefined queries. Please try asking about 'balance', 'transactions', 'loan', 'investments', or 'profile'.";
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg z-50"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-6 w-6" />
          <span className="sr-only">Open Chatbot</span>
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-80 h-[400px] flex flex-col shadow-xl z-50">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <CardTitle className="text-lg">FinAssist Chatbot</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close Chatbot</span>
            </Button>
          </CardHeader>
          <CardContent className="flex-grow p-4 overflow-hidden">
            <ScrollArea className="h-full pr-2">
              <div className="space-y-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-2 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
              <Input
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" size="icon">
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

export default Chatbot;