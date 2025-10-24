import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

const LoadingBubble = () => (
  <div className="flex items-start gap-3 my-2 w-full max-w-2xl mx-auto">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 animate-pulse"></div>
    <div className="p-4 rounded-2xl bg-gray-700 flex items-center space-x-2">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
    </div>
  </div>
);

const ChatHistory = ({ messages, isLoading }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="flex flex-col gap-2">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && <LoadingBubble />}
      </div>
    </div>
  );
};

export default ChatHistory;