
import React, { useState, useEffect } from 'react';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';
import { Message, MessagePart } from './types';
import { generateResponse } from './services/geminiService';
import { BotIcon } from './components/icons';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Add initial welcome message from the bot
    setMessages([
      {
        id: 'init-message',
        role: 'model',
        parts: [{ type: 'text', text: "Hello! I'm Gemini. You can ask me anything or upload an image for analysis." }],
      },
    ]);
  }, []);

  const handleSendMessage = async (prompt: string, file?: File) => {
    if (isLoading || (!prompt.trim() && !file)) return;

    setIsLoading(true);

    const userParts: MessagePart[] = [];
    if (file) {
      userParts.push({ type: 'image', src: URL.createObjectURL(file), mimeType: file.type });
    }
    if (prompt.trim()) {
      userParts.push({ type: 'text', text: prompt });
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      parts: userParts,
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const responseText = await generateResponse(prompt, file);
      const modelMessage: Message = {
        id: `${Date.now()}-model`,
        role: responseText.startsWith('Error:') ? 'error' : 'model',
        parts: [{ type: 'text', text: responseText }],
      };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        role: 'error',
        parts: [{ type: 'text', text: 'An unexpected error occurred. Please try again.' }],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{fontFamily: "'Inter', sans-serif"}} className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="flex items-center gap-3 p-4 border-b border-gray-700 shadow-md">
        <BotIcon className="w-8 h-8 text-blue-400" />
        <h1 className="text-xl font-semibold text-gray-100">Gemini Multimodal Chat</h1>
      </header>
      <ChatHistory messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
