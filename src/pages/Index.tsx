
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversation={activeConversation}
        onNewChat={createNewChat}
        onSelectConversation={setActiveConversation}
        onClearAll={clearAllConversations}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* User avatar in top-right corner */}
        <div className="absolute top-4 right-4 z-30">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gray-200">
                    <User size={18} className="text-gray-700" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="end">
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gray-200">
                      <User size={18} className="text-gray-700" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Andrew Neilson</p>
                    <p className="text-xs text-gray-500">andrew@example.com</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full justify-start text-gray-700"
                >
                  <Settings size={15} className="mr-2" />
                  Settings
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Chat Messages */}
        <div className={`flex-1 overflow-y-auto ${!hasMessages ? 'flex items-center justify-center' : ''}`}>
          {hasMessages ? (
            <div className="max-w-3xl mx-auto px-4 py-6 w-full">
              <div className="group">
                {currentConversation.messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex gap-4 p-6 bg-gray-50/50 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">AI</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-900">CHAT A.I+</span>
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
              <MessageInput onSendMessage={sendMessage} disabled={isLoading} centered={true} />
            </div>
          )}
        </div>

        {/* Message Input - Only show at bottom when there are messages */}
        {hasMessages && (
          <div className="w-full">
            <MessageInput onSendMessage={sendMessage} disabled={isLoading} centered={false} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
