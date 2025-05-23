
import { useState, useRef } from 'react';
import { ArrowUp, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type ResponseMode = 'encore' | 'endocs' | 'ensights';

interface MessageInputProps {
  onSendMessage: (message: string, mode: ResponseMode, file?: File) => void;
  disabled?: boolean;
  centered?: boolean;
}

const MessageInput = ({ onSendMessage, disabled = false, centered = false }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [responseMode, setResponseMode] = useState<ResponseMode>('encore');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim(), responseMode, selectedFile || undefined);
      setMessage('');
      setSelectedFile(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleFormClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const showAttachment = responseMode === 'endocs' || responseMode === 'ensights';

  return (
    <div className={`${centered ? '' : ''} p-4`}>
      <div className="max-w-3xl mx-auto">
        <form ref={formRef} onSubmit={handleSubmit} className="relative" onClick={handleFormClick}>
          <div className="flex flex-col w-full rounded-xl border border-gray-200 shadow-sm bg-white">
            {/* Input area */}
            <div className="flex items-center w-full px-4">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What do you want to know?"
                disabled={disabled}
                className="min-h-[64px] max-h-40 resize-none border-none focus:border-none focus:ring-0 py-4 flex-1"
                rows={1}
              />
              
              {/* Attachment button */}
              {showAttachment && (
                <button
                  type="button"
                  onClick={handleFileClick}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
                >
                  <Paperclip size={16} className="text-gray-500" />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </button>
              )}
              
              <Button
                type="submit"
                disabled={!message.trim() || disabled}
                className="rounded-full bg-[#4E50A8] hover:bg-[#4042a0] p-3 h-auto flex-shrink-0"
              >
                <ArrowUp size={20} className="text-white" />
              </Button>
            </div>
            
            {/* Bottom toolbar with mode selector */}
            <div className="flex items-center px-4 py-2 border-t border-gray-100">
              <div className="flex items-center flex-1 gap-2">
                {/* Mode selector styled as tabs */}
                <div className="flex space-x-2">
                  <Select
                    value={responseMode}
                    onValueChange={(value) => {
                      setResponseMode(value as ResponseMode);
                      if (value === 'encore') {
                        setSelectedFile(null);
                      }
                    }}
                  >
                    <SelectTrigger className="border border-gray-200 rounded-full px-3 py-1 h-auto text-xs bg-white w-auto min-w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start" className="w-[120px]">
                      <SelectItem value="encore">Encore</SelectItem>
                      <SelectItem value="endocs">Endocs</SelectItem>
                      <SelectItem value="ensights">Ensights</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Show selected file name if any */}
              {selectedFile && (
                <span className="text-xs text-gray-500 ml-2 flex items-center">
                  <Paperclip size={12} className="mr-1" />
                  {selectedFile.name}
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
