
import { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatMessage from '@/components/ChatMessage';
import MessageInput from '@/components/MessageInput';
import ResponsePreferences from '@/components/ResponsePreferences';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const {
    conversations,
    activeConversation,
    isLoading,
    createNewChat,
    setActiveConversation,
    sendMessage,
    clearAllConversations,
    renameConversation,
    deleteConversation,
    getCurrentConversation
  } = useChat();
  
  const [mode, setMode] = useState<'encore' | 'endocs' | 'ensights'>('encore');
  const [file, setFile] = useState<File | null>(null);
  const [preferences, setPreferences] = useState({ format: 'text' as const, dataSource: 'sql' as const });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const currentConversation = getCurrentConversation();
  const currentMessages = currentConversation?.messages || [];

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = async (message: string, messageMode: 'encore' | 'endocs' | 'ensights', files?: File[]) => {
    await sendMessage(message, messageMode, files?.[0], preferences);
    setFile(null);
  };

  const handleUserProfileClick = (action: string) => {
    if (action === 'settings') {
      navigate('/settings');
    } else if (action === 'logout') {
      navigate('/signin');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        conversations={conversations}
        activeConversation={activeConversation}
        onNewChat={createNewChat}
        onSelectConversation={setActiveConversation}
        onClearAll={clearAllConversations}
        onRenameConversation={renameConversation}
        onDeleteConversation={deleteConversation}
      />

      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6">
          <div className="text-3xl font-bold text-[#4E50A8] font-comfortaa">
            enplify.ai
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback className="bg-[#4E50A8] text-white">U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={() => handleUserProfileClick('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUserProfileClick('logout')}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {currentMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="max-w-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Welcome to enplify.ai
                </h2>
                <p className="text-gray-600 mb-6">
                  Start a conversation by typing a message below. I'm here to help with your questions and tasks.
                </p>
              </div>
            </div>
          ) : (
            currentMessages.map((message, index) => (
              <ChatMessage
                key={message.id || index}
                message={message}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="border-t border-gray-100 bg-white">
          <div className="p-4">
            <ResponsePreferences
              preferences={preferences}
              onPreferencesChange={setPreferences}
              mode={mode}
            />
          </div>
          <div className="px-6 pb-6">
            <MessageInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
