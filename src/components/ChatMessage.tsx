
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
    <div className={`flex gap-4 p-6 ${message.isUser ? 'bg-white' : 'bg-gray-50/50'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        message.isUser 
          ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
          : 'bg-gradient-to-r from-green-500 to-teal-500'
      }`}>
        {message.isUser ? (
          <User size={16} className="text-white" />
        ) : (
          <Bot size={16} className="text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-gray-900">
            {message.isUser ? 'You' : 'CHAT A.I+'}
          </span>
          <span className="text-xs text-gray-500">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
        
        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
          {message.content}
        </div>

        {/* Action Buttons - Only for AI messages */}
        {!message.isUser && (
          <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
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
  );
};

export default ChatMessage;
