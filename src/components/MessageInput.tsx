
import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Paperclip, Square, X } from 'lucide-react';
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
  onSendMessage: (message: string, mode: ResponseMode, files?: File[]) => void;
  disabled?: boolean;
  centered?: boolean;
  isLoading?: boolean;
  onStopGeneration?: () => void;
}

const MessageInput = ({ 
  onSendMessage, 
  disabled = false, 
  centered = false,
  isLoading = false,
  onStopGeneration
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [responseMode, setResponseMode] = useState<ResponseMode>('encore');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const prevModRef = useRef<ResponseMode>(responseMode);
  
  // Store valid file extensions per mode
  const validFileExtensions = {
    endocs: ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.doc', '.docx'],
    ensights: ['.xlsx', '.xls', '.csv']
  };
  
  useEffect(() => {
    // Clear selected files when changing modes
    if (prevModRef.current !== responseMode) {
      setSelectedFiles([]);
      prevModRef.current = responseMode;
    }
  }, [responseMode]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isLoading) {
      onSendMessage(message.trim(), responseMode, selectedFiles.length > 0 ? selectedFiles : undefined);
      setMessage('');
      setSelectedFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        handleSubmit(e);
      }
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
        description: "Endocs supports PDF, image files, and documents.",
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
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles: File[] = [];
      
      for (const file of newFiles) {
        if (validateFileType(file, responseMode)) {
          // Check for duplicates
          const isDuplicate = selectedFiles.some(existingFile => 
            existingFile.name === file.name && existingFile.size === file.size
          );
          
          if (!isDuplicate) {
            validFiles.push(file);
          }
        }
      }
      
      if (validFiles.length > 0) {
        setSelectedFiles(prev => [...prev, ...validFiles]);
      }
      
      e.target.value = '';
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleStopClick = () => {
    if (onStopGeneration) {
      onStopGeneration();
    }
  };

  const showAttachment = responseMode === 'endocs' || responseMode === 'ensights';

  return (
    <div className={`${centered ? 'w-full' : ''}`}>
      <div className="max-w-5xl mx-auto">
        <form ref={formRef} onSubmit={handleSubmit} className="relative" onClick={handleFormClick}>
          <div className="flex flex-col w-full rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden">
            {/* Selected files display */}
            {selectedFiles.length > 0 && (
              <div className="px-4 pt-3 pb-2 border-b border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-sm"
                    >
                      <Paperclip size={14} className="text-gray-500" />
                      <span className="text-gray-700 truncate max-w-[150px]">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Textarea area */}
            <div className="flex items-start w-full px-4 pt-4 pb-2">
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
            </div>
            
            {/* Action buttons area */}
            <div className="flex items-center justify-between px-4 pb-3 pt-1">
              {/* Left side: Attachment button first, then mode selector */}
              <div className="flex items-center gap-2">
                {/* Attachment button - first */}
                {showAttachment && (
                  <button
                    type="button"
                    onClick={handleFileClick}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                  >
                    <Paperclip size={18} />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      multiple
                      accept={responseMode === 'endocs' 
                        ? '.pdf,.jpg,.jpeg,.png,.gif,.svg,.doc,.docx' 
                        : '.xlsx,.xls,.csv'}
                    />
                  </button>
                )}

                {/* Mode selector - second */}
                <Select
                  value={responseMode}
                  onValueChange={(value) => {
                    setResponseMode(value as ResponseMode);
                    if (value === 'encore') {
                      setSelectedFiles([]);
                    }
                  }}
                >
                  <SelectTrigger className="border-0 rounded-lg px-3 py-1.5 h-auto text-xs bg-gray-50 shadow-none w-auto min-w-[80px] text-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start" className="w-[120px]">
                    <SelectItem value="encore">Encore</SelectItem>
                    <SelectItem value="endocs">Endocs</SelectItem>
                    <SelectItem value="ensights">Ensights</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Right side: File count and Send/Stop button */}
              <div className="flex items-center gap-3">
                {/* Show selected file count if any */}
                {selectedFiles.length > 0 && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Paperclip size={12} className="mr-1" />
                    <span>{selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}</span>
                  </div>
                )}

                {/* Send or Stop button */}
                {isLoading ? (
                  <Button
                    type="button"
                    onClick={handleStopClick}
                    size="icon"
                    className="rounded-full bg-[#595fb7] hover:bg-[#4e50a8] active:bg-[#373995] h-8 w-8 flex-shrink-0 transition-colors"
                  >
                    <Square size={16} className="text-white" fill="currentColor" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!message.trim() || disabled}
                    size="icon"
                    className="rounded-full bg-[#595fb7] hover:bg-[#4e50a8] active:bg-[#373995] disabled:bg-gray-300 h-8 w-8 flex-shrink-0 transition-colors"
                  >
                    <ArrowUp size={16} className="text-white" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
