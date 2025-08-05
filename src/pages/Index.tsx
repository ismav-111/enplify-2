import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatMessage from '@/components/ChatMessage';
import MessageInput from '@/components/MessageInput';
import NavigationHeader from '@/components/NavigationHeader';
import { useChat } from '@/hooks/useChat';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
    isLoading,
    deleteConversation,
    renameConversation
  } = useChat();

  const currentConversation = getCurrentConversation();
  const messages = currentConversation?.messages || [];

  const handleSendMessage = async (content: string, mode: ResponseMode, files?: File[]) => {
    if (!content.trim()) return;
    
    // If no active conversation, create a new one
    if (!activeConversation) {
      createNewChat(mode);
    }
    
    await sendMessage(content, mode, files?.[0]);
  };

  const handleNewChat = () => {
    createNewChat();
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
  };

  const handleClearAll = () => {
    clearAllConversations();
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    renameConversation(id, newTitle);
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavigationHeader />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar 
            conversations={conversations.map(conv => ({
              id: conv.id,
              title: conv.title,
              preview: conv.preview
            }))}
            activeConversation={activeConversation}
            onNewChat={handleNewChat}
            onSelectConversation={handleSelectConversation}
            onClearAll={handleClearAll}
            onRenameConversation={handleRenameConversation}
            onDeleteConversation={handleDeleteConversation}
          />

          <main className="flex-1 p-4 overflow-y-auto">
            {activeConversation && currentConversation ? (
              <div className="h-full flex flex-col">
                <div className="flex-1">
                  {messages.map((message) => (
                    <ChatMessage 
                      key={message.id} 
                      message={message}
                    />
                  ))}
                  {isLoading && (
                    <ChatMessage 
                      message={{
                        id: 'loading',
                        content: 'Thinking...',
                        isUser: false,
                        timestamp: new Date()
                      }}
                    />
                  )}
                </div>
                <MessageInput
                  onSendMessage={handleSendMessage}
                  disabled={isLoading}
                  isLoading={isLoading}
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <Card className="w-full max-w-md">
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarFallback>
                        <MessageSquare className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Start a New Conversation</h2>
                    <p className="text-gray-600 text-center mb-6">
                      Click the &quot;New Chat&quot; button in the sidebar to begin a conversation.
                    </p>
                    <Button onClick={handleNewChat}>
                      <Plus className="mr-2" />
                      New Chat
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Index;
