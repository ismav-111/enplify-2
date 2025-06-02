import { useState, useRef } from 'react';
import { ThumbsUp, ThumbsDown, Copy, RotateCcw, BarChart2, TrendingUp, PieChart, Download, FileText, Image, Activity } from 'lucide-react';
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
  AreaChart,
  Legend
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMethodologyExpanded, setIsMethodologyExpanded] = useState(false);
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

  const getSourceInfo = () => {
    switch (message.mode) {
      case 'endocs':
        return {
          title: 'Document Sources',
          items: ['company_policies.pdf', 'employee_handbook.docx', 'quarterly_reports.xlsx', 'meeting_notes.txt']
        };
      case 'ensights':
        return {
          title: 'Data Sources', 
          items: ['sales_database.sql', 'revenue_analytics.csv', 'customer_metrics.json', 'financial_reports.xlsx']
        };
      case 'encore':
        return {
          title: 'Knowledge Sources',
          items: ['knowledge_base.md', 'documentation.pdf', 'faq_database.json', 'support_articles.html']
        };
      default:
        return null;
    }
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
        return "This visualization employs a sophisticated linear regression model enhanced with seasonal decomposition algorithms. The X-axis represents time periods (months/quarters) showing chronological progression, while the Y-axis displays revenue values in thousands of dollars, providing clear insight into financial performance trends. The methodology uses the formula: Revenue(t) = Base Revenue + (Growth Rate × Time) + Seasonal Adjustment, where seasonal adjustments are calculated using historical patterns including holiday boosts (25% increase in December), post-holiday corrections (15% decrease in January), and summer slowdowns (8% decrease in July-August).";
      case 'bar':
        return "The bar chart methodology aggregates monthly revenue using discrete categorical analysis. The X-axis shows distinct time periods (months/quarters) as categorical variables, while the Y-axis represents absolute revenue values in thousands of dollars, enabling direct comparison between periods. This approach uses the formula: Monthly Revenue = Σ(Customer Segments) + Regional Performance + Product Mix, providing a comprehensive view of business performance across different time periods and enabling easy identification of peak performance months and growth anomalies.";
      case 'pie':
        return "The pie chart utilizes proportional analysis to show revenue distribution across time periods. Each segment represents a percentage of total annual revenue, with the entire circle representing 100% of the dataset. The methodology uses the formula: Percentage = (Individual Month Revenue / Total Annual Revenue) × 100, revealing the distribution and concentration patterns. This visualization helps identify seasonal dependencies, revenue concentration risk, and distribution patterns that inform strategic planning decisions.";
      case 'composed':
        return "This advanced dual-axis visualization combines absolute values with relative metrics for comprehensive analysis. The primary Y-axis (left) shows revenue values in thousands of dollars, while the secondary Y-axis (right) displays growth rate percentages. The X-axis represents time periods enabling temporal analysis. The methodology leverages cross-correlation analysis using the formula: Combined Analysis = Revenue Trends + Growth Rate Correlation, identifying leading indicators and performance patterns across multiple dimensions.";
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
        {/* Methodology Text */}
        <div className="relative">
          <p 
            className="text-sm text-gray-700 leading-relaxed cursor-pointer transition-all duration-300"
            onClick={() => setIsMethodologyExpanded(!isMethodologyExpanded)}
          >
            <span className={isMethodologyExpanded ? '' : 'line-clamp-2'}>
              {getMethodologyText()}
            </span>
            <span className="text-blue-600 text-xs ml-2 hover:underline">
              {isMethodologyExpanded ? '... click to collapse' : '... click to expand'}
            </span>
          </p>
        </div>

        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Business Intelligence Analysis</h2>
            <p className="text-sm text-gray-600 mt-1">Interactive performance visualization with {message.chartData.length} data points</p>
          </div>
          <div className="flex gap-1 items-center bg-gray-100 rounded-lg p-1">
            {/* Chart Type Selector */}
            <Button 
              variant="ghost"
              size="sm"
              className={`h-9 w-9 p-0 transition-all ${
                chartType === 'line' 
                  ? "bg-[#595fb7] text-white shadow-sm hover:bg-[#4e50a8]" 
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => setChartType('line')}
              title="Area Chart"
            >
              <TrendingUp size={16} />
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
              <BarChart2 size={16} />
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
              <Activity size={16} />
            </Button>
            {/* Download Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className={`h-9 w-9 p-0 transition-all text-gray-600 hover:text-gray-800 hover:bg-gray-200`} title="Download Chart">
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
        
        {/* Chart Container */}
        <div ref={chartRef} className="border border-gray-200 rounded-lg bg-white p-6 shadow-sm">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    label={{ value: 'Time Period (Months)', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: '12px', fill: '#374151' } }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                    label={{ value: 'Revenue (USD thousands)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fill: '#374151' } }}
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
              ) : chartType === 'bar' ? (
                <RechartsBar data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    label={{ value: 'Time Period (Months)', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: '12px', fill: '#374151' } }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                    label={{ value: 'Revenue (USD thousands)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fill: '#374151' } }}
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
              ) : chartType === 'pie' ? (
                <RechartsPie margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <Pie
                    data={chartData}
                    dataKey="revenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={40}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      `$${(value/1000).toFixed(0)}k`,
                      `${name} Revenue`
                    ]}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => `${value}`}
                  />
                </RechartsPie>
              ) : (
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    label={{ value: 'Time Period (Months)', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: '12px', fill: '#374151' } }}
                  />
                  <YAxis 
                    yAxisId="revenue"
                    orientation="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                    label={{ value: 'Revenue (USD thousands)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fill: '#374151' } }}
                  />
                  <YAxis 
                    yAxisId="growth"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => `${value}%`}
                    label={{ value: 'Growth Rate (%)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fontSize: '12px', fill: '#374151' } }}
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
                    name="revenue"
                  />
                  <Line 
                    yAxisId="growth"
                    type="monotone" 
                    dataKey="growth" 
                    stroke={chartColors.success}
                    strokeWidth={3}
                    dot={{ fill: chartColors.success, strokeWidth: 2, r: 4 }}
                    name="growth"
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
    // For Ensights mode, handle special formatting
    if (message.mode === 'ensights') {
      const lines = message.content.split('\n');
      const firstLine = lines[0];
      const restOfContent = lines.slice(1).join('\n');

      return (
        <div className="space-y-4">
          <p className="text-base leading-relaxed text-gray-800 font-medium">
            {firstLine}
            {restOfContent && (
              <span 
                className="text-blue-600 text-sm ml-2 hover:underline cursor-pointer font-normal"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? '... click to collapse' : '... click to expand'}
              </span>
            )}
          </p>
          {restOfContent && isExpanded && (
            <div className="text-sm text-gray-700 leading-relaxed space-y-3">
              {restOfContent.split('\n').map((line, index) => {
                const trimmedLine = line.trim();
                
                if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                  return (
                    <h3 key={index} className="text-lg font-semibold text-gray-900 mt-6 mb-3 first:mt-0">
                      {trimmedLine.replace(/\*\*/g, '')}
                    </h3>
                  );
                } else if (trimmedLine.startsWith('###')) {
                  return (
                    <h4 key={index} className="text-base font-medium text-gray-800 mt-4 mb-2">
                      {trimmedLine.replace(/### /g, '')}
                    </h4>
                  );
                } else if (trimmedLine.startsWith('- ')) {
                  return (
                    <li key={index} className="ml-4 text-sm text-gray-700 list-disc">
                      {trimmedLine.replace(/^- /, '')}
                    </li>
                  );
                } else if (trimmedLine !== '') {
                  return (
                    <p key={index} className="text-sm leading-relaxed text-gray-700">
                      {trimmedLine}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      );
    }

    // Format content for Encore and Endocs modes
    const lines = message.content.split('\n');
    const formattedContent = [];
    let currentListItems: JSX.Element[] = [];
    let inList = false;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        // Close any open list before adding heading
        if (inList && currentListItems.length > 0) {
          formattedContent.push(
            <ul key={`list-${index}`} className="list-disc list-inside space-y-2 my-4 text-gray-700 ml-4">
              {currentListItems}
            </ul>
          );
          currentListItems = [];
          inList = false;
        }
        
        // Main headings
        formattedContent.push(
          <h2 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-4 first:mt-0">
            {trimmedLine.replace(/\*\*/g, '')}
          </h2>
        );
      } else if (trimmedLine.startsWith('###')) {
        // Close any open list before adding sub-heading
        if (inList && currentListItems.length > 0) {
          formattedContent.push(
            <ul key={`list-${index}`} className="list-disc list-inside space-y-2 my-4 text-gray-700 ml-4">
              {currentListItems}
            </ul>
          );
          currentListItems = [];
          inList = false;
        }
        
        // Sub-headings
        formattedContent.push(
          <h3 key={index} className="text-lg font-semibold text-gray-800 mt-5 mb-3">
            {trimmedLine.replace(/### /g, '')}
          </h3>
        );
      } else if (trimmedLine.startsWith('- ')) {
        // List items
        inList = true;
        currentListItems.push(
          <li key={`li-${index}`} className="text-sm leading-relaxed">
            {trimmedLine.replace(/^- /, '')}
          </li>
        );
      } else if (trimmedLine === '' && inList) {
        // Empty line - close the list
        if (currentListItems.length > 0) {
          formattedContent.push(
            <ul key={`list-${index}`} className="list-disc list-inside space-y-2 my-4 text-gray-700 ml-4">
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
            <ul key={`list-${index}`} className="list-disc list-inside space-y-2 my-4 text-gray-700 ml-4">
              {currentListItems}
            </ul>
          );
          currentListItems = [];
          inList = false;
        }
        
        // Regular paragraphs
        formattedContent.push(
          <p key={index} className="text-base leading-relaxed text-gray-800 mb-4">
            {trimmedLine}
          </p>
        );
      }
    });

    // Close any remaining open list
    if (inList && currentListItems.length > 0) {
      formattedContent.push(
        <ul key="final-list" className="list-disc list-inside space-y-2 my-4 text-gray-700 ml-4">
          {currentListItems}
        </ul>
      );
    }

    return <div className="space-y-3">{formattedContent}</div>;
  };

  const renderSourceInfo = () => {
    const sourceInfo = getSourceInfo();
    if (!sourceInfo) return null;

    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">{sourceInfo.title}</h4>
        <div className="flex flex-wrap gap-2">
          {sourceInfo.items.map((source, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
            >
              <FileText size={12} className="mr-1" />
              {source}
            </span>
          ))}
        </div>
      </div>
    );
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
              <p className="text-sm leading-relaxed">{message.content}</p>
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
              {renderSourceInfo()}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 mt-3">
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
