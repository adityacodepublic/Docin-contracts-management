import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface SearchResult {
    text: string;
    source: string;
    score: number;
}

interface ApiResponse {
    results: SearchResult[];
}

export interface StructuredData {
    title: string;
    description: string;
    expirationDate: string | null;
}

export interface QueryResponse {
    markdown: string;
    structured: StructuredData | null;
}

export function isQueryResponse(response: any): response is QueryResponse {
    return typeof response === 'object' && 
                 response !== null && 
                 'markdown' in response && 
                 'structured' in response;
}

const apiKey = "AIzaSyCV9KXm0D9WROWVUSlFfMx6p9l4axfLfec";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
});

const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
};

const handleQuery = async (question: string) => {
    const chatSession = model.startChat({ generationConfig, history: [] });
    const result = await chatSession.sendMessage(question);
    return result.response.text();
};

export const useGeminiQuery = () => {
    const [isQuerying, setIsQuerying] = useState(false);
    const [queryResponse, setQueryResponse] = useState<string>('');

    const askQuestion = async (query: string) => {
        setIsQuerying(true);
        console.log('isQuerying set to true'); // Log state change
        try {
            console.log('Sending query to Gemini AI:', query); // Log action
            const geminiResponse = await handleQuery(query);
            console.log('Gemini response received:', geminiResponse); // Log response
            setQueryResponse(geminiResponse);
            console.log('queryResponse state updated'); // Log state change
        } catch (error) {
            console.error('Error in askQuestion:', error); // Log error
            setQueryResponse('Error getting response');
            console.log('queryResponse set to error message'); // Log state change
        } finally {
            setIsQuerying(false);
            console.log('isQuerying set to false'); // Log state change
        }
    };

    return { askQuestion, isQuerying, queryResponse };
};
