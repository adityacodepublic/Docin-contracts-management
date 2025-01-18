import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCV9KXm0D9WROWVUSlFfMx6p9l4axfLfec"
const genAI = new GoogleGenerativeAI(process.env.apiKey!);

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

async function arrayBufferToBase64(buffer: ArrayBuffer) {
  const arr = new Uint8Array(buffer);
  let binary = '';
  
  // Process in smaller chunks to avoid call stack size exceeded
  const chunkSize = 0x8000;
  
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.subarray(i, Math.min(i + chunkSize, arr.length));
    // Convert Uint8Array chunk to number array
    const chunkArray = Array.from(chunk);
    binary += String.fromCharCode.apply(null, chunkArray);
  }
  
  return btoa(binary);
}

export async function talk(question: string, file?: File | null) {
  try {
    if (file) {
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
      return result.response.text();
    }
  } catch (error) {
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }
    return 'An unknown error occurred';
  }
}
