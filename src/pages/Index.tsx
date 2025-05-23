
import { useChat } from '@/hooks/useChat';
import Sidebar from '@/components/Sidebar';
import ChatMessage from '@/components/ChatMessage';
import MessageInput from '@/components/MessageInput';
import { useEffect } from 'react';

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
      <div className="flex-1 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="group">
              {currentConversation && currentConversation.messages.map((message) => (
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
        </div>

        {/* Message Input - Always show it */}
        <MessageInput onSendMessage={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default Index;
