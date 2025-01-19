import React from 'react';
import { Message } from '@/types/chat';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  console.log('Message content:', message);
  return (
    <div className={`flex leading-relaxed w-full my-4 ${
      message.role === 'user' ? 'justify-end' : 'justify-start'
    }`}>
      <div className={`max-w-[80%] rounded-2xl p-3 ${
        message.role === 'user' 
          ? 'bg-primary/40 font-semibold '
          : 'bg-secondary'
      }`}>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};