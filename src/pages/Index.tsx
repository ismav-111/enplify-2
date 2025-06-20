import { useChat } from '@/hooks/useChat';
import Sidebar from '@/components/Sidebar';
import ChatMessage from '@/components/ChatMessage';
import MessageInput from '@/components/MessageInput';
import { useEffect, useState } from 'react';
import { Files, Settings, User, Search, Eye, Trash2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { ResponseMode } from '@/components/MessageInput';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  date: Date;
  url?: string;
  chatSessionId: string;
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
    isLoading,
    deleteConversation,
    renameConversation
  } = useChat();

  // Updated to make chatSessionId required for all files
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([
    { id: '1', name: 'quarterly_report.pdf', type: 'application/pdf', size: 2500000, date: new Date(2023, 4, 15), url: '/placeholder.svg', chatSessionId: '1' },
    { id: '2', name: 'sales_data.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 1800000, date: new Date(2023, 4, 10), chatSessionId: '1' },
    { id: '3', name: 'employee_handbook.pdf', type: 'application/pdf', size: 850000, date: new Date(2023, 4, 5), url: '/placeholder.svg', chatSessionId: '2' },
    { id: '4', name: 'financial_analysis.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 3200000, date: new Date(2023, 4, 1), chatSessionId: '3' },
    { id: '5', name: 'policy_document.pdf', type: 'application/pdf', size: 1200000, date: new Date(2023, 3, 25), url: '/placeholder.svg', chatSessionId: '2' },
    { id: '6', name: 'meeting_notes.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 780000, date: new Date(2023, 3, 15), chatSessionId: '1' },
    { id: '7', name: 'revenue_tracking.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 920000, date: new Date(2023, 3, 10), chatSessionId: '3' },
    { id: '8', name: 'compliance_guide.pdf', type: 'application/pdf', size: 1500000, date: new Date(2023, 3, 5), url: '/placeholder.svg', chatSessionId: '4' },
    { id: '9', name: 'budget_forecast.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 2100000, date: new Date(2023, 3, 1), chatSessionId: '1' },
    { id: '10', name: 'training_manual.pdf', type: 'application/pdf', size: 1800000, date: new Date(2023, 2, 25), url: '/placeholder.svg', chatSessionId: '2' }
  ]);
  
  // Active file filter - 'all', 'endocs' or 'ensights'
  const [fileFilter, setFileFilter] = useState<'all' | 'endocs' | 'ensights'>('all');
  
  // Search query for files
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  
  // File viewer state
  const [viewingFile, setViewingFile] = useState<FileItem | null>(null);

  // Create a new chat automatically when there are no conversations
  useEffect(() => {
    if (conversations.length === 0) {
      createNewChat();
    }
  }, [conversations.length, createNewChat]);

  const currentConversation = getCurrentConversation();
  const hasMessages = currentConversation && currentConversation.messages.length > 0;

  const handleSendMessage = (message: string, mode: ResponseMode, files?: File[]) => {
    // Add uploaded files to the current session
    if (files && files.length > 0 && currentConversation) {
      const newFiles: FileItem[] = files.map(file => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        date: new Date(),
        chatSessionId: currentConversation.id,
        url: file.type === 'application/pdf' ? '/placeholder.svg' : undefined
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
    
    sendMessage(message, mode, files?.[0]); // Keep single file for backward compatibility
  };

  const handleStopGeneration = () => {
    // TODO: Implement stop generation logic in useChat hook
    console.log('Stop generation requested');
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  // Updated filter function to consider chat session and mode-specific file types
  const getFilteredFiles = (files: FileItem[], filter: 'all' | 'endocs' | 'ensights', searchQuery: string): FileItem[] => {
    let filteredFiles = files;
    
    // First filter by current chat session
    if (currentConversation) {
      filteredFiles = filteredFiles.filter(file => 
        file.chatSessionId === currentConversation.id
      );
    }
    
    // Then filter by type based on mode
    if (filter !== 'all') {
      const endocsTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      const ensightsTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      const allowedTypes = filter === 'endocs' ? endocsTypes : ensightsTypes;
      filteredFiles = filteredFiles.filter(file => allowedTypes.includes(file.type));
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filteredFiles = filteredFiles.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filteredFiles;
  };

  // Get file type display text
  const getFileTypeDisplay = (fileType: string): string => {
    switch(fileType) {
      case 'application/pdf': return 'PDF';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return 'DOC';
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': return 'XLS';
      default: return fileType.split('/')[1]?.toUpperCase().slice(0, 3) || 'FILE';
    }
  };

  // Delete file function
  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(files => files.filter(file => file.id !== fileId));
  };

  // Check if file can be viewed (has URL and is viewable type)
  const canViewFile = (file: FileItem): boolean => {
    const viewableTypes = ['application/pdf'];
    return !!file.url && viewableTypes.includes(file.type);
  };

  // Get filtered files based on current filter and search
  const filteredFiles = getFilteredFiles(uploadedFiles, fileFilter, fileSearchQuery);

  // Get files for current session only - this is the key fix for the badge count
  const sessionFiles = currentConversation 
    ? uploadedFiles.filter(file => file.chatSessionId === currentConversation.id)
    : [];

  return (
    <>
      <div className="relative">
        <div className="h-screen bg-white flex overflow-hidden">
          {/* Fixed Sidebar */}
          <div className="flex-shrink-0">
            <Sidebar
              conversations={conversations}
              activeConversation={activeConversation}
              onNewChat={createNewChat}
              onSelectConversation={setActiveConversation}
              onClearAll={clearAllConversations}
              onDeleteConversation={deleteConversation}
              onRenameConversation={renameConversation}
            />
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col h-screen bg-white">
            {/* Fixed Top Bar with Files and User Icons */}
            <div className="absolute top-4 right-4 z-30 flex gap-2">
              {/* Files Icon with Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-white shadow-sm hover:shadow relative">
                    <Files size={18} className="text-[#4E50A8]" />
                    {sessionFiles.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#4E50A8] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {sessionFiles.length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-sm font-medium">Session Files</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Files from this conversation ({currentConversation?.title || 'Current Session'}) - {sessionFiles.length} file{sessionFiles.length !== 1 ? 's' : ''}
                    </p>
                    
                    {/* Search input */}
                    <div className="relative mt-3 mb-3">
                      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search files..."
                        value={fileSearchQuery}
                        onChange={(e) => setFileSearchQuery(e.target.value)}
                        className="pl-9 h-8 text-sm"
                      />
                    </div>
                    
                    {/* File type filter tabs - show only relevant modes */}
                    <div className="flex gap-2">
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
                        Docs
                      </Button>
                      <Button 
                        variant={fileFilter === 'ensights' ? 'default' : 'outline'} 
                        size="sm" 
                        className={fileFilter === 'ensights' ? 'bg-[#4E50A8] text-white' : 'text-gray-600'} 
                        onClick={() => setFileFilter('ensights')}
                      >
                        Excel
                      </Button>
                    </div>
                  </div>
                  
                  <ScrollArea className="h-64">
                    <div className="p-2">
                      {filteredFiles.slice(0, 10).map((file) => (
                        <div key={file.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md group">
                          <div className="w-8 h-8 bg-[#F1F1F9] rounded-md flex items-center justify-center flex-shrink-0">
                            <span className="text-[#4E50A8] text-xs font-medium">{getFileTypeDisplay(file.type)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {canViewFile(file) && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => setViewingFile(file)}
                              >
                                <Eye size={12} />
                              </Button>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-700">
                                  <Trash2 size={12} />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete File</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{file.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteFile(file.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ))}
                      
                      {filteredFiles.length === 0 && (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          {fileSearchQuery 
                            ? 'No files found matching your search' 
                            : `No ${fileFilter === 'all' ? '' : fileFilter + ' '}files in this session`
                          }
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
                          <DialogTitle>All {fileFilter !== 'all' ? fileFilter + ' '}Session Files</DialogTitle>
                          <DialogDescription>
                            Browse all your uploaded {fileFilter !== 'all' ? fileFilter + ' '}files from this conversation
                          </DialogDescription>
                        </DialogHeader>
                        
                        {/* Search input in dialog */}
                        <div className="relative mb-4">
                          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            placeholder="Search files..."
                            value={fileSearchQuery}
                            onChange={(e) => setFileSearchQuery(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                        
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
                            Docs
                          </Button>
                          <Button 
                            variant={fileFilter === 'ensights' ? 'default' : 'outline'} 
                            size="sm" 
                            className={fileFilter === 'ensights' ? 'bg-[#4E50A8] text-white' : 'text-gray-600'} 
                            onClick={() => setFileFilter('ensights')}
                          >
                            Excel
                          </Button>
                        </div>
                        
                        <ScrollArea className="flex-1 pr-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1">
                            {filteredFiles.map((file) => (
                              <div key={file.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-md hover:bg-gray-50 group">
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
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {canViewFile(file) && (
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8"
                                      onClick={() => setViewingFile(file)}
                                    >
                                      <Eye size={14} />
                                    </Button>
                                  )}
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700">
                                        <Trash2 size={14} />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete File</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete "{file.name}"? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => handleDeleteFile(file.id)}
                                          className="bg-red-500 hover:bg-red-600"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            ))}
                            
                            {filteredFiles.length === 0 && (
                              <div className="col-span-2 p-8 text-center text-gray-500">
                                {fileSearchQuery 
                                  ? 'No files found matching your search' 
                                  : `No ${fileFilter === 'all' ? '' : fileFilter + ' '}files in this session`
                                }
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

            {/* File Viewer Dialog */}
            {viewingFile && (
              <Dialog open={!!viewingFile} onOpenChange={() => setViewingFile(null)}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>{viewingFile.name}</DialogTitle>
                    <DialogDescription>
                      {getFileTypeDisplay(viewingFile.type)} • {formatFileSize(viewingFile.size)} • {viewingFile.date.toLocaleDateString()}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md min-h-[400px]">
                    {viewingFile.type === 'application/pdf' ? (
                      <div className="text-center text-gray-500">
                        <Files size={48} className="mx-auto mb-2" />
                        <p>PDF Preview</p>
                        <p className="text-sm">Click to download or view in browser</p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <Files size={48} className="mx-auto mb-2" />
                        <p>File preview not available</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Scrollable Chat Content - Updated to match Lovable proportions */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                {hasMessages ? (
                  <div className="max-w-4xl mx-auto px-4 py-6 w-full min-h-full">
                    <div className="space-y-6">
                      {currentConversation.messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                      ))}
                      {isLoading && (
                        <div className="flex mb-6">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4 border border-gray-200">
                            <span className="text-[#4E50A8] font-bold text-sm font-comfortaa">e</span>
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="relative overflow-hidden max-w-xs">
                              {/* Updated compact gradient wave animation */}
                              <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4E50A8] to-transparent opacity-80"
                                  style={{
                                    animation: 'compactWave 1.8s ease-in-out infinite',
                                    width: '120%'
                                  }}
                                />
                              </div>

                              {/* Updated status text */}
                              <div className="mt-2 flex items-center gap-2">
                                <div className="relative">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#4E50A8] animate-pulse"></div>
                                  <div 
                                    className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-[#4E50A8] opacity-30"
                                    style={{ animation: 'compactPing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}
                                  />
                                </div>
                                <div className="text-xs text-gray-600 font-medium">
                                  <span className="text-[#4E50A8] animate-pulse">
                                    Thinking
                                  </span>
                                  <span 
                                    className="inline-block ml-1 text-[#4E50A8]"
                                    style={{ animation: 'compactDots 1.2s steps(4, end) infinite' }}
                                  >
                                    ...
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="max-w-2xl w-full px-6 flex flex-col items-center justify-center">
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4 border border-gray-200">
                          <span className="text-[#4E50A8] font-bold text-2xl font-comfortaa">e</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2 font-comfortaa">Welcome to enplify2.o</h1>
                        <p className="text-gray-600 max-w-md mx-auto">
                          Your intelligent AI assistant for documents, insights, and conversations. 
                          Choose your mode and start exploring.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Fixed Message Input at Bottom - Updated to match Lovable proportions */}
            <div className="flex-shrink-0 w-full bg-white py-3">
              <div className="max-w-4xl mx-auto px-4">
                <MessageInput 
                  onSendMessage={handleSendMessage} 
                  disabled={isLoading} 
                  centered={!hasMessages}
                  isLoading={isLoading}
                  onStopGeneration={handleStopGeneration}
                />
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes compactWave {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(30%); }
            100% { transform: translateX(150%); }
          }
          
          @keyframes compactShimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(150%); }
          }
          
          @keyframes microOrb1 {
            0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.7; }
            33% { transform: translateY(-4px) translateX(6px) scale(1.3); opacity: 0.9; }
            66% { transform: translateY(-2px) translateX(8px) scale(0.8); opacity: 0.4; }
          }
          
          @keyframes microOrb2 {
            0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.6; }
            40% { transform: translateY(-3px) translateX(-5px) scale(1.2); opacity: 0.8; }
            80% { transform: translateY(-1px) translateX(-3px) scale(0.9); opacity: 0.3; }
          }
          
          @keyframes microOrb3 {
            0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.5; }
            50% { transform: translateY(-2px) translateX(-4px) scale(1.1); opacity: 0.7; }
          }
          
          @keyframes compactPing {
            75%, 100% { transform: scale(2); opacity: 0; }
          }
          
          @keyframes compactDots {
            0%, 20% { opacity: 1; }
            40% { opacity: 1; }
            60%, 100% { opacity: 1; }
          }
        `}</style>
      </div>
    </>
  );
};

export default Index;
