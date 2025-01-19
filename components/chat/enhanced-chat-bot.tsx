"use client";

import React, { useState, KeyboardEvent, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Message } from "@/types/chat";
import { ChatMessage } from "./chat-message";
import { v4 as uuidv4 } from "uuid";
import { useGeminiQuery } from "@/hooks/useGeminiQuery";

interface EnhancedChatBotProps {
  documentContent: string;
  documentId?: string; // Add documentId prop
}

const EnhancedChatBot = ({
  documentContent,
  documentId,
}: EnhancedChatBotProps) => {
  const [query, setQuery] = useState("");

  // Initialize messages as an empty array to store user and assistant messages
  const [messages, setMessages] = useState<Message[]>([]);

  const { askQuestion, isQuerying, queryResponse } = useGeminiQuery();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100); // Small delay to ensure content is rendered
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isQuerying]); // Also scroll when loading state changes

  useEffect(() => {
    console.log("useEffect triggered: queryResponse updated:", queryResponse); // Log effect
    if (queryResponse && queryResponse !== "Error getting response") {
      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        timestamp: new Date(),
        content: queryResponse,
        documentId: documentId, // Add documentId to assistant message
      };
      console.log("Adding assistant message:", assistantMessage); // Log message addition
      setMessages((prev) => [...prev, assistantMessage]);
    } else if (queryResponse === "Error getting response") {
      const errorMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        timestamp: new Date(),
        content: queryResponse,
      };
      console.log("Adding error message:", errorMessage); // Log message addition
      setMessages((prev) => [...prev, errorMessage]);
    }
  }, [queryResponse, documentId]);

  const handleAsk = async () => {
    if (query.trim()) {
      const userMessage: Message = {
        id: uuidv4(),
        content: query,
        role: "user",
        timestamp: new Date(),
        documentId: documentId, // Add documentId to message
      };

      setMessages((prev) => [...prev, userMessage]);
      setQuery("");

      try {
        const contextPrompt = `Document Content:\n${documentContent}\n\nQuestion: ${query}`;
        await askQuestion(contextPrompt);
      } catch (err) {
        const errorMessage: Message = {
          id: uuidv4(),
          content: "Sorry, I could not process your request.",
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="flex flex-col rounded-lg overflow-hidden h-full max-h-screen my-2">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800 p-4 min-h-0">
        <div className="flex flex-col space-y-4 pb-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className=" p-4 sticky bottom-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-2xl bg-blue-50 text-white border placeholder:text-gray-800 shadow-xl focus:outline-none focus:ring-1 focus:ring-zinc-500 min-h-[48px]"
            disabled={isQuerying}
          />
          <button
            onClick={handleAsk}
            disabled={isQuerying || !query.trim()}
            className="p-3 bg-white  rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-colors duration-200 disabled:bg-gray-400"
          >
            {isQuerying ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-black" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedChatBot;
