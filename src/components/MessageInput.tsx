
import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  centered?: boolean;
}

const MessageInput = ({ onSendMessage, disabled = false, centered = false }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
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
  
  // Select the entire field when clicked anywhere in the form
  const handleFormClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  };

  return (
    <div className={`${centered ? '' : ''} p-4`}>
      <div className="max-w-3xl mx-auto">
        <form 
          ref={formRef}
          onSubmit={handleSubmit} 
          className="relative"
          onClick={handleFormClick}
        >
          <div className="flex items-center w-full rounded-full border border-gray-200 shadow-sm cursor-text">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full p-4 h-auto ml-2 pointer-events-none"
            >
              <Mic size={24} className="text-gray-400" />
            </Button>
            
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What do you want to know?"
              disabled={disabled}
              className="min-h-[64px] max-h-40 resize-none border-none focus:border-none focus:ring-0 rounded-full py-4 flex-1"
              rows={1}
            />

            <div className="flex items-center gap-2 pr-2 pointer-events-none">
              <div className="flex items-center border border-gray-200 rounded-full px-4 py-2">
                <span className="text-sm text-gray-600 mr-1">Endocs</span>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <Button
                type="submit"
                disabled={!message.trim() || disabled}
                className="rounded-full bg-gray-100 hover:bg-gray-200 p-3 h-auto pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <ArrowUp size={24} className="text-gray-500" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
