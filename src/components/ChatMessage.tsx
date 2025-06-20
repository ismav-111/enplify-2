import React, { useState } from 'react';
import { Copy, Check, ThumbsUp, ThumbsDown, FileText, Database, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
}

const ChatMessage = ({ message, isLast }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    // Here you would typically send feedback to your backend
    console.log(`Feedback: ${type} for message ${message.id}`);
  };

  const formatContent = (content: string) => {
    // Split content by double newlines to create paragraphs
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Check if paragraph is a header (starts with **)
      if (paragraph.startsWith('**') && paragraph.includes(':**')) {
        const headerText = paragraph.replace(/\*\*/g, '');
        return (
          <h3 key={index} className="font-semibold text-gray-900 mt-4 mb-2 first:mt-0">
            {headerText}
          </h3>
        );
      }
      
      // Check if paragraph contains bullet points
      if (paragraph.includes('- ')) {
        const lines = paragraph.split('\n');
        const listItems = [];
        let currentText = '';
        
        lines.forEach((line, lineIndex) => {
          if (line.trim().startsWith('- ')) {
            if (currentText) {
              listItems.push(
                <p key={`text-${lineIndex}`} className="mb-2">
                  {currentText.trim()}
                </p>
              );
              currentText = '';
            }
            listItems.push(
              <li key={lineIndex} className="mb-1">
                {line.replace('- ', '').trim()}
              </li>
            );
          } else if (line.trim().match(/^\d+\./)) {
            if (currentText) {
              listItems.push(
                <p key={`text-${lineIndex}`} className="mb-2">
                  {currentText.trim()}
                </p>
              );
              currentText = '';
            }
            listItems.push(
              <li key={lineIndex} className="mb-1">
                {line.trim()}
              </li>
            );
          } else {
            currentText += line + '\n';
          }
        });
        
        if (currentText) {
          listItems.push(
            <p key="final-text" className="mb-2">
              {currentText.trim()}
            </p>
          );
        }
        
        const hasNumberedList = lines.some(line => line.trim().match(/^\d+\./));
        const hasBulletList = lines.some(line => line.trim().startsWith('- '));
        
        return (
          <div key={index} className="mb-4">
            {hasBulletList && (
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {listItems.filter((_, i) => lines[i] && lines[i].trim().startsWith('- '))}
              </ul>
            )}
            {hasNumberedList && (
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                {listItems.filter((_, i) => lines[i] && lines[i].trim().match(/^\d+\./))}
              </ol>
            )}
            {listItems.filter((_, i) => lines[i] && !lines[i].trim().startsWith('- ') && !lines[i].trim().match(/^\d+\./))}
          </div>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  const renderTable = () => {
    if (!message.tableData || message.tableData.length === 0) return null;

    const headers = Object.keys(message.tableData[0]);

    return (
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                >
                  {header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {message.tableData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {headers.map((header) => (
                  <td key={header} className="px-4 py-3 text-sm text-gray-900 border-b">
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderChart = () => {
    if (!message.chartData || message.chartData.length === 0) return null;

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Revenue Trends</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={message.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                labelStyle={{ color: '#374151' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderSourceCards = () => {
    // Filter sources based on message mode
    let filteredSources = [];
    
    if (message.mode === 'endocs') {
      // Only show PDF and document files
      filteredSources = [
        { name: 'Employee Handbook 2024.pdf', type: 'pdf', size: '2.4 MB' },
        { name: 'ISO 27001 Compliance Guide.docx', type: 'docx', size: '1.8 MB' },
        { name: 'Financial Reporting Standards.pdf', type: 'pdf', size: '3.2 MB' },
        { name: 'HR Policies Documentation.doc', type: 'doc', size: '1.5 MB' }
      ];
    } else if (message.mode === 'ensights') {
      // Only show Excel and spreadsheet files
      filteredSources = [
        { name: 'Q4 Sales Data.xlsx', type: 'xlsx', size: '4.2 MB' },
        { name: 'Customer Analytics.csv', type: 'csv', size: '2.1 MB' },
        { name: 'Revenue Metrics.xlsx', type: 'xlsx', size: '3.8 MB' },
        { name: 'Performance KPIs.xls', type: 'xls', size: '1.9 MB' }
      ];
    } else {
      // encore mode - can show any type of file
      filteredSources = [
        { name: 'Strategic Plan 2024.pdf', type: 'pdf', size: '2.4 MB' },
        { name: 'Market Research.xlsx', type: 'xlsx', size: '3.1 MB' },
        { name: 'Budget Analysis.docx', type: 'docx', size: '1.7 MB' },
        { name: 'Competitor Data.csv', type: 'csv', size: '2.3 MB' }
      ];
    }

    const getFileIcon = (type: string) => {
      switch (type.toLowerCase()) {
        case 'pdf':
          return <FileText className="w-4 h-4 text-red-500" />;
        case 'xlsx':
        case 'xls':
        case 'csv':
          return <BarChart3 className="w-4 h-4 text-green-500" />;
        case 'docx':
        case 'doc':
          return <FileText className="w-4 h-4 text-blue-500" />;
        default:
          return <FileText className="w-4 h-4 text-gray-500" />;
      }
    };

    return (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Sources</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {filteredSources.map((source, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border text-sm cursor-pointer transition-colors"
            >
              {getFileIcon(source.type)}
              <span className="font-medium">{source.name}</span>
              <span className="text-gray-500">({source.size})</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getModeColor = (mode?: string) => {
    switch (mode) {
      case 'encore':
        return 'bg-blue-100 text-blue-800';
      case 'endocs':
        return 'bg-green-100 text-green-800';
      case 'ensights':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getModeLabel = (mode?: string) => {
    switch (mode) {
      case 'encore':
        return 'Encore';
      case 'endocs':
        return 'Endocs';
      case 'ensights':
        return 'Ensights';
      default:
        return 'Assistant';
    }
  };

  return (
    <div className={`flex gap-4 ${message.isUser ? 'justify-end' : 'justify-start'} ${isLast ? 'mb-6' : 'mb-8'}`}>
      {!message.isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">AI</span>
          </div>
        </div>
      )}
      
      <div className={`max-w-3xl ${message.isUser ? 'order-1' : ''}`}>
        {!message.isUser && message.mode && (
          <div className="mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getModeColor(message.mode)}`}>
              {getModeLabel(message.mode)}
            </span>
          </div>
        )}
        
        <div className={`rounded-2xl px-4 py-3 ${
          message.isUser 
            ? 'bg-blue-600 text-white ml-auto' 
            : 'bg-white border border-gray-200 shadow-sm'
        }`}>
          {message.file && (
            <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">{message.file.name}</span>
              <span className="text-xs text-gray-500">
                ({(message.file.size / 1024 / 1024).toFixed(1)} MB)
              </span>
            </div>
          )}
          
          <div className={`${message.isUser ? 'text-white' : 'text-gray-900'}`}>
            {message.isUser ? (
              <p className="leading-relaxed">{message.content}</p>
            ) : (
              <div className="prose prose-sm max-w-none">
                {formatContent(message.content)}
              </div>
            )}
          </div>
          
          {!message.isUser && (
            <>
              {renderTable()}
              {renderChart()}
              {renderSourceCards()}
            </>
          )}
        </div>
        
        {!message.isUser && (
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <span>{message.timestamp.toLocaleTimeString()}</span>
            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={handleCopy}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Copy message"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => handleFeedback('up')}
                className={`p-1 hover:bg-gray-100 rounded transition-colors ${
                  feedback === 'up' ? 'text-green-500' : ''
                }`}
                title="Good response"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFeedback('down')}
                className={`p-1 hover:bg-gray-100 rounded transition-colors ${
                  feedback === 'down' ? 'text-red-500' : ''
                }`}
                title="Poor response"
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {message.isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-sm font-medium">U</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
