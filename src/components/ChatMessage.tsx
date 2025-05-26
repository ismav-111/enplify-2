
import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Copy, RotateCcw, BarChart, LineChart, PieChart, Grid, Download, FileText, Calendar, Building } from 'lucide-react';
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
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

  const handleDownloadChart = () => {
    if (!message.chartData || message.chartData.length === 0) return;
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    const headers = Object.keys(message.chartData[0]);
    csvContent += headers.join(",") + "\n";
    
    // Add data rows
    message.chartData.forEach(row => {
      const rowData = headers.map(header => row[header]);
      csvContent += rowData.join(",") + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "chart-data.csv");
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
  };

  const handleDownloadTable = () => {
    if (!message.tableData || message.tableData.length === 0) return;
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    const headers = Object.keys(message.tableData[0]);
    csvContent += headers.join(",") + "\n";
    
    // Add data rows
    message.tableData.forEach(row => {
      const rowData = headers.map(header => row[header]);
      csvContent += rowData.join(",") + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "table-data.csv");
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
  };

  const renderTableData = () => {
    if (!message.tableData || message.tableData.length === 0) return null;
    
    return (
      <div className="mt-6 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-[#4E50A8]" />
            <h4 className="text-lg font-semibold text-gray-800">Document References</h4>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-[#4E50A8] border-[#4E50A8] hover:bg-[#4E50A8] hover:text-white transition-colors"
            onClick={handleDownloadTable}
            title="Download table data as CSV"
          >
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>
        </div>
        
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#4E50A8]/5 hover:bg-[#4E50A8]/5">
                <TableHead className="text-[#4E50A8] font-semibold py-4 px-6">
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    Document Title
                  </div>
                </TableHead>
                <TableHead className="text-[#4E50A8] font-semibold py-4 px-6">Content Preview</TableHead>
                <TableHead className="text-[#4E50A8] font-semibold py-4 px-6 text-center">
                  Relevance
                </TableHead>
                <TableHead className="text-[#4E50A8] font-semibold py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    Last Updated
                  </div>
                </TableHead>
                <TableHead className="text-[#4E50A8] font-semibold py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Building size={16} />
                    Department
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {message.tableData.map((row, i) => (
                <TableRow key={i} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="py-4 px-6">
                    <div className="font-medium text-gray-900">{row.title}</div>
                  </TableCell>
                  <TableCell className="py-4 px-6 max-w-md">
                    <div className="text-gray-600 text-sm line-clamp-2">{row.content}</div>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      parseInt(row.relevance) >= 90 
                        ? 'bg-green-100 text-green-800' 
                        : parseInt(row.relevance) >= 80 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {row.relevance}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-gray-600 text-sm">
                    {row.lastUpdated}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="px-2 py-1 bg-[#4E50A8]/10 text-[#4E50A8] rounded-md text-sm font-medium">
                      {row.department}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 flex items-center gap-4">
          <span>• Showing {message.tableData.length} of {message.tableData.length} documents</span>
          <span>• Last indexed: 2 minutes ago</span>
        </div>
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
    
    // Colors for pie chart
    const COLORS = ['#4E50A8', '#6366F1', '#8B5CF6', '#A855F7', '#C084FC', '#D8B4FE'];
    
    return (
      <div className="mt-6 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart size={20} className="text-[#4E50A8]" />
              <h4 className="text-lg font-semibold text-gray-800">Business Intelligence Dashboard</h4>
              {tooltipVisible && (
                <span className="text-xs bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200 text-gray-600">
                  {getChartTypeLabel()}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant={chartType === 'line' ? 'default' : 'outline'}
                size="sm"
                className={chartType === 'line' ? "bg-[#4E50A8] hover:bg-[#4042a0]" : "text-[#4E50A8] border-gray-200 hover:bg-[#4E50A8]/10"}
                onClick={() => setChartType('line')}
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
              >
                <LineChart size={16} className="mr-2" />
                Line
              </Button>
              <Button 
                variant={chartType === 'bar' ? 'default' : 'outline'}
                size="sm"
                className={chartType === 'bar' ? "bg-[#4E50A8] hover:bg-[#4042a0]" : "text-[#4E50A8] border-gray-200 hover:bg-[#4E50A8]/10"}
                onClick={() => setChartType('bar')}
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
              >
                <BarChart size={16} className="mr-2" />
                Bar
              </Button>
              <Button 
                variant={chartType === 'pie' ? 'default' : 'outline'}
                size="sm"
                className={chartType === 'pie' ? "bg-[#4E50A8] hover:bg-[#4042a0]" : "text-[#4E50A8] border-gray-200 hover:bg-[#4E50A8]/10"}
                onClick={() => setChartType('pie')}
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
              >
                <PieChart size={16} className="mr-2" />
                Pie
              </Button>
              <Button 
                variant={chartType === 'grid' ? 'default' : 'outline'}
                size="sm"
                className={chartType === 'grid' ? "bg-[#4E50A8] hover:bg-[#4042a0]" : "text-gray-500 border-gray-200 hover:bg-gray-100"}
                onClick={() => setChartType('grid')}
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
              >
                <Grid size={16} className="mr-2" />
                Table
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-[#4E50A8] border-[#4E50A8] hover:bg-[#4E50A8] hover:text-white transition-colors"
                onClick={handleDownloadChart}
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
                title="Download chart data as CSV"
              >
                <Download size={16} className="mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            {chartType === 'line' && (
              <div className="h-[350px] w-full">
                <ChartContainer 
                  config={chartConfig}
                  className="h-full w-full"
                >
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
                      tickFormatter={(value) => {
                        const numValue = Number(value);
                        return isNaN(numValue) ? '0' : `$${(numValue/1000).toFixed(0)}k`;
                      }}
                      tickMargin={10}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const value = Number(payload[0].value) || 0;
                          return (
                            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                              <p className="text-sm font-medium">{`${payload[0].payload.name}: $${(value/1000).toFixed(0)}k`}</p>
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
                      strokeWidth={3}
                      dot={{ fill: "#4E50A8", r: 5 }}
                      activeDot={{ r: 7, fill: "#4E50A8" }}
                      name="sales"
                    />
                  </RechartsLineChart>
                </ChartContainer>
              </div>
            )}
            
            {chartType === 'bar' && (
              <div className="h-[350px] w-full">
                <ChartContainer 
                  config={chartConfig}
                  className="h-full w-full"
                >
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
                      tickFormatter={(value) => {
                        const numValue = Number(value);
                        return isNaN(numValue) ? '0' : `$${(numValue/1000).toFixed(0)}k`;
                      }}
                      tickMargin={10}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const value = Number(payload[0].value) || 0;
                          return (
                            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                              <p className="text-sm font-medium">{`${payload[0].payload.name}: $${(value/1000).toFixed(0)}k`}</p>
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
                      radius={[4, 4, 0, 0]}
                    />
                  </RechartsBarChart>
                </ChartContainer>
              </div>
            )}
            
            {chartType === 'pie' && (
              <div className="h-[400px] w-full flex items-center justify-center">
                <div className="w-full h-full max-w-[500px]">
                  <RechartsPieChart width={500} height={400}>
                    <Pie
                      data={message.chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      outerRadius={120}
                      innerRadius={40}
                      paddingAngle={2}
                      label={({name, percent}) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {message.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const value = Number(payload[0].value) || 0;
                          return (
                            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                              <p className="text-sm font-medium">{`${payload[0].name}: $${(value/1000).toFixed(0)}k`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={60}
                      iconType="circle"
                      wrapperStyle={{ 
                        paddingTop: '20px',
                        fontSize: '14px'
                      }}
                    />
                  </RechartsPieChart>
                </div>
              </div>
            )}
            
            {chartType === 'grid' && (
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#4E50A8]/5 hover:bg-[#4E50A8]/5">
                      <TableHead className="text-[#4E50A8] font-semibold py-3 px-4">Period</TableHead>
                      <TableHead className="text-[#4E50A8] font-semibold py-3 px-4 text-right">Revenue</TableHead>
                      <TableHead className="text-[#4E50A8] font-semibold py-3 px-4 text-right">Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {message.chartData.map((row, i) => {
                      const currentValue = Number(row.value) || 0;
                      const prevValue = i > 0 ? Number(message.chartData[i-1].value) || 0 : currentValue;
                      const growth = i > 0 && prevValue !== 0 ? ((currentValue - prevValue) / prevValue * 100).toFixed(1) : '0.0';
                      return (
                        <TableRow key={i} className="hover:bg-gray-50/50 transition-colors">
                          <TableCell className="font-medium py-3 px-4">{row.name}</TableCell>
                          <TableCell className="py-3 px-4 text-right font-mono">${(currentValue/1000).toFixed(0)}k</TableCell>
                          <TableCell className={`py-3 px-4 text-right font-medium ${
                            parseFloat(growth) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {parseFloat(growth) >= 0 ? '+' : ''}{growth}%
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <div className="text-sm font-medium text-[#4E50A8] mb-1">
              Monthly Revenue Analysis
            </div>
            <div className="text-xs text-gray-500">
              Data updated in real-time • Last sync: {new Date().toLocaleTimeString()}
            </div>
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
            <div className="rounded-xl py-3 px-4 bg-[#f6f8ff] text-gray-800">
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
