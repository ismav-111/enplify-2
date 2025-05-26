
import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const prevModRef = useRef<ResponseMode>(responseMode);
  
  // Store valid file extensions per mode
  const validFileExtensions = {
    endocs: ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.svg'],
    ensights: ['.xlsx', '.xls', '.csv']
  };
  
  useEffect(() => {
    // Clear selected file when changing modes
    if (prevModRef.current !== responseMode) {
      setSelectedFile(null);
      prevModRef.current = responseMode;
    }
  }, [responseMode]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [message]);
  
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
  
  const validateFileType = (file: File, mode: ResponseMode): boolean => {
    if (mode === 'encore') return false;
    
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (mode === 'endocs' && !validFileExtensions.endocs.includes(fileExt)) {
      toast({
        title: "Invalid file type",
        description: "Endocs only supports PDF and image files.",
        variant: "destructive"
      });
      return false;
    }
    
    if (mode === 'ensights' && !validFileExtensions.ensights.includes(fileExt)) {
      toast({
        title: "Invalid file type",
        description: "Ensights only supports Excel and CSV files.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFileType(file, responseMode)) {
        setSelectedFile(file);
      } else {
        e.target.value = '';
      }
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const showAttachment = responseMode === 'endocs' || responseMode === 'ensights';

  return (
    <div className={`${centered ? 'w-full' : ''}`}>
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col w-full rounded-2xl border border-gray-200 shadow-sm bg-white focus-within:border-[#4E50A8] transition-colors">
            {/* Selected file display */}
            {selectedFile && (
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <Paperclip size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-700 truncate max-w-xs">{selectedFile.name}</span>
                </div>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  onClick={removeFile}
                  className="h-6 w-6 hover:bg-gray-200"
                >
                  <X size={12} />
                </Button>
              </div>
            )}
            
            {/* Input area */}
            <div className="flex items-end w-full px-4 py-3 gap-3">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What do you want to know?"
                disabled={disabled}
                className="min-h-[44px] max-h-40 resize-none border-none focus:border-none focus:ring-0 p-0 flex-1 text-sm leading-6"
                rows={1}
              />
              
              <div className="flex items-center gap-2">
                {/* Attachment button */}
                {showAttachment && (
                  <Button
                    type="button"
                    onClick={handleFileClick}
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Paperclip size={16} className="text-gray-500" />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept={responseMode === 'endocs' 
                        ? '.pdf,.jpg,.jpeg,.png,.gif,.svg' 
                        : '.xlsx,.xls,.csv'}
                    />
                  </Button>
                )}
                
                <Button
                  type="submit"
                  disabled={!message.trim() || disabled}
                  className="rounded-full bg-[#4E50A8] hover:bg-[#4042a0] p-0 h-9 w-9 flex-shrink-0 disabled:opacity-50"
                >
                  <ArrowUp size={18} className="text-white" />
                </Button>
              </div>
            </div>
            
            {/* Bottom toolbar with mode selector */}
            <div className="flex items-center px-4 py-2 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Mode:</span>
                <Select
                  value={responseMode}
                  onValueChange={(value) => {
                    setResponseMode(value as ResponseMode);
                    if (value === 'encore') {
                      setSelectedFile(null);
                    }
                  }}
                >
                  <SelectTrigger className="border border-gray-200 rounded-full px-3 py-1 h-7 text-xs bg-white w-auto min-w-[80px] focus:ring-1 focus:ring-[#4E50A8]">
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
