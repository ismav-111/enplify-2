import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Copy, RotateCcw, BarChart, LineChart, PieChart, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart as RechartsBarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

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
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'grid'>('line');
  const [tooltipVisible, setTooltipVisible] = useState(false);

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
      <div className="mt-4 bg-[#F1F1F9] p-4 rounded-lg border border-[#d5d5ec]">
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

  const getChartTypeLabel = () => {
    switch(chartType) {
      case 'line': return 'Line Chart';
      case 'bar': return 'Bar Chart';
      case 'pie': return 'Pie Chart';
      case 'grid': return 'Grid View';
      default: return '';
    }
  };

  const renderChartData = () => {
    if (!message.chartData || message.chartData.length === 0) return null;
    
    const chartConfig = {
      "sales": {
        label: "Sales Trend",
        theme: { light: "#4E50A8", dark: "#4E50A8" }
      }
    };
    
    return (
      <div className="mt-4 bg-[#F1F1F9] p-4 rounded-lg border border-[#d5d5ec]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h4 className="text-md font-medium text-gray-800">Data Visualization</h4>
              {tooltipVisible && (
                <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">
                  {getChartTypeLabel()}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant={chartType === 'line' ? 'default' : 'outline'}
                size="icon"
                className={chartType === 'line' ? "bg-[#4E50A8] hover:bg-[#4042a0] h-8 w-8" : "text-[#4E50A8] border-gray-200 h-8 w-8"}
                onClick={() => setChartType('line')}
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
              >
                <LineChart size={16} />
              </Button>
              <Button 
                variant={chartType === 'bar' ? 'default' : 'outline'}
                size="icon"
                className={chartType === 'bar' ? "bg-[#4E50A8] hover:bg-[#4042a0] h-8 w-8" : "text-[#4E50A8] border-gray-200 h-8 w-8"}
                onClick={() => setChartType('bar')}
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
              >
                <BarChart size={16} />
              </Button>
              <Button 
                variant={chartType === 'pie' ? 'default' : 'outline'}
                size="icon"
                className={chartType === 'pie' ? "bg-[#4E50A8] hover:bg-[#4042a0] h-8 w-8" : "text-gray-500 border-gray-200 h-8 w-8"}
                onClick={() => setChartType('pie')}
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
              >
                <PieChart size={16} />
              </Button>
              <Button 
                variant={chartType === 'grid' ? 'default' : 'outline'}
                size="icon"
                className={chartType === 'grid' ? "bg-[#4E50A8] hover:bg-[#4042a0] h-8 w-8" : "text-gray-500 border-gray-200 h-8 w-8"}
                onClick={() => setChartType('grid')}
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
              >
                <Grid size={16} />
              </Button>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ChartContainer 
              config={chartConfig}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <RechartsLineChart 
                    data={message.chartData}
                    margin={{ top: 20, right: 30, left: 60, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888" 
                      tickMargin={10}
                    />
                    <YAxis
                      stroke="#888"
                      tickFormatter={(value) => `$${value}`}
                      tickMargin={10}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
                              <p className="text-sm">{`${payload[0].payload.name}: $${payload[0].value}`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line 
                      type="monotone"
                      dataKey="value" 
                      stroke="#4E50A8" 
                      strokeWidth={2}
                      dot={{ fill: "#4E50A8", r: 4 }}
                      activeDot={{ r: 6, fill: "#4E50A8" }}
                      name="sales"
                    />
                  </RechartsLineChart>
                ) : (
                  <RechartsBarChart
                    data={message.chartData}
                    margin={{ top: 20, right: 30, left: 60, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888" 
                      tickMargin={10}
                    />
                    <YAxis
                      stroke="#888"
                      tickFormatter={(value) => `$${value}`}
                      tickMargin={10}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
                              <p className="text-sm">{`${payload[0].payload.name}: $${payload[0].value}`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#4E50A8"
                      name="sales"
                    />
                  </RechartsBarChart>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="text-center text-sm text-[#4E50A8] font-medium">
            Sales Trend
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
    <div className="flex mb-8">
      {!message.isUser && (
        <div className="w-9 h-9 rounded-full bg-[#d5d5ec] flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
          <span className="text-[#4E50A8] font-semibold">e</span>
        </div>
      )}
      
      <div className={`flex flex-col ${message.isUser ? 'items-end ml-auto' : 'ml-4'} max-w-[80%]`}>
        {message.isUser ? (
          <>
            <div className="rounded-xl py-3 px-4 bg-[#E2E2F3] text-gray-800">
              <p className="text-base">{message.content}</p>
              {renderFileInfo()}
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </>
        ) : (
          <>
            <div className="text-gray-800">
              <div className="text-base leading-relaxed">
                {message.content}
              </div>
              {message.mode === 'endocs' && renderTableData()}
              {message.mode === 'ensights' && renderChartData()}
            </div>

            {/* Action Buttons with timestamp */}
            <div className="flex items-center gap-2 mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLike}
                className={`p-2 h-auto rounded-full ${isLiked ? 'text-[#4E50A8] bg-[#F1F1F9]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
              >
                <ThumbsUp size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDislike}
                className={`p-2 h-auto rounded-full ${isDisliked ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
              >
                <ThumbsDown size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="p-2 h-auto text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <Copy size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-auto text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <RotateCcw size={16} />
              </Button>
              <span className="text-xs text-gray-500">
                {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
