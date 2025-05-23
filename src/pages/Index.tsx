
import { useChat } from '@/hooks/useChat';
import Sidebar from '@/components/Sidebar';
import ChatMessage from '@/components/ChatMessage';
import MessageInput from '@/components/MessageInput';
import { useEffect } from 'react';
import { Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import type { ResponseMode } from '@/components/MessageInput';

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
        {/* User avatar in top-right corner */}
        <div className="absolute top-4 right-4 z-30">
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
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full justify-start text-gray-700 hover:bg-gray-100"
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </Button>
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
                      <div className="flex items-center gap-2 mb-2">
                        {/* Removed enplify.ai text */}
                      </div>
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
            <div className="max-w-xl w-full px-4">
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
