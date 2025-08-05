import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatMessage from '@/components/ChatMessage';
import MessageInput from '@/components/MessageInput';
import ResponsePreferences from '@/components/ResponsePreferences';
import NavigationHeader from '@/components/NavigationHeader';
import { useChat } from '@/hooks/useChat';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Sparkles, Database, FileText, BarChart3 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Index = () => {
  const [messageText, setMessageText] = useState('');
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
	const [conversations, setConversations] = useState<Array<{ id: string; title: string; preview: string }>>([]);
  const [messages, setMessages] = useState<Array<{ id: string; text: string; isUser: boolean }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responsePreferencesOpen, setResponsePreferencesOpen] = useState(false);

  const { getResponse } = useChat();

  // Load conversations from local storage on component mount
  useEffect(() => {
    const storedConversations = localStorage.getItem('conversations');
    if (storedConversations) {
      setConversations(JSON.parse(storedConversations));
    }
  }, []);

  // Save conversations to local storage whenever conversations change
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Load messages from local storage on component mount
  useEffect(() => {
    if (activeConversation) {
      const storedMessages = localStorage.getItem(`messages-${activeConversation}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        setMessages([]); // Initialize messages if no stored messages found
      }
    }
  }, [activeConversation]);

  // Save messages to local storage whenever messages change
  useEffect(() => {
    if (activeConversation) {
      localStorage.setItem(`messages-${activeConversation}`, JSON.stringify(messages));
    }
  }, [messages, activeConversation]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setMessageText('');
    setIsLoading(true);

    try {
      const response = await getResponse(messageText);

      if (response) {
        const aiMessage = {
          id: Date.now().toString() + '-ai',
          text: response,
          isUser: false,
        };

        setMessages((prevMessages) => [...prevMessages, aiMessage]);

        // Update conversation preview with the user's message
        setConversations(prevConversations => {
          return prevConversations.map(conv => {
            if (conv.id === activeConversation) {
              return { ...conv, preview: messageText };
            }
            return conv;
          });
        });
      } else {
        setError('Failed to get response.');
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    const newConversationId = Date.now().toString();
    setActiveConversation(newConversationId);
    setConversations(prevConversations => [
      ...prevConversations,
      { id: newConversationId, title: 'New Chat', preview: '' }
    ]);
    setMessages([]); // Clear messages for the new conversation
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
  };

  const handleClearAll = () => {
    // Clear all conversations and messages from local storage
    conversations.forEach(conversation => {
      localStorage.removeItem(`messages-${conversation.id}`);
    });
    localStorage.removeItem('conversations');

    // Clear state
    setConversations([]);
    setMessages([]);
    setActiveConversation(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations(prevConversations => {
      return prevConversations.map(conv => {
        if (conv.id === id) {
          return { ...conv, title: newTitle };
        }
        return conv;
      });
    });
  };

  const handleDeleteConversation = (id: string) => {
    // Remove messages from local storage
    localStorage.removeItem(`messages-${id}`);

    // Remove conversation from state
    setConversations(prevConversations => prevConversations.filter(conv => conv.id !== id));

    // If the deleted conversation was active, clear the active conversation
    if (activeConversation === id) {
      setActiveConversation(null);
      setMessages([]);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavigationHeader />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar 
            conversations={conversations}
            activeConversation={activeConversation}
            onNewChat={handleNewChat}
            onSelectConversation={handleSelectConversation}
            onClearAll={handleClearAll}
            onRenameConversation={handleRenameConversation}
            onDeleteConversation={handleDeleteConversation}
          />

          <main className="flex-1 p-4 overflow-y-auto">
            {activeConversation ? (
              <div className="h-full flex flex-col">
                <div className="flex-1">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} text={message.text} isUser={message.isUser} />
                  ))}
                  {isLoading && <ChatMessage text="Thinking..." isUser={false} />}
                </div>
                <MessageInput
                  messageText={messageText}
                  setMessageText={setMessageText}
                  handleSendMessage={handleSendMessage}
                  handleKeyDown={handleKeyDown}
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
