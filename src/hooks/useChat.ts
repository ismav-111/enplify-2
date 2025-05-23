
import { useState, useCallback } from 'react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  mode?: 'encore' | 'endocs' | 'ensights';
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

export type ResponseMode = 'encore' | 'endocs' | 'ensights';

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
          timestamp: new Date(Date.now() - 5000)
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

  const generateTableData = () => {
    // Generate sample table data
    return [
      { id: 1, title: 'Document A', content: 'Information about document A', relevance: '95%' },
      { id: 2, title: 'Document B', content: 'Information about document B', relevance: '85%' },
      { id: 3, title: 'Document C', content: 'Information about document C', relevance: '75%' },
    ];
  };

  const generateChartData = () => {
    // Generate sample chart data
    return [
      { name: 'Jan', value: 400 },
      { name: 'Feb', value: 300 },
      { name: 'Mar', value: 600 },
      { name: 'Apr', value: 800 },
      { name: 'May', value: 500 },
    ];
  };

  const sendMessage = useCallback(async (content: string, mode: ResponseMode = 'encore', file?: File) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
      mode,
      file: file ? {
        name: file.name,
        type: file.type,
        size: file.size
      } : undefined
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

    // Simulate AI response based on mode
    setTimeout(() => {
      let aiMessage: Message;
      
      switch(mode) {
        case 'endocs':
          aiMessage = {
            id: (Date.now() + 1).toString(),
            content: `Here's the information you requested from Endocs about "${content}":`,
            isUser: false,
            timestamp: new Date(),
            mode: 'endocs',
            tableData: generateTableData()
          };
          break;
          
        case 'ensights':
          aiMessage = {
            id: (Date.now() + 1).toString(),
            content: `Here are the insights you requested about "${content}":`,
            isUser: false,
            timestamp: new Date(),
            mode: 'ensights',
            chartData: generateChartData()
          };
          break;
          
        default: // encore
          aiMessage = {
            id: (Date.now() + 1).toString(),
            content: `I understand you're asking about: "${content}". This is a response from Encore. In a real implementation, this would connect to an actual AI service to generate meaningful responses.`,
            isUser: false,
            timestamp: new Date(),
            mode: 'encore'
          };
      }

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
