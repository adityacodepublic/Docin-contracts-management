import { useState } from "react";
import { talk } from "./talk";

interface SearchResult {
  text: string;
  source: string;
  score: number;
}

interface ApiResponse {
  results: SearchResult[];
}

export const useGeminiQuery = () => {
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResponse, setQueryResponse] = useState<string>("");

  const askQuestion = async (query: string) => {
    console.log("Query started:", query);
    setIsQuerying(true);
    try {
      console.log("Fetching context from embedding API...");
      const contextResponse = await fetch(
        "https://embedding-eight.vercel.app/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: query,
            source: "2025-01-18T19:27:30.879Z",
          }),
        }
      );

      if (!contextResponse.ok) {
        console.error("Embedding API error:", contextResponse.status);
        throw new Error("Failed to fetch context");
      }

      const data: ApiResponse = await contextResponse.json();

      const contextTexts = data.results
        .sort((a, b) => b.score - a.score)
        .map((result) => result.text)
        .join("\n\n");

      console.log("Combined context:", contextTexts);

      const prompt = `Based on the following context, please answer this question: "${query}"\n\nContext:\n${contextTexts}`;
      console.log("Sending to Gemini with prompt:", prompt);

      const geminiResponse = await talk(prompt);
      console.log("Gemini response:", geminiResponse);
      if (geminiResponse) setQueryResponse(geminiResponse);
    } catch (error) {
      console.error("Error in askQuestion:", error);
      setQueryResponse("Error getting response");
    } finally {
      setIsQuerying(false);
      console.log("Query completed");
    }
  };

  return { askQuestion, isQuerying, queryResponse };
};
