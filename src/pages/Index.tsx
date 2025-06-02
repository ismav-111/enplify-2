import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, X, ChevronDown, Settings, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import Sidebar from '@/components/Sidebar';
import ChatMessage from '@/components/ChatMessage';
import MessageInput from '@/components/MessageInput';
import { useChat } from '@/hooks/useChat';
import LoadingIndicator from '@/components/LoadingIndicator';

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

  const [filePopoverOpen, setFilePopoverOpen] = useState(false);
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);
  const [fileViewerOpen, setFileViewerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; type: string } | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; type: string }[]>([
    { name: 'company_handbook.pdf', type: 'application/pdf' },
    { name: 'quarterly_report.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
  ]);

  const currentConversation = getCurrentConversation();

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        conversations={conversations}
        activeConversation={activeConversation}
        onConversationSelect={setActiveConversation}
        onNewChat={createNewChat}
        onDeleteConversation={deleteConversation}
        onRenameConversation={renameConversation}
        onClearAll={clearAllConversations}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            {currentConversation?.title || 'New Conversation'}
          </h1>

          {/* User menu and controls */}
          <div className="flex items-center gap-4">
            {/* File Upload Popover */}
            <Popover open={filePopoverOpen} onOpenChange={setFilePopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload size={16} />
                  Upload Files
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Upload Documents</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Add files to your knowledge base for better insights
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-blue-600 cursor-pointer hover:text-blue-500">
                        Click to upload
                      </span>
                      {' '}or drag and drop
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOCX, TXT files up to 10MB
                    </p>
                  </div>

                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-gray-500" />
                          <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* User Profile Popover */}
            <Popover open={userPopoverOpen} onOpenChange={setUserPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">JD</span>
                  </div>
                  John Doe
                  <ChevronDown size={14} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="space-y-1">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-gray-900">John Doe</p>
                    <p className="text-xs text-gray-500">john@company.com</p>
                  </div>
                  <Separator />
                  <Button variant="ghost" className="w-full justify-start text-sm h-8" asChild>
                    <Link to="/settings">
                      <Settings size={14} className="mr-2" />
                      Settings
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-8">
                    <HelpCircle size={14} className="mr-2" />
                    Help & Support
                  </Button>
                  <Separator />
                  <Button variant="ghost" className="w-full justify-start text-sm h-8 text-red-600 hover:text-red-700">
                    <LogOut size={14} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-8 py-8">
            {currentConversation?.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <LoadingIndicator mode={currentConversation?.mode || 'encore'} />
            )}
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 bg-white px-8 py-6">
          <MessageInput 
            onSendMessage={sendMessage}
            disabled={false}
            centered={true}
            isLoading={isLoading}
            onStopGeneration={() => setIsLoading(false)}
          />
        </div>
      </div>

      {/* File Viewer Dialog */}
      <Dialog open={fileViewerOpen} onOpenChange={setFileViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText size={20} />
              {selectedFile?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 border rounded-lg bg-gray-50 p-4 max-h-96 overflow-y-auto">
            <p className="text-sm text-gray-600">
              File content preview would be displayed here...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
