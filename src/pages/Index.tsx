import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import MessageInput, { ResponseMode } from '@/components/MessageInput';
import ChatMessage from '@/components/ChatMessage';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  mode?: ResponseMode;
  tableData?: any[];
  chartData?: any[];
  file?: {
    name: string;
    type: string;
    size: number;
  };
}

interface Conversation {
  id: string;
  title: string;
  preview: string;
  messages: Message[];
}

const Index = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load conversations from local storage on mount
  useEffect(() => {
    if (isMounted) {
      const storedConversations = localStorage.getItem('conversations');
      if (storedConversations) {
        setConversations(JSON.parse(storedConversations));
      }
    }
  }, [isMounted]);

  // Save conversations to local storage whenever they change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('conversations', JSON.stringify(conversations));
    }
  }, [conversations, isMounted]);

  const handleNewChat = () => {
    const newConversationId = Math.random().toString(36).substring(7);
    const newConversation: Conversation = {
      id: newConversationId,
      title: 'New conversation',
      preview: '',
      messages: [],
    };
    setConversations([...conversations, newConversation]);
    setActiveConversation(newConversationId);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
  };

  const handleClearAll = () => {
    setConversations([]);
    setActiveConversation(null);
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations(
      conversations.map((conversation) =>
        conversation.id === id ? { ...conversation, title: newTitle } : conversation
      )
    );
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(conversations.filter((conversation) => conversation.id !== id));
    setActiveConversation(null);
  };

  const handleSendMessage = async (message: string, mode: ResponseMode, file?: File) => {
    if (!activeConversation) return;

    const newMessage = {
      id: Math.random().toString(36).substring(7),
      content: message,
      isUser: true,
      timestamp: new Date(),
      mode: mode,
    };

    // Optimistically update the UI
    setConversations((prevConversations) => {
      return prevConversations.map((conversation) => {
        if (conversation.id === activeConversation) {
          return {
            ...conversation,
            messages: [...conversation.messages, newMessage],
            preview: message,
          };
        }
        return conversation;
      });
    });

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', message);
      formData.append('mode', mode);
      if (file) {
        formData.append('file', file);
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const aiResponse = {
        id: Math.random().toString(36).substring(7),
        content: data.response,
        isUser: false,
        timestamp: new Date(),
        mode: mode,
        tableData: data.tableData,
        chartData: data.chartData,
        file: data.file,
      };

      setConversations((prevConversations) => {
        return prevConversations.map((conversation) => {
          if (conversation.id === activeConversation) {
            return {
              ...conversation,
              messages: [...conversation.messages, newMessage, aiResponse],
              preview: aiResponse.content,
            };
          }
          return conversation;
        });
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Something went wrong.",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
      // Revert the UI update on error
      setConversations((prevConversations) => {
        return prevConversations.map((conversation) => {
          if (conversation.id === activeConversation) {
            return {
              ...conversation,
              messages: conversation.messages.filter((msg) => msg.id !== newMessage.id),
              preview: conversation.messages.length > 0 ? conversation.messages[conversation.messages.length - 1].content : '',
            };
          }
          return conversation;
        });
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopGeneration = () => {
    // Implement stop generation logic here
    setIsLoading(false);
  };

  const renderChatContent = () => {
    const conversation = conversations.find((conv) => conv.id === activeConversation);
    if (!conversation) {
      return <div className="p-4">Select a conversation to view messages.</div>;
    }

    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 p-4 overflow-y-auto">
          {conversation.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </div>
    );
  };

  const renderWelcomeMessage = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 font-comfortaa">
          Welcome to enplify 2.0
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Transform your enterprise data into actionable intelligence. Seamlessly analyze documents, 
          extract insights, and make data-driven decisions with our advanced AI platform designed for business excellence.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <Sidebar
        conversations={conversations}
        activeConversation={activeConversation}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onClearAll={handleClearAll}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
      />
      
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto">
          {activeConversation ? renderChatContent() : renderWelcomeMessage()}
        </div>
        
        <div className="flex-shrink-0 p-6 bg-white">
          <MessageInput
            onSendMessage={handleSendMessage}
            centered={!activeConversation}
            isLoading={isLoading}
            onStopGeneration={handleStopGeneration}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
