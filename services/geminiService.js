import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = ai.models;

// FIX: Added type check for reader.result and error handling to the promise.
const fileToGenerativePart = async (file) => {
  const base64EncodedDataPromise = new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to read file as data URL.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

export const generateResponse = async (prompt, imageFile) => {
    try {
        const contents = { parts: [] };

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

        const response = await model.generateContent({
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