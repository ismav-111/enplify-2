
import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Mic, Eye, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MessageInputProps {
  onSendMessage: (message: string, type: string, file?: File) => void;
  disabled?: boolean;
  centered?: boolean;
}

const MessageInput = ({ onSendMessage, disabled = false, centered = false }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState('encore');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim(), selectedOption, selectedFile || undefined);
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
  
  // Select the entire field when the form is clicked
  const handleFormClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className={`${centered ? '' : ''} p-4`}>
      <div className="max-w-3xl mx-auto">
        <form ref={formRef} onSubmit={handleSubmit} className="relative" onClick={handleFormClick}>
          <div className="flex items-center w-full rounded-full border border-gray-200 shadow-sm">
            <div className="flex-shrink-0 ml-2 p-3">
              <Mic size={24} className="text-gray-400 pointer-events-none" />
            </div>
            
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

            <div className="flex items-center gap-2 pr-2">
              {/* File upload button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleFileSelect}
                className="p-2 h-auto rounded-full hover:bg-gray-100"
              >
                <Paperclip size={20} className="text-gray-500" />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </Button>
              
              {/* Selected file indicator */}
              {selectedFile && (
                <span className="text-xs text-gray-600 px-2 py-1 bg-gray-100 rounded-full">
                  {selectedFile.name.length > 15 
                    ? selectedFile.name.substring(0, 12) + '...' 
                    : selectedFile.name}
                </span>
              )}

              {/* Data source selector */}
              <Select
                value={selectedOption}
                onValueChange={(value) => setSelectedOption(value)}
              >
                <SelectTrigger className="border border-gray-200 rounded-full px-4 py-2 h-auto w-auto min-w-[110px] bg-[#d5d5ec] text-[#4E50A8]">
                  <SelectValue placeholder="Encore" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-md rounded-lg">
                  <SelectItem value="encore" className="cursor-pointer">
                    <div className="flex items-center">
                      <span>Encore</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="endocs" className="cursor-pointer">
                    <div className="flex items-center">
                      <span>Endocs</span>
                      <Eye size={14} className="ml-2 text-gray-500" />
                    </div>
                  </SelectItem>
                  <SelectItem value="ensights" className="cursor-pointer">
                    <div className="flex items-center">
                      <span>Ensights</span>
                      <Eye size={14} className="ml-2 text-gray-500" />
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                type="submit"
                disabled={!message.trim() || disabled}
                className="rounded-full bg-[#4E50A8] hover:bg-[#3c3e85] p-3 h-auto"
              >
                <ArrowUp size={24} className="text-white" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
