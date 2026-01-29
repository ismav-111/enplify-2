import { useState, useCallback } from 'react';
import type { ResponsePreferences } from '@/components/ResponsePreferences';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  mode?: 'encore' | 'endocs' | 'ensights';
  tableData?: any[];
  chartData?: any[];
  sqlQuery?: string;
  snowflakeQuery?: string;
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
      
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'Untitled Conversation',
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
          return `To analyze your sales and revenue performance for "${content}", I'll create a comprehensive chart based on your enterprise data from multiple sources including CRM, financial systems, and sales platforms. The chart will display key trends and patterns to help identify growth opportunities and potential concerns.

**Data Analysis Overview:**
This analysis examines 12 months of revenue data, highlighting seasonal patterns, growth trends, and performance indicators across all business segments. The visualization uses a linear growth model with seasonal adjustments to show both historical performance and projected trends.

**Key Performance Indicators:**
- Revenue growth trending upward with 12% quarter-over-quarter increase
- Top performing months show strong correlation with marketing campaigns  
- Seasonal patterns indicate Q4 typically sees 20-25% revenue boost
- Customer acquisition costs have decreased by 8% while revenue per customer increased by 15%

The interactive chart below shows detailed monthly revenue trends with breakdowns by customer segments and regional performance. Data is sourced from your integrated business intelligence systems and updated in real-time.`;
        }
        
        if (content.toLowerCase().includes('customer') || content.toLowerCase().includes('retention')) {
          return `To examine customer analytics and retention patterns for "${content}", I'll generate a comprehensive visualization based on your customer data warehouse, CRM analytics, and engagement tracking systems. This analysis will reveal critical insights about customer behavior and loyalty trends.

**Customer Analytics Methodology:**
The analysis combines customer lifecycle data, engagement metrics, and behavioral patterns to create a comprehensive view of retention performance. Using cohort analysis and predictive modeling, we can identify key factors influencing customer satisfaction and long-term value.

**Performance Metrics & Insights:**
- Customer retention rate: 87% (above industry average of 82%)
- Customer lifetime value increased by 15% year-over-year
- Churn rate decreased from 8% to 5% after implementing new onboarding process
- Net Promoter Score improved from 7.2 to 8.6 in the last quarter
- Average customer engagement frequency increased by 23%

The chart below displays customer engagement patterns, retention curves, and predictive indicators for future performance. This data enables strategic decisions about customer success investments and retention program effectiveness.`;
        }
        
        if (content.toLowerCase().includes('employee') || content.toLowerCase().includes('hr')) {
          return `To analyze HR and employee performance metrics for "${content}", I'll create a detailed visualization using data from your HRIS, performance management systems, and employee engagement platforms. This comprehensive analysis will provide insights into workforce trends and organizational health.

**Workforce Analytics Framework:**
This analysis integrates employee satisfaction surveys, performance reviews, recruitment data, and retention metrics to provide a holistic view of organizational effectiveness. The data includes longitudinal trends and comparative benchmarks against industry standards.

**Key Workforce Insights:**
- Employee satisfaction score: 8.2/10 (up from 7.8 last quarter)
- Average time to hire reduced by 25% with new recruitment automation tools
- Training completion rates improved to 94% with enhanced learning platforms
- Internal promotion rate increased to 68% indicating strong career development
- Employee turnover decreased by 12% year-over-year

The visualization below presents department-specific metrics, trend analysis, and predictive indicators for workforce planning. This data supports strategic HR decisions and helps optimize talent management strategies across the organization.`;
        }
        
        if (content.toLowerCase().includes('performance') || content.toLowerCase().includes('kpi')) {
          return `To provide comprehensive performance analysis for "${content}", I'll generate detailed visualizations using your integrated business intelligence systems, operational databases, and key performance indicator tracking platforms. This analysis will reveal critical performance trends and actionable insights.

**Performance Analytics Methodology:**
The analysis combines operational metrics, financial indicators, and strategic KPIs to create a multi-dimensional view of organizational performance. Using advanced analytics and trend analysis, we identify patterns that drive business success and areas requiring attention.

**Strategic Performance Indicators:**
- Overall business performance index: 92/100 (target: 85)
- Operational efficiency improved by 18% through process optimization
- Customer satisfaction scores averaging 4.6/5.0 across all touchpoints
- Revenue per employee increased by 22% year-over-year
- Digital transformation initiatives showing 31% ROI within first year

The interactive dashboard below displays real-time performance metrics with drill-down capabilities for detailed analysis. Data is automatically synchronized across all business systems to ensure accuracy and timeliness for strategic decision-making.`;
        }
        
        return `To conduct comprehensive business intelligence analysis for "${content}", I'll create detailed visualizations using your enterprise data warehouse and analytics platforms. This analysis will provide strategic insights based on real-time business data and industry benchmarks.

**Business Intelligence Overview:**
This analysis leverages machine learning algorithms and statistical modeling to identify trends, patterns, and predictive indicators across your business operations. The methodology combines historical data analysis with forward-looking projections to support strategic planning.

**Key Business Insights:**
- Analysis based on real-time enterprise data from integrated business systems
- Trend analysis shows positive growth patterns across key operational metrics
- Predictive analytics indicate continued growth trajectory with seasonal adjustments
- Comparative analysis against industry benchmarks shows above-average performance
- Risk assessment models indicate stable operating environment with managed exposure

The interactive visualization below provides detailed insights into your business performance with customizable views for different stakeholder needs. Data sources include financial systems, operational databases, and external market intelligence feeds for comprehensive analysis.`;
        
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

  const sendMessage = useCallback(async (content: string, mode: ResponseMode = 'encore', file?: File, preferences?: ResponsePreferences) => {
    // Ensure mode is a valid enum value
    const safeMode: ResponseMode = 
      mode === 'encore' || mode === 'endocs' || mode === 'ensights' ? mode : 'encore';
    
    // Check if we need to create a new conversation due to mode change
    const currentConversation = conversations.find(conv => conv.id === activeConversation);
    let activeConvId = activeConversation;
    
    // Only create a new conversation if there's no active conversation, not for mode changes
    if (!currentConversation) {
      activeConvId = createNewChat(safeMode);
    } else {
      // Update the current conversation's mode without creating a new one
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversation 
          ? { ...conv, mode: safeMode }
          : conv
      ));
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

    // Simulate AI response based on mode with enterprise context and preferences
    setTimeout(() => {
      let aiMessage: Message;
      
      // Generate response content based on preferences
      let responseContent = getEnterpriseResponse(content, safeMode);
      
      if (preferences) {
        // Add preference-aware response modifications
        if (preferences.format === 'table' && safeMode === 'endocs') {
          responseContent += `\n\n*Response formatted as table view based on your preferences, sourced from ${preferences.dataSource}.*`;
        } else if (preferences.format === 'graph' && safeMode === 'ensights') {
          responseContent += `\n\n*Response includes interactive charts based on your preferences, using ${preferences.dataSource} data.*`;
        } else if (preferences.format === 'text') {
          responseContent += `\n\n*Response provided in detailed text format as requested, analyzed from ${preferences.dataSource}.*`;
        }
      }
      
      switch(safeMode) {
        case 'endocs':
          aiMessage = {
            id: (Date.now() + 1).toString(),
            content: responseContent,
            isUser: false,
            timestamp: new Date(),
            mode: 'endocs',
            tableData: preferences?.format === 'table' ? generateTableData() : undefined,
            sqlQuery: `SELECT 
  d.document_id,
  d.title,
  d.content,
  d.department,
  d.last_updated,
  ROUND(ts_rank(d.search_vector, plainto_tsquery('${content.replace(/'/g, "''")}')) * 100, 2) || '%' AS relevance
FROM enterprise_documents d
WHERE d.search_vector @@ plainto_tsquery('${content.replace(/'/g, "''")}')
ORDER BY ts_rank(d.search_vector, plainto_tsquery('${content.replace(/'/g, "''")}')) DESC
LIMIT 25;`,
            snowflakeQuery: `SELECT 
  d.document_id,
  d.title,
  d.content,
  d.department,
  d.last_updated,
  ROUND(VECTOR_COSINE_SIMILARITY(d.search_vector, PARSE_VECTOR('${content.replace(/'/g, "''")}')) * 100, 2) || '%' AS relevance
FROM ENTERPRISE_DB.DOCUMENTS_SCHEMA.enterprise_documents d
WHERE CONTAINS(d.content, '${content.replace(/'/g, "''")}')
ORDER BY VECTOR_COSINE_SIMILARITY(d.search_vector, PARSE_VECTOR('${content.replace(/'/g, "''")}')) DESC
LIMIT 25;`
          };
          break;
          
        case 'ensights':
          aiMessage = {
            id: (Date.now() + 1).toString(),
            content: responseContent,
            isUser: false,
            timestamp: new Date(),
            mode: 'ensights',
            chartData: preferences?.format === 'graph' ? generateChartData() : undefined
          };
          break;
          
        default: // encore
          aiMessage = {
            id: (Date.now() + 1).toString(),
            content: responseContent,
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
