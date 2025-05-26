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
  mode: 'encore' | 'endocs' | 'ensights';
}

export type ResponseMode = 'encore' | 'endocs' | 'ensights';

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Q4 Sales Performance Analysis',
      preview: 'Our Q4 sales performance shows strong growth across all regions...',
      mode: 'encore',
      messages: [
        {
          id: '1',
          content: 'Can you analyze our Q4 sales performance and identify key trends?',
          isUser: true,
          timestamp: new Date(Date.now() - 30000)
        },
        {
          id: '2',
          content: `Based on your Q4 sales data, here's a comprehensive analysis:

**Key Performance Highlights:**
- Total revenue increased by 18% compared to Q3
- North American region led with 35% growth
- Enterprise clients contributed 65% of total revenue
- Customer acquisition cost decreased by 12%

**Regional Performance:**
- North America: $2.3M (+35%)
- Europe: $1.8M (+22%) 
- Asia-Pacific: $1.4M (+15%)

**Product Line Analysis:**
- Premium subscriptions grew 28%
- Professional services revenue up 31%
- Integration solutions showed 19% growth

**Recommendations:**
1. Increase investment in North American market expansion
2. Focus on enterprise client retention strategies
3. Expand professional services team to meet growing demand`,
          isUser: false,
          timestamp: new Date(Date.now() - 25000),
          mode: 'encore'
        }
      ]
    },
    {
      id: '2',
      title: 'Employee Handbook Updates',
      preview: 'I found the latest employee handbook and HR policy documents...',
      mode: 'endocs',
      messages: []
    },
    {
      id: '3',
      title: 'Customer Retention Metrics',
      preview: 'The customer retention analysis shows interesting patterns...',
      mode: 'ensights',
      messages: []
    },
    {
      id: '4',
      title: 'Compliance Documentation Review',
      preview: 'I can help you review the latest compliance documents...',
      mode: 'endocs',
      messages: []
    }
  ]);

  const [activeConversation, setActiveConversation] = useState<string>('1');
  const [isLoading, setIsLoading] = useState(false);
  
  // Track the current mode to detect changes
  const [currentMode, setCurrentMode] = useState<ResponseMode>('encore');

  const createNewChat = useCallback((mode: ResponseMode = 'encore') => {
    // Ensure mode is a string and has the proper type
    const safeMode: ResponseMode = typeof mode === 'string' ? 
      (mode as ResponseMode) : 'encore';
      
    // Create mode-specific title with proper capitalization
    let modeName = '';
    if (safeMode === 'encore') modeName = 'Encore';
    else if (safeMode === 'endocs') modeName = 'Endocs';
    else if (safeMode === 'ensights') modeName = 'Ensights';
    
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `New ${modeName} Conversation`,
      preview: 'Start a new conversation...',
      mode: safeMode,
      messages: []
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation.id);
    setCurrentMode(safeMode);
    return newConversation.id;
  }, []);

  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => {
      const filtered = prev.filter(conv => conv.id !== conversationId);
      
      // If we deleted the active conversation, switch to the first available one
      if (conversationId === activeConversation) {
        if (filtered.length > 0) {
          setActiveConversation(filtered[0].id);
        } else {
          // No conversations left, create a new one
          const newId = createNewChat();
          return conversations; // Return original conversations as createNewChat will handle the update
        }
      }
      
      return filtered;
    });
  }, [activeConversation, createNewChat, conversations]);

  const renameConversation = useCallback((conversationId: string, newTitle: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, title: newTitle }
        : conv
    ));
  }, []);

  const generateTableData = () => {
    // Generate realistic enterprise document data
    return [
      { 
        id: 1, 
        title: 'Employee Handbook 2024', 
        content: 'Updated policies for remote work, benefits, and code of conduct', 
        relevance: '95%',
        lastUpdated: '2024-01-15',
        department: 'HR'
      },
      { 
        id: 2, 
        title: 'ISO 27001 Compliance Guide', 
        content: 'Information security management system requirements and procedures', 
        relevance: '88%',
        lastUpdated: '2024-01-10',
        department: 'IT Security'
      },
      { 
        id: 3, 
        title: 'Financial Reporting Standards', 
        content: 'Updated GAAP compliance requirements for quarterly reporting', 
        relevance: '82%',
        lastUpdated: '2024-01-08',
        department: 'Finance'
      },
    ];
  };

  const generateChartData = () => {
    // Generate realistic business metrics data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];
    
    // Simulate monthly revenue growth with realistic business patterns
    const baseRevenue = 850000; // $850k base
    
    months.forEach((month, index) => {
      // Simulate seasonal patterns and growth
      let revenue = baseRevenue;
      
      // Add growth trend (2-3% monthly)
      revenue += (index * 25000);
      
      // Add seasonal variations
      if (month === 'Dec') revenue *= 1.25; // Holiday boost
      if (month === 'Jan') revenue *= 0.85; // Post-holiday dip
      if (month === 'Nov') revenue *= 1.15; // Black Friday effect
      if (month === 'Jul' || month === 'Aug') revenue *= 0.92; // Summer slowdown
      
      // Add some randomness
      revenue += (Math.random() - 0.5) * 50000;
      
      data.push({
        name: month,
        value: Math.round(revenue)
      });
    });
    
    return data;
  };

  const getEnterpriseResponse = (content: string, mode: ResponseMode) => {
    switch(mode) {
      case 'endocs':
        if (content.toLowerCase().includes('policy') || content.toLowerCase().includes('handbook')) {
          return `I found relevant policy documents in your knowledge base regarding "${content}". Here are the most relevant documents from your enterprise repository:

These documents contain the most up-to-date information about your inquiry. All documents are sourced from your authenticated enterprise systems and are current as of the last sync.`;
        }
        if (content.toLowerCase().includes('compliance') || content.toLowerCase().includes('regulation')) {
          return `Based on your compliance documentation search for "${content}", I've located the following regulatory and compliance documents:

These documents ensure your organization stays compliant with industry standards and regulatory requirements.`;
        }
        if (content.toLowerCase().includes('contract') || content.toLowerCase().includes('agreement')) {
          return `I found contract and agreement documents related to "${content}" in your legal document repository:

All contracts are digitally signed and stored securely in your document management system.`;
        }
        return `I've searched your enterprise document repository for "${content}" and found the following relevant documents:

These documents are automatically indexed and kept current with your latest organizational updates.`;
        
      case 'ensights':
        if (content.toLowerCase().includes('sales') || content.toLowerCase().includes('revenue')) {
          return `Here's your sales and revenue analysis for "${content}":

**Key Insights:**
- Revenue growth trending upward with 12% quarter-over-quarter increase
- Top performing months show strong correlation with marketing campaigns
- Seasonal patterns indicate Q4 typically sees 20-25% revenue boost

The data visualization below shows your 12-month revenue trend with detailed breakdowns by month.`;
        }
        if (content.toLowerCase().includes('customer') || content.toLowerCase().includes('retention')) {
          return `Customer analytics and retention insights for "${content}":

**Performance Metrics:**
- Customer retention rate: 87% (above industry average of 82%)
- Customer lifetime value increased by 15% year-over-year
- Churn rate decreased from 8% to 5% after implementing new onboarding

The chart below displays customer engagement patterns and retention trends.`;
        }
        if (content.toLowerCase().includes('employee') || content.toLowerCase().includes('hr')) {
          return `HR and employee performance analytics for "${content}":

**Workforce Insights:**
- Employee satisfaction score: 8.2/10 (up from 7.8 last quarter)
- Average time to hire reduced by 25% with new recruitment tools
- Training completion rates improved to 94%

The visualization shows key HR metrics and trends across departments.`;
        }
        return `Business intelligence analysis for "${content}":

**Data Summary:**
- Analysis based on real-time enterprise data
- Trends show positive growth patterns across key metrics
- Recommendations generated from predictive analytics

The interactive chart below provides detailed insights into your business performance.`;
        
      default: // encore
        if (content.toLowerCase().includes('strategy') || content.toLowerCase().includes('plan')) {
          return `Based on your strategic inquiry about "${content}", here's my analysis:

**Strategic Recommendations:**
- Leverage current market positioning to expand into adjacent markets
- Implement data-driven decision making across all departments
- Focus on customer experience optimization for competitive advantage

**Next Steps:**
1. Conduct market research on identified opportunities
2. Develop KPIs to measure strategic initiative success
3. Create cross-functional teams to execute key initiatives

Would you like me to dive deeper into any specific aspect of this strategy?`;
        }
        if (content.toLowerCase().includes('market') || content.toLowerCase().includes('competition')) {
          return `Market analysis and competitive intelligence for "${content}":

**Market Position:**
- Your company holds 12% market share in the primary segment
- Competitive advantage in technology and customer service
- Growth opportunities in emerging markets and product categories

**Competitive Landscape:**
- Main competitors show slower innovation cycles
- Price positioning is competitive but value proposition is stronger
- Customer loyalty metrics exceed industry benchmarks

**Recommendations:**
- Accelerate product development to maintain technology lead
- Invest in market expansion in high-growth regions
- Strengthen partnerships to enhance market reach`;
        }
        if (content.toLowerCase().includes('budget') || content.toLowerCase().includes('financial')) {
          return `Financial planning and budget analysis for "${content}":

**Budget Overview:**
- Current year budget performance: 97% of targets achieved
- Cost optimization opportunities identified in operations
- ROI on technology investments showing 23% returns

**Financial Health Indicators:**
- Cash flow remains strong with 6-month runway
- Debt-to-equity ratio improved by 15%
- Revenue diversification reduces market risks

**Planning Recommendations:**
- Allocate 15% of budget to innovation projects
- Consider strategic acquisitions in Q2
- Optimize operational costs through automation`;
        }
        return `I understand you're asking about: "${content}". Based on your enterprise context:

**Analysis:**
This relates to your organization's operational efficiency and strategic positioning. I can help you explore this topic by analyzing your internal data, industry benchmarks, and best practices.

**Recommendations:**
- Gather relevant stakeholders for comprehensive discussion
- Review current processes and identify improvement opportunities  
- Develop metrics to track progress and success

Would you like me to provide more specific guidance on any aspect of this topic?`;
    }
  };

  const sendMessage = useCallback(async (content: string, mode: ResponseMode = 'encore', file?: File) => {
    // Ensure mode is a valid enum value
    const safeMode: ResponseMode = 
      mode === 'encore' || mode === 'endocs' || mode === 'ensights' ? mode : 'encore';
    
    // Check if we need to create a new conversation due to mode change
    const currentConversation = conversations.find(conv => conv.id === activeConversation);
    let activeConvId = activeConversation;
    
    // Create a new conversation if the mode has changed or if there's no active conversation
    if (!currentConversation || currentConversation.mode !== safeMode) {
      activeConvId = createNewChat(safeMode);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
      mode: safeMode,
      file: file ? {
        name: file.name,
        type: file.type,
        size: file.size
      } : undefined
    };

    // Add user message
    setConversations(prev => prev.map(conv => 
      conv.id === activeConvId 
        ? { 
            ...conv, 
            messages: [...conv.messages, userMessage],
            title: conv.messages.length === 0 ? content.substring(0, 30) + '...' : conv.title,
            preview: content.substring(0, 50) + '...'
          }
        : conv
    ));

    setIsLoading(true);
    setCurrentMode(safeMode);

    // Simulate AI response based on mode with enterprise context
    setTimeout(() => {
      let aiMessage: Message;
      
      switch(safeMode) {
        case 'endocs':
          aiMessage = {
            id: (Date.now() + 1).toString(),
            content: getEnterpriseResponse(content, 'endocs'),
            isUser: false,
            timestamp: new Date(),
            mode: 'endocs',
            tableData: generateTableData()
          };
          break;
          
        case 'ensights':
          aiMessage = {
            id: (Date.now() + 1).toString(),
            content: getEnterpriseResponse(content, 'ensights'),
            isUser: false,
            timestamp: new Date(),
            mode: 'ensights',
            chartData: generateChartData()
          };
          break;
          
        default: // encore
          aiMessage = {
            id: (Date.now() + 1).toString(),
            content: getEnterpriseResponse(content, 'encore'),
            isUser: false,
            timestamp: new Date(),
            mode: 'encore'
          };
      }

      setConversations(prev => prev.map(conv => 
        conv.id === activeConvId 
          ? { ...conv, messages: [...conv.messages, aiMessage] }
          : conv
      ));
      setIsLoading(false);
    }, 1500);
  }, [activeConversation, conversations, createNewChat]);

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
    isLoading,
    deleteConversation,
    renameConversation
  };
};
