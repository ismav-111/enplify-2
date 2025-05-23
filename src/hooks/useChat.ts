
import { useState, useCallback } from 'react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: string;
  format?: 'text' | 'table' | 'graph';
  fileName?: string;
}

interface Conversation {
  id: string;
  title: string;
  preview: string;
  messages: Message[];
}

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Create Chatbot GPT...',
      preview: 'Sure, I can help you get started with creating a chatbot using GPT in Python...',
      messages: [
        {
          id: '1',
          content: 'Create a chatbot gpt using python language what will be step for that',
          isUser: true,
          timestamp: new Date(Date.now() - 30000)
        },
        {
          id: '2',
          content: `Sure, I can help you get started with creating a chatbot using GPT in Python. Here are the basic steps you'll need to follow:

1. **Install the required libraries:** You'll need to install the transformers library from Hugging Face to use GPT. You can install it using pip.

2. **Load the pre-trained model:** GPT comes in several sizes and versions, so you'll need to choose the one that fits your needs. You can load a pre-trained GPT model. This loads the 1.3B parameter version of GPT-Neo, which is a powerful and relatively recent model.

3. **Create a chatbot loop:** You'll need to create a loop that takes user input, generates a response using the GPT model, and outputs it to the user. Here's an example loop that uses the input() function to get user input and the gpt() function to generate a response. This loop will keep running until the user exits the program or the loop is interrupted.

4. **Add some personality to the chatbot:** While GPT can generate text, it doesn't have any inherent personality or traits. You can make your chatbot more interesting by adding custom prompts or responses that reflect your desired personality. You can then modify the chatbot loop to use these prompts and responses when appropriate. This will make the chatbot seem more human-like and engaging.

These are just the basic steps to get started with a GPT chatbot in Python. Depending on your requirements, you may need to add more features or complexity to the chatbot. Good luck!`,
          isUser: false,
          timestamp: new Date(Date.now() - 25000)
        },
        {
          id: '3',
          content: 'What is use of that chatbot ?',
          isUser: true,
          timestamp: new Date(Date.now() - 10000)
        },
        {
          id: '4',
          content: `Chatbots can be used for a wide range of purposes, including:

**Customer service chatbots** can handle frequently asked questions, provide basic support, and help customers navigate products or services. This can reduce the workload on human customer service representatives and provide 24/7 support.`,
          isUser: false,
          timestamp: new Date(Date.now() - 5000),
          format: 'text'
        }
      ]
    },
    {
      id: '2',
      title: 'Html Game Environment...',
      preview: 'I can help you create an HTML game environment...',
      messages: []
    },
    {
      id: '3',
      title: 'Apply To Leave For Emergency',
      preview: 'I can help you draft a leave application...',
      messages: []
    },
    {
      id: '4',
      title: 'What Is UI UX Design?',
      preview: 'UI/UX design refers to User Interface and User Experience design...',
      messages: []
    }
  ]);

  const [activeConversation, setActiveConversation] = useState<string>('1');
  const [isLoading, setIsLoading] = useState(false);

  const createNewChat = useCallback(() => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      preview: 'Start a new conversation...',
      messages: []
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation.id);
  }, []);

  const sendMessage = useCallback(async (content: string, type: string = 'encore', file?: File) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
      type,
      fileName: file?.name
    };

    // Add user message
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversation 
        ? { 
            ...conv, 
            messages: [...conv.messages, userMessage],
            title: conv.messages.length === 0 ? content.substring(0, 30) + '...' : conv.title,
            preview: content.substring(0, 50) + '...'
          }
        : conv
    ));

    setIsLoading(true);

    // Simulate AI response based on type
    setTimeout(() => {
      let aiResponseContent = '';
      let format: 'text' | 'table' | 'graph' = 'text';
      
      if (type === 'endocs') {
        // For endocs, return a tabular response
        aiResponseContent = `Here's a summary of your query about "${content}":
        
| Category | Description | Relevance |
|----------|-------------|-----------|
| Main Topic | ${content.split(' ').slice(0, 3).join(' ')} | High |
| Related Area | Documentation analysis | Medium |
| Key Points | Structure, clarity, completeness | High |
| Next Steps | Review documentation guidelines | Medium |
`;
        format = 'table';
      } else if (type === 'ensights') {
        // For ensights, indicate this would show graph data
        aiResponseContent = `I've analyzed your query about "${content}" and prepared graphical insights. The data visualization would show trends and patterns related to your question. In a real implementation, this would display actual charts and graphs based on data analysis.`;
        format = 'graph';
      } else {
        // Default response for encore
        aiResponseContent = `I understand you're asking about: "${content}". This is a response from the Encore AI assistant. In a real implementation, this would connect to an actual AI service to generate meaningful responses.`;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        isUser: false,
        timestamp: new Date(),
        type,
        format
      };

      setConversations(prev => prev.map(conv => 
        conv.id === activeConversation 
          ? { ...conv, messages: [...conv.messages, aiMessage] }
          : conv
      ));
      setIsLoading(false);
    }, 1500);
  }, [activeConversation]);

  const clearAllConversations = useCallback(() => {
    setConversations([]);
    setActiveConversation('');
  }, []);

  const getCurrentConversation = () => {
    return conversations.find(conv => conv.id === activeConversation);
  };

  return {
    conversations,
    activeConversation,
    setActiveConversation,
    createNewChat,
    sendMessage,
    clearAllConversations,
    getCurrentConversation,
    isLoading
  };
};
