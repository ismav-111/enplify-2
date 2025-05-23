
import { useChat } from '@/hooks/useChat';
import Sidebar from '@/components/Sidebar';
import ChatMessage from '@/components/ChatMessage';
import MessageInput from '@/components/MessageInput';
import { useEffect, useState } from 'react';
import { Files, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import type { ResponseMode } from '@/components/MessageInput';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  date: Date;
}

const Index = () => {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    createNewChat,
    sendMessage,
    clearAllConversations,
    getCurrentConversation,
    isLoading
  } = useChat();

  // Sample uploaded files data (in a real app, this would come from a backend)
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([
    { id: '1', name: 'report.pdf', type: 'application/pdf', size: 2500000, date: new Date(2023, 4, 15) },
    { id: '2', name: 'data.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 1800000, date: new Date(2023, 4, 10) },
    { id: '3', name: 'image.jpg', type: 'image/jpeg', size: 850000, date: new Date(2023, 4, 5) },
    { id: '4', name: 'presentation.pptx', type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', size: 3200000, date: new Date(2023, 4, 1) },
    { id: '5', name: 'notes.txt', type: 'text/plain', size: 25000, date: new Date(2023, 3, 28) },
    { id: '6', name: 'contract.pdf', type: 'application/pdf', size: 1200000, date: new Date(2023, 3, 25) },
    { id: '7', name: 'screenshot.png', type: 'image/png', size: 950000, date: new Date(2023, 3, 20) },
    { id: '8', name: 'requirements.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 780000, date: new Date(2023, 3, 15) },
    { id: '9', name: 'dataset.csv', type: 'text/csv', size: 920000, date: new Date(2023, 3, 10) },
    { id: '10', name: 'logo.svg', type: 'image/svg+xml', size: 150000, date: new Date(2023, 3, 5) },
    { id: '11', name: 'video.mp4', type: 'video/mp4', size: 8500000, date: new Date(2023, 3, 1) },
    { id: '12', name: 'audio.mp3', type: 'audio/mpeg', size: 4200000, date: new Date(2023, 2, 25) }
  ]);
  
  // Active file filter - 'all', 'endocs' or 'ensights'
  const [fileFilter, setFileFilter] = useState<'all' | 'endocs' | 'ensights'>('all');

  // Create a new chat automatically when there are no conversations
  useEffect(() => {
    if (conversations.length === 0) {
      createNewChat();
    }
  }, [conversations.length, createNewChat]);

  const currentConversation = getCurrentConversation();
  const hasMessages = currentConversation && currentConversation.messages.length > 0;

  const handleSendMessage = (message: string, mode: ResponseMode, file?: File) => {
    sendMessage(message, mode, file);
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  // Filter files based on type
  const getFilteredFiles = (files: FileItem[], filter: 'all' | 'endocs' | 'ensights'): FileItem[] => {
    if (filter === 'all') return files;
    
    const endocsTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/png', 
      'image/gif', 
      'image/svg+xml'
    ];
    
    const ensightsTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
      'text/csv'
    ];
    
    const allowedTypes = filter === 'endocs' ? endocsTypes : ensightsTypes;
    return files.filter(file => allowedTypes.includes(file.type));
  };

  // Get file type display text
  const getFileTypeDisplay = (fileType: string): string => {
    switch(fileType) {
      case 'application/pdf': return 'PDF';
      case 'image/jpeg': case 'image/png': case 'image/gif': return 'IMG';
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': return 'XLS';
      case 'text/csv': return 'CSV';
      default: return fileType.split('/')[1]?.toUpperCase().slice(0, 3) || 'FILE';
    }
  };

  // Get filtered files based on current filter
  const filteredFiles = getFilteredFiles(uploadedFiles, fileFilter);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversation={activeConversation}
        onNewChat={createNewChat}
        onSelectConversation={setActiveConversation}
        onClearAll={clearAllConversations}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-white">
        {/* Top Bar with Files and User Icons */}
        <div className="absolute top-4 right-4 z-30 flex gap-2">
          {/* Files Icon with Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-white shadow-sm hover:shadow">
                <Files size={18} className="text-[#4E50A8]" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-medium">Your Uploaded Files</h3>
                <p className="text-xs text-gray-500 mt-1">Recent files you've shared in conversations</p>
                
                {/* File type filter tabs */}
                <div className="flex gap-2 mt-3">
                  <Button 
                    variant={fileFilter === 'all' ? 'default' : 'outline'} 
                    size="sm" 
                    className={fileFilter === 'all' ? 'bg-[#4E50A8] text-white' : 'text-gray-600'} 
                    onClick={() => setFileFilter('all')}
                  >
                    All
                  </Button>
                  <Button 
                    variant={fileFilter === 'endocs' ? 'default' : 'outline'} 
                    size="sm" 
                    className={fileFilter === 'endocs' ? 'bg-[#4E50A8] text-white' : 'text-gray-600'} 
                    onClick={() => setFileFilter('endocs')}
                  >
                    Endocs
                  </Button>
                  <Button 
                    variant={fileFilter === 'ensights' ? 'default' : 'outline'} 
                    size="sm" 
                    className={fileFilter === 'ensights' ? 'bg-[#4E50A8] text-white' : 'text-gray-600'} 
                    onClick={() => setFileFilter('ensights')}
                  >
                    Ensights
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="h-64">
                <div className="p-2">
                  {filteredFiles.slice(0, 10).map((file) => (
                    <div key={file.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
                      <div className="w-8 h-8 bg-[#F1F1F9] rounded-md flex items-center justify-center flex-shrink-0">
                        <span className="text-[#4E50A8] text-xs font-medium">{getFileTypeDisplay(file.type)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                  ))}
                  
                  {filteredFiles.length === 0 && (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No {fileFilter} files found
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              {filteredFiles.length > 10 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="p-3 border-t border-gray-100">
                      <Button variant="ghost" size="sm" className="w-full justify-center text-[#4E50A8]">
                        View All Files
                      </Button>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>All {fileFilter !== 'all' ? fileFilter + ' ' : ''}Files</DialogTitle>
                      <DialogDescription>
                        Browse all your uploaded {fileFilter !== 'all' ? fileFilter + ' ' : ''}files
                      </DialogDescription>
                    </DialogHeader>
                    
                    {/* File type filter tabs in dialog */}
                    <div className="flex gap-2 mb-4">
                      <Button 
                        variant={fileFilter === 'all' ? 'default' : 'outline'} 
                        size="sm" 
                        className={fileFilter === 'all' ? 'bg-[#4E50A8] text-white' : 'text-gray-600'} 
                        onClick={() => setFileFilter('all')}
                      >
                        All
                      </Button>
                      <Button 
                        variant={fileFilter === 'endocs' ? 'default' : 'outline'} 
                        size="sm" 
                        className={fileFilter === 'endocs' ? 'bg-[#4E50A8] text-white' : 'text-gray-600'} 
                        onClick={() => setFileFilter('endocs')}
                      >
                        Endocs
                      </Button>
                      <Button 
                        variant={fileFilter === 'ensights' ? 'default' : 'outline'} 
                        size="sm" 
                        className={fileFilter === 'ensights' ? 'bg-[#4E50A8] text-white' : 'text-gray-600'} 
                        onClick={() => setFileFilter('ensights')}
                      >
                        Ensights
                      </Button>
                    </div>
                    
                    <ScrollArea className="flex-1 pr-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1">
                        {filteredFiles.map((file) => (
                          <div key={file.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-md hover:bg-gray-50">
                            <div className="w-10 h-10 bg-[#F1F1F9] rounded-md flex items-center justify-center flex-shrink-0">
                              <span className="text-[#4E50A8] text-xs font-medium">{getFileTypeDisplay(file.type)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                              <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                <p className="text-xs text-gray-400">{file.date.toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {filteredFiles.length === 0 && (
                          <div className="col-span-2 p-8 text-center text-gray-500">
                            No {fileFilter} files found
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              )}
            </PopoverContent>
          </Popover>
          
          {/* User avatar */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-white shadow-sm hover:shadow">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-white text-gray-700">
                    <User size={18} />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-4 shadow-lg" align="end">
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-white text-[#4E50A8]">
                      <User size={20} />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Andrew Neilson</p>
                    <p className="text-xs text-gray-500">andrew@example.com</p>
                  </div>
                </div>
                <Link to="/settings" className="block w-full">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full justify-start text-gray-700 hover:bg-gray-100"
                  >
                    <Settings size={16} className="mr-2" />
                    Settings
                  </Button>
                </Link>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Chat Messages */}
        <div className={`flex-1 overflow-y-auto bg-white ${!hasMessages ? 'flex items-center justify-center' : ''}`}>
          {hasMessages ? (
            <div className="max-w-3xl mx-auto px-4 py-8 w-full">
              <div className="space-y-6">
                {currentConversation.messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#d5d5ec] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#4E50A8] font-semibold">e</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-xl w-full px-4 flex flex-col items-center">
              {/* Welcome message */}
              <div className="text-center mb-10">
                <div className="w-16 h-16 rounded-full bg-[#d5d5ec] flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#4E50A8] font-bold text-xl font-comfortaa">e</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2 font-comfortaa">Welcome to enplify.ai</h1>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Your intelligent AI assistant. Ask me anything and I'll provide 
                  helpful insights, answers, and information.
                </p>
              </div>
              <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} centered={true} />
            </div>
          )}
        </div>

        {/* Message Input - Only show at bottom when there are messages */}
        {hasMessages && (
          <div className="w-full border-t border-gray-100 bg-white py-4">
            <div className="max-w-3xl mx-auto px-4">
              <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} centered={false} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
