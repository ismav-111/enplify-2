
import { useState, useRef, useEffect } from 'react';
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
  const formRef = useRef<HTMLFormElement>(null);
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

  const showAttachment = responseMode === 'endocs' || responseMode === 'ensights';

  return (
    <div className={`${centered ? 'w-full' : ''}`}>
      <div className="max-w-3xl mx-auto">
        <form ref={formRef} onSubmit={handleSubmit} className="relative" onClick={handleFormClick}>
          <div className="flex flex-col w-full rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden">
            {/* Input area */}
            <div className="flex items-end w-full px-4 py-3">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What do you want to know?"
                disabled={disabled}
                className="min-h-[20px] max-h-40 resize-none border-none focus:border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 flex-1 bg-transparent text-base"
                rows={1}
              />
              
              {/* Action buttons */}
              <div className="flex items-center gap-2 ml-3">
                {/* Attachment button */}
                {showAttachment && (
                  <button
                    type="button"
                    onClick={handleFileClick}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                  >
                    <Paperclip size={20} />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept={responseMode === 'endocs' 
                        ? '.pdf,.jpg,.jpeg,.png,.gif,.svg' 
                        : '.xlsx,.xls,.csv'}
                    />
                  </button>
                )}
                
                <Button
                  type="submit"
                  disabled={!message.trim() || disabled}
                  size="icon"
                  className="rounded-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 h-8 w-8 flex-shrink-0 transition-colors"
                >
                  <ArrowUp size={16} className="text-white" />
                </Button>
              </div>
            </div>
            
            {/* Bottom toolbar with mode selector */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50/50">
              <div className="flex items-center gap-3">
                {/* Mode selector */}
                <Select
                  value={responseMode}
                  onValueChange={(value) => {
                    setResponseMode(value as ResponseMode);
                    if (value === 'encore') {
                      setSelectedFile(null);
                    }
                  }}
                >
                  <SelectTrigger className="border-0 rounded-lg px-3 py-1.5 h-auto text-xs bg-white shadow-none w-auto min-w-[80px] text-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start" className="w-[120px]">
                    <SelectItem value="encore">Encore</SelectItem>
                    <SelectItem value="endocs">Endocs</SelectItem>
                    <SelectItem value="ensights">Ensights</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Show selected file name if any */}
              {selectedFile && (
                <div className="flex items-center text-xs text-gray-500">
                  <Paperclip size={12} className="mr-1" />
                  <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
