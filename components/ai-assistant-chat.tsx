"use client";

import { useState, useEffect } from "react";
import { processAiFinancialInput } from "@/actions/financial.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Bot, User, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  type: "user" | "ai" | "system";
  content: string;
  timestamp: string; // Use string instead of Date to prevent hydration issues
  success?: boolean;
  data?: any;
}

export function AiAssistantChat() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMessages([
      {
        id: "1",
        type: "ai",
        content:
          "Hi! I'm your financial assistant. You can tell me about your business expenses, income, or assets and I'll help you record them. For example:\n\n• 'I spent Rp 50000 on fuel for motorcycle ABC-123 today'\n• 'Received Rp 200000 rental payment from John'\n• 'Bought a new toolkit for Rp 150000'",
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await processAiFinancialInput(input);

      const systemMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "system",
        content: result.message,
        timestamp: new Date().toISOString(),
        success: result.success,
        data: result.data,
      };

      setMessages((prev) => [...prev, systemMessage]);

      if (result.success) {
        toast.success("Financial record added successfully!");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "system",
        content: "Sorry, I couldn't process that. Please try again.",
        timestamp: new Date().toISOString(),
        success: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Failed to process your request");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Financial Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Financial Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex items-start gap-2 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              {message.type !== "user" && (
                <div className="flex-shrink-0">
                  {message.type === "ai" ? (
                    <Bot className="h-6 w-6 text-blue-500" />
                  ) : (
                    <div className="h-6 w-6 flex items-center justify-center">{message.success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}</div>
                  )}
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === "user" ? "bg-blue-500 text-white" : message.type === "ai" ? "bg-gray-100 text-gray-900" : message.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</p>
              </div>
              {message.type === "user" && <User className="h-6 w-6 text-gray-500 flex-shrink-0" />}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-2">
              <Bot className="h-6 w-6 text-blue-500" />
              <div className="bg-gray-100 rounded-lg p-3">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tell me about an expense, income, or asset..." disabled={isLoading} className="flex-1" />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
