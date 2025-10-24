
import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { SendIcon, PaperclipIcon, CloseIcon } from './icons';

interface ChatInputProps {
  onSendMessage: (prompt: string, file?: File) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (isLoading || (!prompt.trim() && !imageFile)) return;
    onSendMessage(prompt, imageFile || undefined);
    setPrompt('');
    removeImage();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  return (
    <div className="bg-gray-800 p-4 border-t border-gray-700">
      <div className="w-full max-w-2xl mx-auto">
        {imagePreview && (
          <div className="mb-2 relative w-24 h-24 p-1 bg-gray-700 rounded-lg">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded" />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-gray-600 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
              aria-label="Remove image"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex items-end gap-2 bg-gray-700 rounded-2xl p-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
            aria-label="Attach file"
          >
            <PaperclipIcon className="w-6 h-6" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything or upload an image..."
            className="flex-1 bg-transparent text-white placeholder-gray-400 resize-none outline-none max-h-40"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || (!prompt.trim() && !imageFile)}
            className="p-2 rounded-full bg-blue-600 text-white disabled:bg-gray-500 transition-colors"
            aria-label="Send message"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
