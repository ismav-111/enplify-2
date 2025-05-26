import { useState, useRef } from 'react';
import { ThumbsUp, ThumbsDown, Copy, RotateCcw, BarChart, LineChart, PieChart, Grid, Download, FileText, Calendar, Building, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import * as XLSX from 'xlsx';

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
  const chartRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadExcel = () => {
    if (!message.tableData || message.tableData.length === 0) return;
    
    const worksheet = XLSX.utils.json_to_sheet(message.tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Documents');
    
    // Add some styling to the header
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "4E50A8" } }
      };
    }
    
    XLSX.writeFile(workbook, 'endocs-documents.xlsx');
  };

  const downloadChartAsImage = async (format: 'png' | 'jpg' | 'svg') => {
    if (!chartRef.current) return;

    if (format === 'svg') {
      const svgElement = chartRef.current.querySelector('svg');
      if (!svgElement) return;
      
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ensights-chart.svg';
      link.click();
      
      URL.revokeObjectURL(url);
      return;
    }

    // For PNG and JPG, we'll use html2canvas-like functionality
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgElement = chartRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width || 800;
      canvas.height = img.height || 400;
      
      if (format === 'jpg') {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ensights-chart.${format}`;
        link.click();
        URL.revokeObjectURL(url);
      }, `image/${format}`, 0.95);
    };
    
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.src = url;
  };

  const renderTableData = () => {
    if (!message.tableData || message.tableData.length === 0) return null;
    
    return (
      <div className="mt-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 rounded-2xl border border-blue-100 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4E50A8] to-[#6366F1] rounded-xl flex items-center justify-center shadow-md">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Document Intelligence</h3>
              <p className="text-sm text-gray-600">Enterprise knowledge base search results</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-white hover:bg-[#4E50A8] hover:text-white border-[#4E50A8] text-[#4E50A8] transition-all duration-200 shadow-sm"
              >
                <Download size={16} className="mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleDownloadExcel} className="cursor-pointer">
                <FileText size={16} className="mr-2" />
                Download Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-[#4E50A8]/10 to-[#6366F1]/10 hover:from-[#4E50A8]/10 hover:to-[#6366F1]/10">
                <TableHead className="text-[#4E50A8] font-bold py-6 px-6 text-base">
                  <div className="flex items-center gap-3">
                    <FileText size={18} />
                    Document Title
                  </div>
                </TableHead>
                <TableHead className="text-[#4E50A8] font-bold py-6 px-6 text-base">Content Summary</TableHead>
                <TableHead className="text-[#4E50A8] font-bold py-6 px-6 text-center text-base">
                  <div className="flex items-center justify-center gap-2">
                    Relevance Score
                  </div>
                </TableHead>
                <TableHead className="text-[#4E50A8] font-bold py-6 px-6 text-base">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    Last Modified
                  </div>
                </TableHead>
                <TableHead className="text-[#4E50A8] font-bold py-6 px-6 text-base">
                  <div className="flex items-center gap-2">
                    <Building size={18} />
                    Department
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {message.tableData.map((row, i) => (
                <TableRow key={i} className="hover:bg-blue-50/30 transition-all duration-200 border-b border-gray-50">
                  <TableCell className="py-6 px-6">
                    <div className="font-semibold text-gray-900 text-base leading-relaxed">{row.title}</div>
                  </TableCell>
                  <TableCell className="py-6 px-6 max-w-md">
                    <div className="text-gray-700 text-sm leading-relaxed line-clamp-3">{row.content}</div>
                  </TableCell>
                  <TableCell className="py-6 px-6 text-center">
                    <div className="flex justify-center">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${
                        parseInt(row.relevance) >= 90 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' 
                          : parseInt(row.relevance) >= 80 
                          ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200'
                          : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200'
                      }`}>
                        {row.relevance}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-6 px-6 text-gray-600 font-medium">
                    {row.lastUpdated}
                  </TableCell>
                  <TableCell className="py-6 px-6">
                    <span className="px-3 py-2 bg-gradient-to-r from-[#4E50A8]/10 to-[#6366F1]/10 text-[#4E50A8] rounded-lg text-sm font-semibold border border-[#4E50A8]/20">
                      {row.department}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Showing {message.tableData.length} relevant documents</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Last indexed: 2 minutes ago</span>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Powered by Enterprise Search AI
          </div>
        </div>
      </div>
    );
  };

  const renderChartData = () => {
    if (!message.chartData || message.chartData.length === 0) return null;
    
    const chartConfig = {
      "sales": {
        label: "Business Metrics",
        theme: { light: "#4E50A8", dark: "#4E50A8" }
      }
    };
    
    const COLORS = ['#4E50A8', '#6366F1', '#8B5CF6', '#A855F7', '#C084FC', '#E879F9', '#F0ABFC', '#F8BBD9'];
    
    return (
      <div className="mt-8 bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8 rounded-2xl border border-purple-100 shadow-lg">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#4E50A8] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-md">
                <BarChart size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Business Intelligence Dashboard</h3>
                <p className="text-sm text-gray-600">Real-time analytics and insights</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                <Button 
                  variant={chartType === 'line' ? 'default' : 'ghost'}
                  size="sm"
                  className={chartType === 'line' ? "bg-[#4E50A8] hover:bg-[#4042a0] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}
                  onClick={() => setChartType('line')}
                >
                  <LineChart size={16} className="mr-2" />
                  Line
                </Button>
                <Button 
                  variant={chartType === 'bar' ? 'default' : 'ghost'}
                  size="sm"
                  className={chartType === 'bar' ? "bg-[#4E50A8] hover:bg-[#4042a0] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}
                  onClick={() => setChartType('bar')}
                >
                  <BarChart size={16} className="mr-2" />
                  Bar
                </Button>
                <Button 
                  variant={chartType === 'pie' ? 'default' : 'ghost'}
                  size="sm"
                  className={chartType === 'pie' ? "bg-[#4E50A8] hover:bg-[#4042a0] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}
                  onClick={() => setChartType('pie')}
                >
                  <PieChart size={16} className="mr-2" />
                  Pie
                </Button>
                <Button 
                  variant={chartType === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  className={chartType === 'grid' ? "bg-[#4E50A8] hover:bg-[#4042a0] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}
                  onClick={() => setChartType('grid')}
                >
                  <Grid size={16} className="mr-2" />
                  Table
                </Button>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="bg-white hover:bg-[#4E50A8] hover:text-white border-[#4E50A8] text-[#4E50A8] transition-all duration-200 shadow-sm"
                  >
                    <Download size={16} className="mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => downloadChartAsImage('png')} className="cursor-pointer">
                    <Image size={16} className="mr-2" />
                    Download PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadChartAsImage('jpg')} className="cursor-pointer">
                    <Image size={16} className="mr-2" />
                    Download JPG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadChartAsImage('svg')} className="cursor-pointer">
                    <Image size={16} className="mr-2" />
                    Download SVG
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div ref={chartRef} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            {chartType === 'line' && (
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart 
                    data={message.chartData}
                    margin={{ top: 20, right: 30, left: 60, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.6} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6b7280" 
                      tickMargin={10}
                      fontSize={12}
                      fontWeight={500}
                    />
                    <YAxis
                      stroke="#6b7280"
                      tickFormatter={(value) => {
                        const numValue = Number(value);
                        return isNaN(numValue) ? '0' : `$${(numValue/1000).toFixed(0)}k`;
                      }}
                      tickMargin={10}
                      fontSize={12}
                      fontWeight={500}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const value = Number(payload[0].value) || 0;
                          return (
                            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                              <p className="text-sm font-semibold text-gray-800 mb-1">{label}</p>
                              <p className="text-sm text-[#4E50A8] font-medium">${(value/1000).toFixed(0)}k</p>
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
                      strokeWidth={4}
                      dot={{ fill: "#4E50A8", strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: "#4E50A8", stroke: "#fff", strokeWidth: 3 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {chartType === 'bar' && (
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={message.chartData}
                    margin={{ top: 20, right: 30, left: 60, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.6} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6b7280" 
                      tickMargin={10}
                      fontSize={12}
                      fontWeight={500}
                    />
                    <YAxis
                      stroke="#6b7280"
                      tickFormatter={(value) => {
                        const numValue = Number(value);
                        return isNaN(numValue) ? '0' : `$${(numValue/1000).toFixed(0)}k`;
                      }}
                      tickMargin={10}
                      fontSize={12}
                      fontWeight={500}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const value = Number(payload[0].value) || 0;
                          return (
                            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                              <p className="text-sm font-semibold text-gray-800 mb-1">{label}</p>
                              <p className="text-sm text-[#4E50A8] font-medium">${(value/1000).toFixed(0)}k</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="url(#barGradient)"
                      radius={[6, 6, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4E50A8" />
                        <stop offset="100%" stopColor="#6366F1" />
                      </linearGradient>
                    </defs>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {chartType === 'pie' && (
              <div className="h-[450px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={message.chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      outerRadius={140}
                      innerRadius={60}
                      paddingAngle={3}
                      label={({ name, percent }) => `${(percent * 100).toFixed(1)}%`}
                      labelLine={false}
                      stroke="#fff"
                      strokeWidth={2}
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
                            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                              <p className="text-sm font-semibold text-gray-800 mb-1">{payload[0].name}</p>
                              <p className="text-sm text-[#4E50A8] font-medium">${(value/1000).toFixed(0)}k</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={80}
                      iconType="circle"
                      wrapperStyle={{ 
                        paddingTop: '30px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {chartType === 'grid' && (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-[#4E50A8]/10 to-[#6366F1]/10 hover:from-[#4E50A8]/10 hover:to-[#6366F1]/10">
                      <TableHead className="text-[#4E50A8] font-bold py-4 px-6 text-base">Period</TableHead>
                      <TableHead className="text-[#4E50A8] font-bold py-4 px-6 text-right text-base">Revenue</TableHead>
                      <TableHead className="text-[#4E50A8] font-bold py-4 px-6 text-right text-base">Growth Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {message.chartData.map((row, i) => {
                      const currentValue = Number(row.value) || 0;
                      const prevValue = i > 0 ? Number(message.chartData[i-1].value) || 0 : currentValue;
                      const growth = i > 0 && prevValue !== 0 ? ((currentValue - prevValue) / prevValue * 100).toFixed(1) : '0.0';
                      return (
                        <TableRow key={i} className="hover:bg-purple-50/50 transition-colors">
                          <TableCell className="font-semibold py-4 px-6 text-gray-900">{row.name}</TableCell>
                          <TableCell className="py-4 px-6 text-right font-mono text-lg font-bold text-gray-900">
                            ${(currentValue/1000).toFixed(0)}k
                          </TableCell>
                          <TableCell className={`py-4 px-6 text-right font-bold text-lg ${
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
          
          <div className="text-center bg-gradient-to-r from-[#4E50A8]/5 to-[#6366F1]/5 rounded-lg p-4">
            <div className="text-lg font-bold text-[#4E50A8] mb-2">
              Monthly Revenue Performance Analysis
            </div>
            <div className="text-sm text-gray-600">
              Real-time data synchronization • Last updated: {new Date().toLocaleString()}
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
