
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MessagePart } from '../types';

const MODEL_NAME = 'gemini-2.5-flash';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = ai.models;

interface GeminiPart {
    text?: string;
    inlineData?: {
        mimeType: string;
        data: string;
    };
}

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

export const generateResponse = async (prompt: string, imageFile?: File): Promise<string> => {
    try {
        const contents: { parts: GeminiPart[] } = { parts: [] };

        if (imageFile) {
            const imagePart = await fileToGenerativePart(imageFile);
            contents.parts.push(imagePart);
        }

        if (prompt) {
            contents.parts.push({ text: prompt });
        }

        if (contents.parts.length === 0) {
            throw new Error("Prompt and/or image must be provided.");
        }

        const response: GenerateContentResponse = await model.generateContent({
            model: MODEL_NAME,
            contents: contents,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating response from Gemini:", error);
        if (error instanceof Error) {
            return `Error: ${error.message}`;
        }
        return "An unknown error occurred while communicating with the AI.";
    }
};
