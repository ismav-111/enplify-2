
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: string;
  format?: 'text' | 'table' | 'graph';
  fileName?: string;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const { isUser, content, format, fileName } = message;

  // Function to render table content from markdown-like table text
  const renderTableContent = (content: string) => {
    const lines = content.trim().split('\n');
    const tableLines = lines.filter(line => line.includes('|'));
    
    if (tableLines.length < 3) return content; // Not enough lines for a table
    
    // Parse headers
    const headerLine = tableLines[0];
    const headers = headerLine.split('|').filter(cell => cell.trim()).map(cell => cell.trim());
    
    // Skip separator line
    
    // Parse rows
    const rows = tableLines.slice(2).map(line => {
      return line.split('|').filter(cell => cell.trim()).map(cell => cell.trim());
    });
    
    return (
      <div className="overflow-x-auto my-4 rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-[#4E50A8] uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#f8f8fd]'}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Function to render graph visualization
  const renderGraphContent = () => {
    // Sample data for demonstration
    const data = [
      { name: 'Category A', value: 400 },
      { name: 'Category B', value: 300 },
      { name: 'Category C', value: 500 },
      { name: 'Category D', value: 200 },
      { name: 'Category E', value: 350 },
    ];

    return (
      <div className="my-4 p-4 bg-white rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium mb-2 text-[#4E50A8]">Data Visualization</h4>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{fill: '#6b7280'}} />
              <YAxis tick={{fill: '#6b7280'}} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  borderColor: '#e5e7eb',
                  borderRadius: '0.375rem',
                }}
              />
              <Bar dataKey="value" fill="#4E50A8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  // Determine content display based on format
  const renderContent = () => {
    if (format === 'table') {
      return renderTableContent(content);
    } else if (format === 'graph') {
      return (
        <>
          <p className="text-gray-700 mb-2">{content}</p>
          {renderGraphContent()}
        </>
      );
    } else {
      return <p className="text-gray-700">{content}</p>;
    }
  };
  
  return (
    <div className={`flex gap-4 p-6 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#d5d5ec] flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-[#4E50A8]">AI</span>
        </div>
      )}
      
      <div className={`flex-1 max-w-[80%] ${isUser ? 'bg-[#4E50A8] text-white' : 'bg-white'} p-4 rounded-lg shadow-sm`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold">
            {isUser ? 'You' : 'CHAT A.I+'}
            {message.type && <span className="ml-2 text-xs opacity-70">via {message.type}</span>}
          </span>
          {/* Timestamp */}
          <span className={`text-xs ${isUser ? 'text-gray-100' : 'text-gray-400'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        {/* File attachment indicator */}
        {fileName && (
          <div className={`mb-2 text-xs rounded-full px-3 py-1 inline-block ${isUser ? 'bg-[#3c3e85]' : 'bg-[#d5d5ec] text-[#4E50A8]'}`}>
            📎 {fileName}
          </div>
        )}
        
        {/* Message content with formatting */}
        <div className={isUser ? 'text-white' : ''}>
          {renderContent()}
        </div>
      </div>
      
      {isUser && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className="bg-[#d5d5ec]">
            <User size={16} className="text-[#4E50A8]" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
