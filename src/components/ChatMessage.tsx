import { useState, useRef } from 'react';
import { ThumbsUp, ThumbsDown, Copy, RotateCcw, BarChart, LineChart, PieChart, Download, FileText, Image } from 'lucide-react';
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
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
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
      
      const serializer = new XMLSerializer();
      const svgData = serializer.serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ensights-chart.svg';
      link.click();
      
      URL.revokeObjectURL(url);
      return;
    }

    // For PNG and JPG, we'll use canvas-based approach
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgElement = chartRef.current.querySelector('svg');
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svgElement);
    const img = document.createElement('img') as HTMLImageElement;
    
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
      <div className="mt-6 space-y-4">
        {/* Simple header similar to ChatGPT/Grok */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
            <p className="text-sm text-gray-600 mt-1">{message.tableData.length} documents found</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Download size={16} />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDownloadExcel} className="cursor-pointer">
                <FileText size={16} className="mr-2" />
                Download Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Clean table design similar to ChatGPT */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80">
                <TableHead className="font-semibold text-gray-900 py-3 px-4">
                  Document
                </TableHead>
                <TableHead className="font-semibold text-gray-900 py-3 px-4">
                  Content
                </TableHead>
                <TableHead className="font-semibold text-gray-900 py-3 px-4 text-center">
                  Relevance
                </TableHead>
                <TableHead className="font-semibold text-gray-900 py-3 px-4">
                  Modified
                </TableHead>
                <TableHead className="font-semibold text-gray-900 py-3 px-4">
                  Department
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {message.tableData.map((row, i) => (
                <TableRow key={i} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-b-0">
                  <TableCell className="py-3 px-4">
                    <div className="font-medium text-gray-900">{row.title}</div>
                  </TableCell>
                  <TableCell className="py-3 px-4 max-w-md">
                    <div className="text-gray-700 text-sm line-clamp-2">{row.content}</div>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center">
                    <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${
                      Number(row.relevance) >= 90 
                        ? 'bg-green-100 text-green-800' 
                        : Number(row.relevance) >= 80 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {row.relevance}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-600 text-sm">
                    {row.lastUpdated}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <span className="inline-flex px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                      {row.department}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const renderChartData = () => {
    if (!message.chartData || message.chartData.length === 0) return null;
    
    const COLORS = ['#4f46e5', '#7c3aed', '#db2777', '#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d'];
    
    return (
      <div className="mt-6 space-y-4">
        {/* Simple header similar to ChatGPT/Grok */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Data Analysis</h3>
            <p className="text-sm text-gray-600 mt-1">Monthly performance metrics</p>
          </div>
          <div className="flex gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button 
                variant={chartType === 'line' ? 'default' : 'ghost'}
                size="sm"
                className={chartType === 'line' ? "bg-white shadow-sm" : ""}
                onClick={() => setChartType('line')}
                title="Line Chart"
              >
                <LineChart size={16} />
              </Button>
              <Button 
                variant={chartType === 'bar' ? 'default' : 'ghost'}
                size="sm"
                className={chartType === 'bar' ? "bg-white shadow-sm" : ""}
                onClick={() => setChartType('bar')}
                title="Bar Chart"
              >
                <BarChart size={16} />
              </Button>
              <Button 
                variant={chartType === 'pie' ? 'default' : 'ghost'}
                size="sm"
                className={chartType === 'pie' ? "bg-white shadow-sm" : ""}
                onClick={() => setChartType('pie')}
                title="Pie Chart"
              >
                <PieChart size={16} />
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download size={16} />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
        
        {/* Chart container with clean design */}
        <div ref={chartRef} className="border border-gray-200 rounded-lg bg-white p-6">
          {chartType === 'line' && (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart 
                  data={message.chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6b7280" 
                    fontSize={12}
                  />
                  <YAxis
                    stroke="#6b7280"
                    tickFormatter={(value) => {
                      const numValue = Number(value);
                      return isNaN(numValue) ? '0' : `$${(numValue/1000).toFixed(0)}k`;
                    }}
                    fontSize={12}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const value = Number(payload[0].value) || 0;
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="text-sm font-medium text-gray-800">{label}</p>
                            <p className="text-sm text-blue-600">${(value/1000).toFixed(0)}k</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone"
                    dataKey="value" 
                    stroke="#4f46e5" 
                    strokeWidth={2}
                    dot={{ fill: "#4f46e5", strokeWidth: 2, r: 4 }}
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
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6b7280" 
                    fontSize={12}
                  />
                  <YAxis
                    stroke="#6b7280"
                    tickFormatter={(value) => {
                      const numValue = Number(value);
                      return isNaN(numValue) ? '0' : `$${(numValue/1000).toFixed(0)}k`;
                    }}
                    fontSize={12}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const value = Number(payload[0].value) || 0;
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="text-sm font-medium text-gray-800">{label}</p>
                            <p className="text-sm text-blue-600">${(value/1000).toFixed(0)}k</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#4f46e5"
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          )}
          
          {chartType === 'pie' && (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={message.chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
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
                            <p className="text-sm font-medium text-gray-800">{payload[0].name}</p>
                            <p className="text-sm text-blue-600">${(value/1000).toFixed(0)}k</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          )}
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
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-gray-600 font-medium text-sm">E</span>
        </div>
      )}
      
      <div className={`flex flex-col ${message.isUser ? 'items-end ml-auto' : 'ml-3'} max-w-[80%]`}>
        {message.isUser ? (
          <>
            <div className="rounded-lg py-3 px-4 text-gray-800" style={{ backgroundColor: '#F1F1F9' }}>
              <p className="text-sm">{message.content}</p>
              {renderFileInfo()}
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </>
        ) : (
          <>
            <div className="text-gray-800 w-full">
              <div className="text-sm leading-relaxed mb-4">
                {message.content}
              </div>
              {message.mode === 'endocs' && renderTableData()}
              {message.mode === 'ensights' && renderChartData()}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLike}
                className={`p-1.5 h-auto rounded ${isLiked ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <ThumbsUp size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDislike}
                className={`p-1.5 h-auto rounded ${isDisliked ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <ThumbsDown size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="p-1.5 h-auto text-gray-400 hover:text-gray-600 rounded"
              >
                <Copy size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-1.5 h-auto text-gray-400 hover:text-gray-600 rounded"
              >
                <RotateCcw size={14} />
              </Button>
              <span className="text-xs text-gray-500 ml-2">
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
