
import { useState } from 'react';
import { User, Bot, ThumbsUp, ThumbsDown, Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
  };
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const toggleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          message.isUser 
            ? 'bg-gray-200' 
            : 'bg-gray-300'
        }`}>
          {message.isUser ? (
            <User size={16} className="text-gray-700" />
          ) : (
            <Bot size={16} className="text-gray-700" />
          )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-700">
              {message.isUser ? 'You' : 'CHAT A.I+'}
            </span>
            <span className="text-xs text-gray-500">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
          
          <div 
            className={`prose prose-sm max-w-none rounded-2xl p-4 ${
              message.isUser 
                ? 'bg-[#F1F1F9] text-gray-800' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {message.content}
          </div>

          {/* Action Buttons - Only for AI messages */}
          {!message.isUser && (
            <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLike}
                className={`p-2 h-auto ${isLiked ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <ThumbsUp size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDislike}
                className={`p-2 h-auto ${isDisliked ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <ThumbsDown size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="p-2 h-auto text-gray-400 hover:text-gray-600"
              >
                <Copy size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-auto text-gray-400 hover:text-gray-600"
              >
                <RotateCcw size={14} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
