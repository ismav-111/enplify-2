
import { useState } from 'react';
import { Send, Paperclip, Mic, ChevronDown, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const MessageInput = ({ onSendMessage, disabled = false }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What do you want to know?"
            disabled={disabled}
            className="min-h-[56px] max-h-32 resize-none border-gray-200 focus:border-gray-300 focus:ring-gray-300 rounded-full px-12 py-3 shadow-sm"
            rows={1}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full p-1.5 h-auto"
            >
              <Mic size={18} className="text-gray-500" />
            </Button>
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <div className="flex items-center mr-1 border border-gray-200 rounded-full px-2 py-1">
              <span className="text-sm text-gray-600 mr-1">Endocs</span>
              <ChevronDown size={14} className="text-gray-500" />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full p-1.5 h-auto"
            >
              <Paperclip size={18} className="text-gray-500" />
            </Button>
            <Button
              type="submit"
              disabled={!message.trim() || disabled}
              className="rounded-full bg-gray-700 hover:bg-gray-800 p-1.5 h-auto disabled:opacity-50"
            >
              <ArrowUp size={18} className="text-white" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
