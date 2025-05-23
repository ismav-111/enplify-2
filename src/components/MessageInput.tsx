
import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Mic, Paperclip, ChevronDown } from 'lucide-react';
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

  const handleMicClick = () => {
    // Future functionality for voice input
    console.log('Microphone clicked');
  };

  return (
    <div className={`${centered ? '' : ''} p-4`}>
      <div className="max-w-3xl mx-auto">
        <form ref={formRef} onSubmit={handleSubmit} className="relative" onClick={handleFormClick}>
          <div className="flex items-center w-full rounded-full border border-gray-200 shadow-sm bg-white">
            <div className="flex-shrink-0 ml-2 p-3 cursor-pointer" onClick={handleMicClick}>
              <Mic size={24} className="text-gray-400 hover:text-[#4E50A8] transition-colors" />
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
              <Select
                value={responseMode}
                onValueChange={(value) => setResponseMode(value as ResponseMode)}
              >
                <SelectTrigger className="w-[120px] border border-gray-200 rounded-full px-4 py-2 h-auto bg-white">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-1 capitalize">{responseMode}</span>
                    <ChevronDown size={14} className="text-gray-500" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="encore">Encore</SelectItem>
                  <SelectItem value="endocs">Endocs</SelectItem>
                  <SelectItem value="ensights">Ensights</SelectItem>
                </SelectContent>
              </Select>

              {/* File input for Endocs and Ensights */}
              {(responseMode === 'endocs' || responseMode === 'ensights') && (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleFileClick}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <Paperclip size={20} className="text-gray-500" />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </>
              )}
              
              <Button
                type="submit"
                disabled={!message.trim() || disabled}
                className="rounded-full bg-[#4E50A8] hover:bg-[#4042a0] p-3 h-auto"
              >
                <ArrowUp size={24} className="text-white" />
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
