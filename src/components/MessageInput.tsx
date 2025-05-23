
import { useState, useRef } from 'react';
import { ArrowUp, Paperclip, ChevronDown } from 'lucide-react';
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
  const [responseMode, setResponseMode] = useState<ResponseMode>('endocs');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  return (
    <div className={`${centered ? 'flex items-center justify-center' : ''} p-4`}>
      <div className="max-w-2xl w-full mx-auto">
        <form onSubmit={handleSubmit} className="relative" onClick={handleFormClick}>
          <div className="flex items-center w-full rounded-lg border border-gray-200 bg-white shadow-sm">
            {/* Left side - Paperclip and Mode selector */}
            <div className="flex items-center gap-2 pl-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleFileClick}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Paperclip size={20} className="text-gray-500" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              
              <Select
                value={responseMode}
                onValueChange={(value) => setResponseMode(value as ResponseMode)}
              >
                <SelectTrigger className="border-none shadow-none focus:ring-0 h-auto p-2 min-w-[100px]">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700 capitalize">{responseMode}</span>
                    <ChevronDown size={14} className="ml-1 text-gray-500" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="encore">Encore</SelectItem>
                  <SelectItem value="endocs">Endocs</SelectItem>
                  <SelectItem value="ensights">Ensights</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Center - Textarea */}
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What do you want to know?"
              disabled={disabled}
              className="min-h-[50px] max-h-32 resize-none border-none focus:outline-none focus:ring-0 py-3 flex-1 bg-transparent"
              rows={1}
            />

            {/* Right side - Send button */}
            <div className="pr-3">
              <Button
                type="submit"
                disabled={!message.trim() || disabled}
                className="rounded-full bg-[#4E50A8] hover:bg-[#3a3c8a] text-white p-2.5 h-auto"
              >
                <ArrowUp size={18} />
              </Button>
            </div>
          </div>
          
          {selectedFile && (
            <div className="mt-2 pl-4">
              <span className="text-xs text-gray-500 flex items-center">
                <Paperclip size={12} className="mr-1" />
                {selectedFile.name}
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
