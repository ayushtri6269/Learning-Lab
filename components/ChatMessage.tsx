
import React from 'react';
import { Message } from '../types';
import { BotIcon, UserIcon } from './icons';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { role, parts } = message;
  const isUser = role === 'user';
  const isError = role === 'error';

  const bubbleClasses = isUser
    ? 'bg-blue-600 text-white'
    : isError
    ? 'bg-red-500/20 text-red-300'
    : 'bg-gray-700 text-gray-200';

  const alignmentClasses = isUser ? 'items-end' : 'items-start';
  const flexDirection = isUser ? 'flex-row-reverse' : 'flex-row';

  const Avatar = () => (
    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-500' : 'bg-gray-600'}`}>
        {isUser ? <UserIcon className="w-5 h-5 text-white" /> : <BotIcon className="w-5 h-5 text-white" />}
    </div>
  );

  return (
    <div className={`flex flex-col ${alignmentClasses} w-full max-w-2xl mx-auto`}>
      <div className={`flex ${flexDirection} gap-3 my-2`}>
        <Avatar />
        <div className={`p-4 rounded-2xl max-w-[85%] md:max-w-[75%] ${bubbleClasses}`}>
          {parts.map((part, index) => {
            if (part.type === 'image') {
              return (
                <div key={index} className="mb-2">
                  <img
                    src={part.src}
                    alt="User upload"
                    className="rounded-lg max-w-full h-auto"
                  />
                </div>
              );
            }
            return (
              <p key={index} className="whitespace-pre-wrap leading-relaxed">
                {part.text}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
