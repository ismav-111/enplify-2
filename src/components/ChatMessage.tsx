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
  LineChart as RechartsLine,
  BarChart as RechartsBar,
  PieChart as RechartsPie,
  Line,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';
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
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'composed'>('line');
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
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
            <p className="text-sm text-gray-600 mt-1">{message.tableData.length} documents found</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 h-9">
                <Download size={16} />
                Download
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

  const getMethodologyText = () => {
    if (!message.chartData || message.chartData.length === 0) return null;

    switch(chartType) {
      case 'line':
        return "This visualization employs a sophisticated linear regression model enhanced with seasonal decomposition algorithms. The methodology uses the formula: Revenue(t) = Base Revenue + (Growth Rate × Time) + Seasonal Adjustment, where seasonal adjustments are calculated using historical patterns including holiday boosts (25% increase in December), post-holiday corrections (15% decrease in January), and summer slowdowns (8% decrease in July-August). The trend line represents the underlying business trajectory after removing seasonal noise, providing clear insights into fundamental growth patterns.";
      case 'bar':
        return "The bar chart methodology aggregates monthly revenue using the formula: Monthly Revenue = Σ(Customer Segments) + Regional Performance + Product Mix, providing a comprehensive view of business performance across different time periods. This approach enables easy identification of peak performance months, seasonal variations, and growth anomalies. The visualization incorporates data from CRM systems, financial databases, and operational metrics to provide a unified view of organizational performance.";
      case 'pie':
        return "The pie chart utilizes proportional analysis with the formula: Percentage = (Individual Month Revenue / Total Annual Revenue) × 100, revealing the distribution of annual revenue across different time periods. This methodology helps identify concentration risk, seasonal dependencies, and revenue distribution patterns that inform strategic planning.";
      case 'composed':
        return "This advanced visualization combines multiple data series using a dual-axis approach: Primary Axis = Revenue Trends + Secondary Axis = Growth Rate %, enabling comprehensive analysis of both absolute performance and relative growth patterns. The methodology leverages cross-correlation analysis to identify leading indicators and seasonal patterns that drive business performance across multiple dimensions.";
      default:
        return "";
    }
  };

  const renderChartData = () => {
    if (!message.chartData || message.chartData.length === 0) return null;
    
    const chartColors = {
      primary: '#595fb7',
      secondary: '#4e50a8',
      accent: '#373995',
      success: '#059669',
      warning: '#d97706'
    };

    // Transform data for Recharts
    const chartData = message.chartData.map((item, index) => ({
      name: item.name,
      revenue: item.value,
      growth: Math.round((Math.random() * 20 + 5) * 100) / 100, // Simulated growth rate
      target: item.value * 0.9 + (Math.random() * 0.2 * item.value) // Simulated target
    }));

    const pieColors = [
      chartColors.primary,
      chartColors.secondary,
      chartColors.accent,
      chartColors.success,
      chartColors.warning,
      '#7c3aed',
      '#db2777',
      '#dc2626',
      '#ea580c',
      '#ca8a04',
      '#65a30d',
      '#0891b2'
    ];
    
    return (
      <div className="mt-8 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Business Intelligence Analysis</h2>
            <p className="text-sm text-gray-600 mt-1">Interactive performance visualization with {message.chartData.length} data points</p>
          </div>
          <div className="flex gap-3 items-center">
            {/* Chart Type Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
              <Button 
                variant="ghost"
                size="sm"
                className={`h-9 w-9 p-0 transition-all ${
                  chartType === 'line' 
                    ? "bg-[#595fb7] text-white shadow-sm hover:bg-[#4e50a8]" 
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setChartType('line')}
                title="Line Chart"
              >
                <LineChart size={16} />
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                className={`h-9 w-9 p-0 transition-all ${
                  chartType === 'bar' 
                    ? "bg-[#595fb7] text-white shadow-sm hover:bg-[#4e50a8]" 
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setChartType('bar')}
                title="Bar Chart"
              >
                <BarChart size={16} />
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                className={`h-9 w-9 p-0 transition-all ${
                  chartType === 'pie' 
                    ? "bg-[#595fb7] text-white shadow-sm hover:bg-[#4e50a8]" 
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setChartType('pie')}
                title="Pie Chart"
              >
                <PieChart size={16} />
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                className={`h-9 w-9 p-0 transition-all ${
                  chartType === 'composed' 
                    ? "bg-[#595fb7] text-white shadow-sm hover:bg-[#4e50a8]" 
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setChartType('composed')}
                title="Dual Axis Chart"
              >
                <BarChart size={16} />
              </Button>
            </div>
            {/* Download Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-gray-600 hover:text-gray-800 hover:bg-gray-200" title="Download Chart">
                  <Download size={16} />
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

        {/* Methodology Text with Hover Expansion */}
        <div className="relative group">
          <p className="text-sm text-gray-700 leading-relaxed cursor-help">
            <span className="line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
              {getMethodologyText()}
            </span>
            <span className="text-blue-600 text-xs ml-2 group-hover:hidden">... hover to expand</span>
          </p>
        </div>
        
        {/* Chart Container */}
        <div ref={chartRef} className="border border-gray-200 rounded-lg bg-white p-6 shadow-sm">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' && (
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`$${(value/1000).toFixed(0)}k`, 'Revenue']}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke={chartColors.primary}
                    fill={chartColors.primary}
                    fillOpacity={0.1}
                    strokeWidth={3}
                  />
                </AreaChart>
              )}
              
              {chartType === 'bar' && (
                <RechartsBar data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`$${(value/1000).toFixed(0)}k`, 'Revenue']}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill={chartColors.primary}
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBar>
              )}
              
              {chartType === 'pie' && (
                <RechartsPie>
                  <Pie
                    data={chartData}
                    dataKey="revenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`$${(value/1000).toFixed(0)}k`, 'Revenue']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </RechartsPie>
              )}

              {chartType === 'composed' && (
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    yAxisId="revenue"
                    orientation="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                  />
                  <YAxis 
                    yAxisId="growth"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'revenue' ? `$${(value/1000).toFixed(0)}k` : `${value}%`,
                      name === 'revenue' ? 'Revenue' : 'Growth Rate'
                    ]}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    yAxisId="revenue"
                    dataKey="revenue" 
                    fill={chartColors.primary}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line 
                    yAxisId="growth"
                    type="monotone" 
                    dataKey="growth" 
                    stroke={chartColors.success}
                    strokeWidth={3}
                    dot={{ fill: chartColors.success, strokeWidth: 2, r: 4 }}
                  />
                </ComposedChart>
              )}
            </ResponsiveContainer>
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

  const renderFormattedContent = () => {
    if (message.mode !== 'ensights') {
      return (
        <div className="text-sm leading-relaxed">
          {message.content}
        </div>
      );
    }

    // Format Ensights content with proper structure
    const lines = message.content.split('\n');
    const formattedContent = [];
    let currentListItems = [];
    let inList = false;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        // Close any open list before adding heading
        if (inList && currentListItems.length > 0) {
          formattedContent.push(
            <ul key={`list-${index}`} className="list-disc list-inside space-y-1 my-3 text-gray-700">
              {currentListItems}
            </ul>
          );
          currentListItems = [];
          inList = false;
        }
        
        // Main headings
        formattedContent.push(
          <h2 key={index} className="text-lg font-bold text-gray-900 mt-6 mb-3 first:mt-0">
            {trimmedLine.replace(/\*\*/g, '')}
          </h2>
        );
      } else if (trimmedLine.startsWith('###')) {
        // Close any open list before adding sub-heading
        if (inList && currentListItems.length > 0) {
          formattedContent.push(
            <ul key={`list-${index}`} className="list-disc list-inside space-y-1 my-3 text-gray-700">
              {currentListItems}
            </ul>
          );
          currentListItems = [];
          inList = false;
        }
        
        // Sub-headings
        formattedContent.push(
          <h3 key={index} className="text-base font-semibold text-gray-800 mt-4 mb-2">
            {trimmedLine.replace(/### /g, '')}
          </h3>
        );
      } else if (trimmedLine.startsWith('- ')) {
        // List items
        inList = true;
        currentListItems.push(
          <li key={`li-${index}`} className="ml-4">
            {trimmedLine.replace(/^- /, '')}
          </li>
        );
      } else if (trimmedLine === '' && inList) {
        // Empty line - close the list
        if (currentListItems.length > 0) {
          formattedContent.push(
            <ul key={`list-${index}`} className="list-disc list-inside space-y-1 my-3 text-gray-700">
              {currentListItems}
            </ul>
          );
          currentListItems = [];
          inList = false;
        }
      } else if (trimmedLine !== '') {
        // Close any open list before adding paragraph
        if (inList && currentListItems.length > 0) {
          formattedContent.push(
            <ul key={`list-${index}`} className="list-disc list-inside space-y-1 my-3 text-gray-700">
              {currentListItems}
            </ul>
          );
          currentListItems = [];
          inList = false;
        }
        
        // Regular paragraphs
        formattedContent.push(
          <p key={index} className="text-sm leading-relaxed text-gray-700 mb-4">
            {trimmedLine}
          </p>
        );
      }
    });

    // Close any remaining open list
    if (inList && currentListItems.length > 0) {
      formattedContent.push(
        <ul key="final-list" className="list-disc list-inside space-y-1 my-3 text-gray-700">
          {currentListItems}
        </ul>
      );
    }

    return <div className="space-y-2">{formattedContent}</div>;
  };

  return (
    <div className="flex mb-8">
      {!message.isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 mt-1 border border-gray-200">
          <span className="text-gray-700 font-bold text-sm font-comfortaa">e</span>
        </div>
      )}
      
      <div className={`flex flex-col ${message.isUser ? 'items-end ml-auto' : 'ml-3'} max-w-[85%]`}>
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
              <div className="mb-4">
                {renderFormattedContent()}
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
                className={`p-1.5 h-auto rounded transition-colors ${isLiked ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <ThumbsUp size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDislike}
                className={`p-1.5 h-auto rounded transition-colors ${isDisliked ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <ThumbsDown size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="p-1.5 h-auto text-gray-400 hover:text-gray-600 rounded transition-colors"
              >
                <Copy size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-1.5 h-auto text-gray-400 hover:text-gray-600 rounded transition-colors"
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
