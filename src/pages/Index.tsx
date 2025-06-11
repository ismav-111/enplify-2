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
  url?: string; // Optional URL for viewing files
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

  // Sample uploaded files data (in a real app, this would come from a backend)
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([
    { id: '1', name: 'report.pdf', type: 'application/pdf', size: 2500000, date: new Date(2023, 4, 15), url: '/placeholder.svg' },
    { id: '2', name: 'data.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 1800000, date: new Date(2023, 4, 10) },
    { id: '3', name: 'image.jpg', type: 'image/jpeg', size: 850000, date: new Date(2023, 4, 5), url: '/placeholder.svg' },
    { id: '4', name: 'presentation.pptx', type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', size: 3200000, date: new Date(2023, 4, 1) },
    { id: '5', name: 'notes.txt', type: 'text/plain', size: 25000, date: new Date(2023, 3, 28) },
    { id: '6', name: 'contract.pdf', type: 'application/pdf', size: 1200000, date: new Date(2023, 3, 25), url: '/placeholder.svg' },
    { id: '7', name: 'screenshot.png', type: 'image/png', size: 950000, date: new Date(2023, 3, 20), url: '/placeholder.svg' },
    { id: '8', name: 'requirements.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 780000, date: new Date(2023, 3, 15) },
    { id: '9', name: 'dataset.csv', type: 'text/csv', size: 920000, date: new Date(2023, 3, 10) },
    { id: '10', name: 'logo.svg', type: 'image/svg+xml', size: 150000, date: new Date(2023, 3, 5), url: '/placeholder.svg' },
    { id: '11', name: 'video.mp4', type: 'video/mp4', size: 8500000, date: new Date(2023, 3, 1) },
    { id: '12', name: 'audio.mp3', type: 'audio/mpeg', size: 4200000, date: new Date(2023, 2, 25) }
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

  const handleSendMessage = (message: string, mode: ResponseMode, file?: File) => {
    sendMessage(message, mode, file);
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

  // Filter files based on type and search query
  const getFilteredFiles = (files: FileItem[], filter: 'all' | 'endocs' | 'ensights', searchQuery: string): FileItem[] => {
    let filteredFiles = files;
    
    // Filter by type
    if (filter !== 'all') {
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
      case 'image/jpeg': case 'image/png': case 'image/gif': return 'IMG';
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': return 'XLS';
      case 'text/csv': return 'CSV';
      default: return fileType.split('/')[1]?.toUpperCase().slice(0, 3) || 'FILE';
    }
  };

  // Delete file function
  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(files => files.filter(file => file.id !== fileId));
  };

  // Check if file can be viewed (has URL and is viewable type)
  const canViewFile = (file: FileItem): boolean => {
    const viewableTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'application/pdf'];
    return !!file.url && viewableTypes.includes(file.type);
  };

  // Get filtered files based on current filter and search
  const filteredFiles = getFilteredFiles(uploadedFiles, fileFilter, fileSearchQuery);

  return (
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
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-white shadow-sm hover:shadow">
                <Files size={18} className="text-[#4E50A8]" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-medium">Your Uploaded Files</h3>
                <p className="text-xs text-gray-500 mt-1">Recent files you've shared in conversations</p>
                
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
                
                {/* File type filter tabs */}
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
                      {fileSearchQuery ? 'No files found matching your search' : `No ${fileFilter} files found`}
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
                            {fileSearchQuery ? 'No files found matching your search' : `No ${fileFilter} files found`}
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
                {viewingFile.type.startsWith('image/') ? (
                  <img 
                    src={viewingFile.url} 
                    alt={viewingFile.name}
                    className="max-w-full max-h-[400px] object-contain"
                  />
                ) : viewingFile.type === 'application/pdf' ? (
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

        {/* Scrollable Chat Content - Increased width */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {hasMessages ? (
              <div className="max-w-5xl mx-auto px-6 py-8 w-full min-h-full">
                <div className="space-y-4">
                  {currentConversation.messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {isLoading && (
                    <div className="flex mb-8">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 mt-1 border border-gray-200">
                        <span className="text-gray-700 font-bold text-sm font-comfortaa">e</span>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="relative overflow-hidden">
                          {/* Animated gradient waves */}
                          <div className="space-y-4">
                            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#595fb7] to-transparent opacity-60"
                                style={{
                                  animation: 'wave 2s ease-in-out infinite',
                                  background: 'linear-gradient(90deg, transparent, #595fb7, #4e50a8, transparent)',
                                  transform: 'translateX(-100%)'
                                }}
                              />
                            </div>
                            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden w-4/5">
                              <div 
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4e50a8] to-transparent opacity-60"
                                style={{
                                  animation: 'wave 2s ease-in-out infinite 0.3s',
                                  background: 'linear-gradient(90deg, transparent, #4e50a8, #595fb7, transparent)',
                                  transform: 'translateX(-100%)'
                                }}
                              />
                            </div>
                            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden w-3/5">
                              <div 
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#6366f1] to-transparent opacity-60"
                                style={{
                                  animation: 'wave 2s ease-in-out infinite 0.6s',
                                  background: 'linear-gradient(90deg, transparent, #6366f1, #595fb7, transparent)',
                                  transform: 'translateX(-100%)'
                                }}
                              />
                            </div>
                          </div>

                          {/* Floating particles */}
                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                            <div 
                              className="absolute w-1 h-1 bg-[#595fb7] rounded-full opacity-60"
                              style={{
                                animation: 'float1 3s ease-in-out infinite',
                                left: '10%',
                                top: '20%'
                              }}
                            />
                            <div 
                              className="absolute w-1.5 h-1.5 bg-[#4e50a8] rounded-full opacity-40"
                              style={{
                                animation: 'float2 4s ease-in-out infinite',
                                left: '60%',
                                top: '40%'
                              }}
                            />
                            <div 
                              className="absolute w-1 h-1 bg-[#6366f1] rounded-full opacity-50"
                              style={{
                                animation: 'float3 3.5s ease-in-out infinite',
                                left: '80%',
                                top: '10%'
                              }}
                            />
                          </div>

                          {/* Status text with pulsing effect */}
                          <div className="mt-6 flex items-center gap-3">
                            <div className="relative">
                              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#595fb7] to-[#4e50a8] animate-pulse"></div>
                              <div 
                                className="absolute inset-0 w-4 h-4 rounded-full bg-gradient-to-r from-[#595fb7] to-[#4e50a8] opacity-40"
                                style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}
                              />
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              <span className="animate-pulse">Crafting your response</span>
                              <span 
                                className="inline-block ml-1"
                                style={{ animation: 'dots 1.5s steps(4, end) infinite' }}
                              >
                                ...</span>
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
                  <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 font-comfortaa">Welcome to enplify2.o</h1>
                    <p className="text-gray-600 max-w-lg mx-auto mb-6">
                      Your intelligent AI assistant. Ask me anything and I'll provide 
                      helpful insights, answers, and information.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Fixed Message Input at Bottom - Increased width */}
        <div className="flex-shrink-0 w-full bg-white py-4">
          <div className="max-w-5xl mx-auto px-6">
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

      <style>{`
        @keyframes wave {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-8px) rotate(180deg); opacity: 0.3; }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-12px) rotate(-180deg); opacity: 0.8; }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
          50% { transform: translateY(-6px) rotate(90deg); opacity: 0.2; }
        }
        
        @keyframes dots {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60%, 100% { content: '...'; }
        }
      `}</style>
    </div>
  );
};

export default Index;
