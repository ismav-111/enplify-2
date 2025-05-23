
import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Mic, Eye } from 'lucide-react';
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
  const inputContainerRef = useRef<HTMLDivElement>(null);
  
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
  
  // Focus the textarea when clicking anywhere in the container
  const handleContainerClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className={`p-4`}>
      <div className="max-w-3xl mx-auto">
        <form 
          ref={formRef}
          onSubmit={handleSubmit} 
          className="relative"
        >
          <div 
            ref={inputContainerRef}
            className="flex items-center w-full rounded-full border border-gray-200 bg-white shadow-sm cursor-text"
            onClick={handleContainerClick}
          >
            {/* Mic icon button */}
            <div className="flex-shrink-0 p-3">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                <Mic size={20} className="text-gray-500" />
              </div>
            </div>
            
            {/* Input field */}
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What do you want to know?"
              disabled={disabled}
              className="min-h-[64px] max-h-40 resize-none border-none focus:border-none focus:ring-0 focus:outline-none py-4 flex-1 bg-transparent"
              rows={1}
            />

            <div className="flex items-center gap-2 pr-4">
              {/* Endocs dropdown */}
              <div 
                className="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye size={18} className="text-gray-600" />
                <span className="text-sm text-gray-600">Endocs</span>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              {/* Send button */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  if (message.trim() && !disabled) {
                    formRef.current?.dispatchEvent(
                      new Event('submit', { cancelable: true, bubbles: true })
                    );
                  }
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${message.trim() && !disabled ? 'bg-gray-50 cursor-pointer' : 'bg-gray-50 opacity-50 cursor-not-allowed'}`}
              >
                <ArrowUp size={20} className="text-gray-500" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
