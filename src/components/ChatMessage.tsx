
import { useState } from 'react';
import { Bot, ThumbsUp, ThumbsDown, Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ChatMessageProps {
  message: {
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
  };
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const toggleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  const renderTableData = () => {
    if (!message.tableData || message.tableData.length === 0) return null;
    
    return (
      <div className="mt-4 bg-[#f8f8fc] p-4 rounded-lg border border-[#d5d5ec]">
        <Table>
          <TableHeader>
            <TableRow>
              {Object.keys(message.tableData[0]).map((key) => (
                <TableHead key={key} className="text-[#4E50A8]">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {message.tableData.map((row, i) => (
              <TableRow key={i}>
                {Object.values(row).map((value: any, j) => (
                  <TableCell key={j}>{value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderChartData = () => {
    if (!message.chartData || message.chartData.length === 0) return null;
    
    // Simple bar chart visualization
    const maxValue = Math.max(...message.chartData.map(item => item.value));
    
    return (
      <div className="mt-4 bg-[#f8f8fc] p-4 rounded-lg border border-[#d5d5ec]">
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-medium text-[#4E50A8]">Data Visualization</h4>
          <div className="flex items-end h-40 gap-2">
            {message.chartData.map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className="w-10 bg-[#4E50A8] hover:bg-[#6365c2] transition-colors rounded-t"
                  style={{ height: `${(item.value / maxValue) * 100}%` }}
                ></div>
                <span className="text-xs mt-1">{item.name}</span>
                <span className="text-xs text-gray-500">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderFileInfo = () => {
    if (!message.file) return null;
    
    return (
      <div className="text-xs text-gray-500 mt-1">
        Attached file: {message.file.name}
      </div>
    );
  };

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        {/* Avatar - only for AI */}
        {!message.isUser && (
          <div className="w-8 h-8 rounded-full bg-[#d5d5ec] flex items-center justify-center flex-shrink-0">
            <Bot size={16} className="text-[#4E50A8]" />
          </div>
        )}

        {/* Message Content */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-700">
              {message.isUser ? 'You' : message.mode ? message.mode.charAt(0).toUpperCase() + message.mode.slice(1) : 'CHAT A.I+'}
            </span>
            <span className="text-xs text-gray-500">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
          
          {message.isUser ? (
            <div className="prose prose-sm max-w-none rounded-2xl p-4 bg-[#F1F1F9] text-gray-800 ml-auto">
              {message.content}
              {renderFileInfo()}
            </div>
          ) : (
            <div className="prose prose-sm max-w-none text-gray-700">
              {message.content}
              {message.mode === 'endocs' && renderTableData()}
              {message.mode === 'ensights' && renderChartData()}
            </div>
          )}

          {/* Action Buttons - Only for AI messages */}
          {!message.isUser && (
            <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLike}
                className={`p-2 h-auto ${isLiked ? 'text-[#4E50A8]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <ThumbsUp size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDislike}
                className={`p-2 h-auto ${isDisliked ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <ThumbsDown size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="p-2 h-auto text-gray-400 hover:text-gray-600"
              >
                <Copy size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-auto text-gray-400 hover:text-gray-600"
              >
                <RotateCcw size={14} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
