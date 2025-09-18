import { useChat } from '@/hooks/useChat';
import Sidebar from '@/components/Sidebar';
import ChatMessage from '@/components/ChatMessage';
import MessageInput from '@/components/MessageInput';
import ResponsePreferences, { ResponsePreferences as ResponsePreferencesType } from '@/components/ResponsePreferences';
import { useEffect, useState } from 'react';
import { Files, Settings, User, Search, Eye, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import type { ResponseMode } from '@/components/MessageInput';
import MinimalOnboardingWizard from "@/components/MinimalOnboardingWizard"
import { useMinimalOnboarding } from "@/hooks/useMinimalOnboarding"

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

  const { showOnboarding, completeOnboarding, closeOnboarding } = useMinimalOnboarding()

  // Response preferences state
  const [responsePreferences, setResponsePreferences] = useState<ResponsePreferencesType>({
    format: 'text',
    dataSource: 'vector'
  });

  // Updated to make chatSessionId required for all files
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([{
    id: '1',
    name: 'quarterly_report.pdf',
    type: 'application/pdf',
    size: 2500000,
    date: new Date(2023, 4, 15),
    url: '/placeholder.svg',
    chatSessionId: '1'
  }, {
    id: '2',
    name: 'sales_data.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 1800000,
    date: new Date(2023, 4, 10),
    chatSessionId: '1'
  }, {
    id: '3',
    name: 'employee_handbook.pdf',
    type: 'application/pdf',
    size: 850000,
    date: new Date(2023, 4, 5),
    url: '/placeholder.svg',
    chatSessionId: '2'
  }, {
    id: '4',
    name: 'financial_analysis.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 3200000,
    date: new Date(2023, 4, 1),
    chatSessionId: '3'
  }, {
    id: '5',
    name: 'policy_document.pdf',
    type: 'application/pdf',
    size: 1200000,
    date: new Date(2023, 3, 25),
    url: '/placeholder.svg',
    chatSessionId: '2'
  }, {
    id: '6',
    name: 'meeting_notes.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 780000,
    date: new Date(2023, 3, 15),
    chatSessionId: '1'
  }, {
    id: '7',
    name: 'revenue_tracking.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 920000,
    date: new Date(2023, 3, 10),
    chatSessionId: '3'
  }, {
    id: '8',
    name: 'compliance_guide.pdf',
    type: 'application/pdf',
    size: 1500000,
    date: new Date(2023, 3, 5),
    url: '/placeholder.svg',
    chatSessionId: '4'
  }, {
    id: '9',
    name: 'budget_forecast.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 2100000,
    date: new Date(2023, 3, 1),
    chatSessionId: '1'
  }, {
    id: '10',
    name: 'training_manual.pdf',
    type: 'application/pdf',
    size: 1800000,
    date: new Date(2023, 2, 25),
    url: '/placeholder.svg',
    chatSessionId: '2'
  }]);

  // Active file filter - 'all', 'endocs' or 'ensights'
  const [fileFilter, setFileFilter] = useState<'all' | 'endocs' | 'ensights'>('all');

  // Search query for files
  const [fileSearchQuery, setFileSearchQuery] = useState('');

  // File viewer state
  const [viewingFile, setViewingFile] = useState<FileItem | null>(null);

  // Sources sidebar state
  const [isSourcesSidebarOpen, setIsSourcesSidebarOpen] = useState(false);
  const [currentSources, setCurrentSources] = useState<any>(null);

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

    // Include response preferences in the message
    sendMessage(message, mode, files?.[0], responsePreferences);
  };

  const handleStopGeneration = () => {
    // TODO: Implement stop generation logic in useChat hook
    console.log('Stop generation requested');
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  // Updated filter function to consider chat session and mode-specific file types
  const getFilteredFiles = (files: FileItem[], filter: 'all' | 'endocs' | 'ensights', searchQuery: string): FileItem[] => {
    let filteredFiles = files;

    // First filter by current chat session
    if (currentConversation) {
      filteredFiles = filteredFiles.filter(file => file.chatSessionId === currentConversation.id);
    }

    // Then filter by type based on mode
    if (filter !== 'all') {
      const endocsTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const ensightsTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      const allowedTypes = filter === 'endocs' ? endocsTypes : ensightsTypes;
      filteredFiles = filteredFiles.filter(file => allowedTypes.includes(file.type));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filteredFiles = filteredFiles.filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filteredFiles;
  };

  // Get file type display text
  const getFileTypeDisplay = (fileType: string): string => {
    switch (fileType) {
      case 'application/pdf':
        return 'PDF';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'DOC';
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return 'XLS';
      default:
        return fileType.split('/')[1]?.toUpperCase().slice(0, 3) || 'FILE';
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
  const sessionFiles = currentConversation ? uploadedFiles.filter(file => file.chatSessionId === currentConversation.id) : [];

  // Check if files icon should be shown (hide for encore mode)
  const showFilesIcon = currentConversation?.mode !== 'encore';

  return <div className="flex h-screen bg-background">
      {/* Fixed Sidebar */}
      <div className="flex-shrink-0">
        <Sidebar conversations={conversations} activeConversation={activeConversation} onNewChat={createNewChat} onSelectConversation={setActiveConversation} onClearAll={clearAllConversations} onDeleteConversation={deleteConversation} onRenameConversation={renameConversation} />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Chat Area Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-gray-100 bg-white">
          {/* Left side - Empty space */}
          <div className="flex items-center gap-3">
          </div>
          
          <div className="flex gap-2">
            {/* Response Preferences */}
            <ResponsePreferences preferences={responsePreferences} onPreferencesChange={setResponsePreferences} mode={currentConversation?.mode || 'encore'} />
            
            {/* Files Icon with Popover - Only show if not encore mode */}
            {showFilesIcon && <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-white shadow-sm hover:shadow relative transition-colors">
                    <Files size={18} className="text-[#4E50A8] transition-colors" />
                    {sessionFiles.length > 0 && <span className="absolute -top-1 -right-1 bg-[#4E50A8] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {sessionFiles.length}
                      </span>}
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
                      <Input placeholder="Search files..." value={fileSearchQuery} onChange={e => setFileSearchQuery(e.target.value)} className="pl-9 h-8 text-sm" />
                    </div>
                    
                    {/* File type filter tabs - show only relevant modes */}
                    <div className="flex gap-2">
                      <Button variant={fileFilter === 'all' ? 'default' : 'outline'} size="sm" className={fileFilter === 'all' ? 'bg-[#4E50A8] text-white' : 'text-gray-600'} onClick={() => setFileFilter('all')}>
                        All
                      </Button>
                      <Button variant={fileFilter === 'endocs' ? 'default' : 'outline'} size="sm" className={fileFilter === 'endocs' ? 'bg-[#4E50A8] text-white' : 'text-gray-600'} onClick={() => setFileFilter('endocs')}>
                        Docs
                      </Button>
                      <Button variant={fileFilter === 'ensights' ? 'default' : 'outline'} size="sm" className={fileFilter === 'ensights' ? 'bg-[#4E50A8] text-white' : 'text-gray-600'} onClick={() => setFileFilter('ensights')}>
                        Excel
                      </Button>
                    </div>
                  </div>
                  
                  <ScrollArea className="h-64">
                    <div className="p-2">
                      {filteredFiles.slice(0, 10).map(file => <div key={file.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md group">
                          <div className="w-8 h-8 bg-[#F1F1F9] rounded-md flex items-center justify-center flex-shrink-0">
                            <span className="text-[#4E50A8] text-xs font-medium">{getFileTypeDisplay(file.type)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {canViewFile(file) && <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-blue-50 hover:text-blue-700 transition-colors" onClick={() => setViewingFile(file)}>
                                <Eye size={12} />
                              </Button>}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-red-50 hover:text-red-700 transition-colors">
                                  <Trash2 size={12} className="text-red-500" />
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
                                  <AlertDialogAction onClick={() => handleDeleteFile(file.id)} className="bg-red-500 hover:bg-red-600">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>)}
                      
                      {filteredFiles.length === 0 && <div className="p-4 text-center text-gray-500 text-sm">
                          {fileSearchQuery ? 'No files found matching your search' : `No ${fileFilter === 'all' ? '' : fileFilter + ' '}files in this session`}
                        </div>}
                    </div>
                  </ScrollArea>
                  
                  {filteredFiles.length > 10 && <Dialog>
                      <DialogTrigger asChild>
                        <div className="p-3 border-t border-gray-100">
                          <Button variant="ghost" size="sm" className="w-full justify-center text-[#4E50A8]">
                            View All Files
                          </Button>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
                        <DialogHeader>
                          <DialogTitle>All {fileFilter !== 'all' ? fileFilter + ' ' : ''}Session Files</DialogTitle>
                          <DialogDescription>
                            Browse all your uploaded {fileFilter !== 'all' ? fileFilter + ' ' : ''}files from this conversation
                          </DialogDescription>
                        </DialogHeader>
                        
                        {/* Search input in dialog */}
                        <div className="relative mb-4">
                          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input placeholder="Search files..." value={fileSearchQuery} onChange={e => setFileSearchQuery(e.target.value)} className="pl-9" />
                        </div>
                        
                        {/* File type filter tabs in dialog */}
                        <div className="flex gap-2 mb-4">
                          <Button variant={fileFilter === 'all' ? 'default' : 'outline'} size="sm" className={fileFilter === 'all' ? 'bg-[#4E50A8] text-white' : 'text-gray-600'} onClick={() => setFileFilter('all')}>
                            All
                          </Button>
                          <Button variant={fileFilter === 'endocs' ? 'default' : 'outline'} size="sm" className={fileFilter === 'endocs' ? 'bg-[#4E50A8] text-white' : 'text-gray-600'} onClick={() => setFileFilter('endocs')}>
                            Docs
                          </Button>
                          <Button variant={fileFilter === 'ensights' ? 'default' : 'outline'} size="sm" className={fileFilter === 'ensights' ? 'bg-[#4E50A8] text-white' : 'text-gray-600'} onClick={() => setFileFilter('ensights')}>
                            Excel
                          </Button>
                        </div>
                        
                        <ScrollArea className="flex-1 pr-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1">
                            {filteredFiles.map(file => <div key={file.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-md hover:bg-gray-50 group">
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
                                  {canViewFile(file) && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewingFile(file)}>
                                      <Eye size={14} />
                                    </Button>}
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
                                        <AlertDialogAction onClick={() => handleDeleteFile(file.id)} className="bg-red-500 hover:bg-red-600">
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>)}
                            
                            {filteredFiles.length === 0 && <div className="col-span-2 p-8 text-center text-gray-500">
                                {fileSearchQuery ? 'No files found matching your search' : `No ${fileFilter === 'all' ? '' : fileFilter + ' '}files in this session`}
                              </div>}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>}
                </PopoverContent>
              </Popover>}
            
            {/* User avatar */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-white shadow-sm hover:shadow transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-white text-gray-700">
                      <User size={18} />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 shadow-lg" align="end">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarFallback className="bg-white text-[#4E50A8]">
                        <User size={20} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">Andrew Neilson</p>
                      <p className="text-xs text-gray-500 truncate">andrew@example.com</p>
                    </div>
                  </div>
                  <Link to="/settings" className="block w-full">
                    <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700 transition-colors">
                      <Settings size={16} className="mr-2" />
                      Settings
                    </Button>
                  </Link>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* File Viewer Dialog */}
        {viewingFile && <Dialog open={!!viewingFile} onOpenChange={() => setViewingFile(null)}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>{viewingFile.name}</DialogTitle>
                <DialogDescription>
                  {getFileTypeDisplay(viewingFile.type)} • {formatFileSize(viewingFile.size)} • {viewingFile.date.toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md min-h-[400px]">
                {viewingFile.type === 'application/pdf' ? <div className="text-center text-gray-500">
                    <Files size={48} className="mx-auto mb-2" />
                    <p>PDF Preview</p>
                    <p className="text-sm">Click to download or view in browser</p>
                  </div> : <div className="text-center text-gray-500">
                    <Files size={48} className="mx-auto mb-2" />
                    <p>File preview not available</p>
                  </div>}
              </div>
            </DialogContent>
          </Dialog>}

        {/* Scrollable Chat Content - Increased width */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {hasMessages ? <div className="max-w-5xl mx-auto px-6 py-8 w-full min-h-full">
                <div className="space-y-4">
                  {currentConversation.messages.map(message => 
                    <ChatMessage 
                      key={message.id} 
                      message={message} 
                      onShowSources={(sources) => {
                        setCurrentSources(sources);
                        setIsSourcesSidebarOpen(true);
                      }}
                    />
                  )}
                  {isLoading && <div className="flex mb-8">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 mt-1 border border-gray-200">
                        <span className="text-gray-700 font-bold text-sm font-comfortaa">e</span>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-gray-600 font-medium">
                            <span className="bg-gradient-to-r from-[#595fb7] to-[#4e50a8] bg-clip-text text-transparent">
                              Thinking
                            </span>
                            <span className="inline-block ml-1 text-[#4e50a8]">
                              <span className="animate-pulse">.</span>
                              <span className="animate-pulse" style={{
                          animationDelay: '0.2s'
                        }}>.</span>
                              <span className="animate-pulse" style={{
                          animationDelay: '0.4s'
                        }}>.</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>}
                </div>
              </div> : <div className="h-full flex items-center justify-center">
                <div className="max-w-2xl w-full px-6 flex flex-col items-center justify-center">
                  <div className="text-center mb-10">
                    <h1 className="text-5xl font-bold text-gray-800 mb-2 font-comfortaa">Welcome to enplify2.o</h1>
                    <p className="text-gray-600 max-w-lg mx-auto mb-6">
                      Your intelligent AI assistant. Ask me anything and I'll provide 
                      helpful insights, answers, and information.
                    </p>
                  </div>
                  
                </div>
              </div>}
          </ScrollArea>
        </div>

        {/* Fixed Message Input at Bottom - Increased width */}
        <div className="flex-shrink-0 w-full bg-white py-4">
          <div className="max-w-5xl mx-auto px-6">
            <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} centered={!hasMessages} isLoading={isLoading} onStopGeneration={handleStopGeneration} />
          </div>
        </div>
      </div>

      {/* Sources Sidebar */}
      {isSourcesSidebarOpen && currentSources && (
        <div className="w-96 bg-white border-l border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-semibold text-lg text-gray-900">
              Sources
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSourcesSidebarOpen(false)}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <ScrollArea className="h-[calc(100vh-80px)]">
            <div className="p-4 space-y-4">
              {currentSources.items?.map((source: any, index: number) => (
                <div key={index} className="space-y-2">
                  {/* Source Header */}
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-4 h-4 rounded-sm flex items-center justify-center text-xs font-semibold text-white" style={{backgroundColor: source.color || '#64748b'}}>
                        {source.domain?.charAt(0).toUpperCase() || source.type?.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium">{source.domain || source.type}</p>
                    </div>
                  </div>

                  {/* Source Title and Content */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-1">
                      {source.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <span>{source.date}</span>
                      <span>—</span>
                      <span>by {source.author}</span>
                      {source.year && (
                        <>
                          <span>•</span>
                          <span>{source.year}</span>
                        </>
                      )}
                      {source.citedBy && (
                        <>
                          <span>•</span>
                          <span>Cited by {source.citedBy}</span>
                        </>
                      )}
                      <span>—</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {source.description}
                    </p>
                  </div>

                  {/* Data Source Location */}
                  {source.dataSource && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {source.dataSource}
                      </p>
                    </div>
                  )}
                  
                  {index < currentSources.items.length - 1 && (
                    <div className="border-b border-gray-100 mt-4"></div>
                  )}
                </div>
              ))}

              {/* More Sources Indicator */}
              {currentSources.totalSources && currentSources.totalSources > currentSources.items.length && (
                <div className="pt-4 border-t border-gray-100">
                  <Button variant="ghost" className="w-full text-sm text-gray-500">
                    More sources available ({currentSources.totalSources - currentSources.items.length} more)
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Minimal Onboarding Wizard */}
      <MinimalOnboardingWizard
        isOpen={showOnboarding}
        onClose={closeOnboarding}
        onComplete={completeOnboarding}
      />
    </div>;
};

export default Index;
