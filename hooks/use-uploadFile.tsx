import { GoogleGenerativeAI } from "@google/generative-ai";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

const genAI = new GoogleGenerativeAI("AIzaSyCV9KXm0D9WROWVUSlFfMx6p9l4axfLfec");

interface SearchResult {
  text: string;
  source: string;
  score: number;
}

interface ApiResponse {
  results: SearchResult[];
}

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

export const useUploadFile = () => {
  const create = useMutation(api.documents.create);
  const update = useMutation(api.documents.update);
  const uploadFile = async (file: File | null) => {
    try {
      if (file) {
        // convert to markdown
        const arrayBuffer = await file.arrayBuffer();
        const base64Data = await arrayBufferToBase64(arrayBuffer);

        const markdownPrompt = `Convert this PDF to Markdown with EXACT preservation of:
        - Keep all original formatting and layout intact
        - Maintain precise document structure and hierarchy
        - Preserve all whitespace, indentation, and alignment
        - Retain exact table layouts and cell alignments
        - Keep all lists, numbering, and bullet points exactly as they appear
        - Preserve all text styling (bold, italic, underline, etc.)
        - Maintain exact header levels and hierarchy
        - Keep all special characters, symbols, and mathematical notations
        - Preserve page breaks and section spacing
        Convert to standard Markdown syntax while ensuring maximum fidelity to the original PDF layout.`;

        const result = await model.generateContent([
          {
            inlineData: {
              data: base64Data,
              mimeType: "application/pdf",
            },
          },
          markdownPrompt,
        ]);
        const res = result.response
          .text()
          .replace(/```markdown\n?|\n?```/g, "")
          .trim();

        // extract key structured data
        const structuredDataPrompt = `
        Return ONLY a JSON object containing these fields from the text:
        {
          "title": string // a short title of the document 
          "expirationDate": "any date found  regarding expiry or due date or deadline or termination if not found then nullnull",
          "status": "draft" | "sent" | "signed" | "expired"
        }

        No additional text, no markdown, no code blocks.
        Just the raw JSON starting with { and ending with }.
        
        Text to analyze:
        ${res}
      `;

        const getKeys = async () => {
          try {
            const jsonResult =
              await model.generateContent(structuredDataPrompt);
            const jsonResponse = jsonResult.response.text();
            const cleanedJson = jsonResponse
              .replace(/```json\n?|\n?```/g, "")
              .trim();
            const keyData = JSON.parse(cleanedJson);
            return keyData;
          } catch (error) {
            console.error("Failed to parse JSON response:", error);
            return null;
          }
        };

        // send the key shit
        const sendKey = async (id: string, date: string, status?: string) => {
          const { isSignedIn, user, isLoaded } = useUser();
          if (!user) return;
          const response = await axios.post(
            `https://contract-management.onrender.com/contract/agreements`,
            {
              id: id,
              userId: user.id,
              expirationDate: date,
              status: status, // draft sent signed expired
            }
          );
        };

        // create file
        const onCreate = async () => {
          const keys = await getKeys();
          const promise = create({ title: keys.title ?? "New Doc" }).then(
            async (documentId) => {
              await Promise.all([
                update({ id: documentId, content: res }),
                sendKey(documentId, keys?.expirationDate, keys?.status),
                sendToAPI(documentId, res),
              ]);
            }
          );

          toast.promise(promise, {
            loading: "Creating a new document...",
            success: "New doc created!",
            error: "Failed to create a new doc.",
          });
        };
        await onCreate();
      }
    } catch (error) {
      console.error("Error fetching last transaction:", error);
      return { error };
    }
  };
  return { uploadFile };
};

export const sendToAPI = async (id: string, markdownContent: string) => {
  try {
    const response = await fetch(
      "https://embedding-eight.vercel.app/add-text",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: markdownContent,
          source_id: id,
        }),
      }
    );
    if (!response.ok) {
      console.error("Failed to send to API");
    }
  } catch (error) {
    console.error("Error sending to API:", error);
  }
};

async function arrayBufferToBase64(buffer: ArrayBuffer) {
  const arr = new Uint8Array(buffer);
  let binary = "";

  const chunkSize = 0x8000;

  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.subarray(i, Math.min(i + chunkSize, arr.length));
    // Convert Uint8Array chunk to number array
    const chunkArray = Array.from(chunk);
    binary += String.fromCharCode.apply(null, chunkArray);
  }

  return btoa(binary);
}
