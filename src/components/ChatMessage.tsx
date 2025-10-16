
import { useState, useRef, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Copy, RotateCcw, BarChart2, TrendingUp, PieChart, Download, FileText, Image, Activity, Edit2, Maximize, Minimize, ChevronLeft, ChevronRight, Table, Database, Globe, Server, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table as TableComponent,
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip as TooltipComponent,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    sqlQuery?: string;
    file?: {
      name: string;
      type: string;
      size: number;
    };
  };
  onShowSources?: (sources: any) => void;
}

const ChatMessage = ({ message, onShowSources }: ChatMessageProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'composed'>('line');
  
  // Set default view mode based on message mode
  const getDefaultViewMode = () => {
    if (message.mode === 'endocs') return 'table';
    if (message.mode === 'ensights') return 'chart';
    return 'text';
  };
  
  const [viewMode, setViewMode] = useState<'text' | 'table' | 'chart'>(getDefaultViewMode());
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMethodologyExpanded, setIsMethodologyExpanded] = useState(false);
  const [isTableMaximized, setIsTableMaximized] = useState(false);
  const [isChartMaximized, setIsChartMaximized] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const chartRef = useRef<HTMLDivElement>(null);

  // Update view mode when message mode changes
  useEffect(() => {
    setViewMode(getDefaultViewMode());
  }, [message.mode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit message:', message.id);
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
          totalSources: 3,
          items: [
            { 
              name: 'ourworldindata.org', 
              type: 'website',
              domain: 'ourworldindata.org',
              color: '#3b82f6',
              icon: Globe,
              title: 'Population Growth',
              author: 'H Ritchie', 
              date: 'July 11, 2023',
              year: '2023',
              citedBy: '193',
              description: 'On this page, you will find all of our data, charts, and comprehensive policy documentation.',
              dataSource: 'Data extracted from webpage content'
            },
            { 
              name: 'sales_presentation.pptx', 
              type: 'document',
              domain: 'Sales Presentation',
              color: '#d97706',
              icon: FileText,
              title: 'Q3 Sales Performance Review',
              author: 'Sales Team',
              date: 'September 15, 2024', 
              citedBy: '45',
              description: 'Quarterly sales analysis and performance metrics presentation for stakeholder review.',
              dataSource: 'Data extracted from Slide 2, 7, and 12'
            },
            { 
              name: 'company_policies.pdf', 
              type: 'document',
              domain: 'Company Document',
              color: '#dc2626',
              icon: FileText,
              title: 'Employee Handbook 2024',
              author: 'HR Department',
              date: 'January 10, 2024',
              citedBy: '89',
              description: 'Comprehensive employee policies and procedures documentation.',
              dataSource: 'Data extracted from Page 15-18'
            }
          ],
          icon: FileText
        };
      case 'ensights':
        return {
          title: 'Data Sources',
          totalSources: 3,
          items: [
            { 
              name: 'financial_dashboard.xlsx', 
              type: 'document',
              domain: 'Excel Spreadsheet',
              color: '#059669',
              icon: Table,
              title: 'Q3 Financial Dashboard',
              author: 'Finance Team',
              date: 'September 20, 2024',
              citedBy: '145',
              description: 'Comprehensive financial metrics and KPI dashboard for quarterly analysis.',
              dataSource: 'Data extracted from Sheet 1-3 (Revenue, Costs, Projections)'
            },
            { 
              name: 'sales_analytics.pptx', 
              type: 'document',
              domain: 'PowerPoint Presentation',
              color: '#d97706',
              icon: FileText,
              title: 'Sales Analytics Presentation',
              author: 'Analytics Team',
              date: 'August 15, 2024',
              citedBy: '278',
              description: 'Data visualization and insights from sales performance analysis.',
              dataSource: 'Data extracted from Slide 4, 8, and 15'
            },
            { 
              name: 'market-research.com', 
              type: 'website',
              domain: 'market-research.com',
              color: '#7c3aed',
              icon: Globe,
              title: 'Market Research Report 2024',
              author: 'Market Research Institute',
              date: 'July 30, 2024',
              citedBy: '523',
              description: 'Industry analysis and market trends for strategic business planning.',
              dataSource: 'Data extracted from Research Section 2.3'
            }
          ],
          icon: BarChart2
        };
      case 'encore':
        return {
          title: 'Knowledge Sources',
          totalSources: 3,
          items: [
            { 
              name: 'openai.com', 
              type: 'website',
              domain: 'openai.com',
              color: '#10b981',
              icon: Globe,
              title: 'GPT-4 Technical Report',
              author: 'OpenAI Research Team',
              date: 'June 5, 2024',
              citedBy: '324',
              description: 'Technical documentation covering GPT-4 architecture and capabilities.',
              dataSource: 'Data extracted from Technical Overview section'
            },
            { 
              name: 'ai_research_presentation.pptx', 
              type: 'document',
              domain: 'Research Presentation',
              color: '#d97706',
              icon: FileText,
              title: 'AI Safety and Alignment Research',
              author: 'AI Research Lab',
              date: 'August 12, 2024',
              citedBy: '156',
              description: 'Latest findings in AI safety research and alignment methodologies.',
              dataSource: 'Data extracted from Slide 6, 11, and 20'
            },
            { 
              name: 'transformer_architecture.pdf', 
              type: 'document',
              domain: 'Research Paper',
              color: '#dc2626',
              icon: FileText,
              title: 'Attention Is All You Need',
              author: 'Vaswani et al.',
              date: 'December 6, 2017',
              citedBy: '45,892',
              description: 'The foundational paper introducing the Transformer architecture.',
              dataSource: 'Data extracted from Page 3-5 (Architecture Overview)'
            }
          ],
          icon: FileText
        };
      default:
        return null;
    }
  };

  // Generate sample data with consistent 25 rows for endocs
  const generateSampleData = () => {
    const departments = ['HR', 'Finance', 'IT', 'Legal', 'Operations', 'Marketing', 'Sales', 'Research', 'Support', 'Quality'];
    const documentTypes = ['Policy', 'Handbook', 'Report', 'Manual', 'Guide', 'Procedure', 'Contract', 'Analysis', 'Specification', 'Review'];
    const contentTemplates = [
      'This document contains comprehensive information about {type} guidelines, procedures, and important details that all team members need to understand and follow.',
      'Essential {type} documentation covering key requirements, implementation strategies, and compliance standards for the {dept} department.',
      'Detailed {type} reference material including best practices, troubleshooting guides, and step-by-step procedures for operational excellence.',
      'Critical {type} documentation outlining policies, standards, and protocols essential for maintaining organizational efficiency and compliance.',
      'Comprehensive {type} resource containing detailed information, guidelines, and procedural documentation for effective {dept} operations.',
      'Strategic {type} framework document outlining operational methodologies, quality assurance protocols, and performance metrics for {dept} excellence.',
      'Technical {type} specification containing detailed implementation guidelines, system requirements, and configuration parameters for optimal performance.',
      'Regulatory {type} compliance document ensuring adherence to industry standards, legal requirements, and organizational governance policies.',
      'Operational {type} manual providing step-by-step instructions, troubleshooting procedures, and maintenance protocols for daily operations.',
      'Administrative {type} resource covering workflow processes, approval procedures, and documentation standards for efficient {dept} management.'
    ];
    
    return Array.from({ length: 25 }, (_, i) => {
      const dept = departments[i % departments.length];
      const docType = documentTypes[i % documentTypes.length];
      const template = contentTemplates[i % contentTemplates.length];
      
      return {
        title: `${docType}_Document_${String(i + 1).padStart(3, '0')}.pdf`,
        content: template.replace(/{type}/g, docType.toLowerCase()).replace(/{dept}/g, dept),
        relevance: `${Math.floor(Math.random() * 15) + 85}%`,
        lastUpdated: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        department: dept
      };
    });
  };

  // Convert table data to chart data for endocs
  const convertTableToChartData = () => {
    const tableData = generateSampleData();
    const departmentCounts = tableData.reduce((acc, item) => {
      acc[item.department] = (acc[item.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(departmentCounts).map(([name, value]) => ({
      name,
      value
    }));
  };

  // Pagination logic for table
  const getPaginatedData = () => {
    const data = message.mode === 'endocs' ? generateSampleData() : (message.tableData || []);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalItems = () => {
    return message.mode === 'endocs' ? 25 : (message.tableData?.length || 0);
  };

  const totalItems = getTotalItems();
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Context bar for both endocs and ensights
  const renderContextBar = () => {
    if (message.mode !== 'endocs' && message.mode !== 'ensights') return null;

    return (
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            {message.mode === 'endocs' ? 'Document Analysis' : 'Business Intelligence Analysis'}
          </h2>
          <p className="text-base text-gray-600 mt-1">
            {message.mode === 'endocs' 
              ? `Interactive document visualization with ${totalItems} documents` 
              : `Interactive performance visualization with ${message.chartData?.length || 0} data points`
            }
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {/* SQL Query Info Button - only for endocs mode with tableData */}
          {message.mode === 'endocs' && message.sqlQuery && viewMode === 'table' && (
            <TooltipProvider>
              <TooltipComponent>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2"
                  >
                    <Database size={16} />
                    <span className="text-sm">View Query</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end" className="max-w-2xl p-4">
                  <div className="space-y-2">
                    <p className="font-semibold text-sm">SQL Query Used:</p>
                    <pre className="text-xs bg-muted p-3 rounded overflow-x-auto whitespace-pre-wrap">
{message.sqlQuery}
                    </pre>
                  </div>
                </TooltipContent>
              </TooltipComponent>
            </TooltipProvider>
          )}
          <div className="flex gap-1 items-center bg-gray-100 rounded-lg p-1">
          {/* View Mode Selector */}
          <Button 
            variant="ghost"
            size="sm"
            className={`h-9 w-9 p-0 transition-all ${
              viewMode === 'text' 
                ? "bg-[#595fb7] text-white shadow-sm hover:bg-[#4e50a8]" 
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setViewMode('text')}
            title="Text View"
          >
            <FileText size={16} />
          </Button>
          <Button 
            variant="ghost"
            size="sm"
            className={`h-9 w-9 p-0 transition-all ${
              viewMode === 'table' 
                ? "bg-[#595fb7] text-white shadow-sm hover:bg-[#4e50a8]" 
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setViewMode('table')}
            title="Table View"
          >
            <Table size={16} />
          </Button>
          <Button 
            variant="ghost"
            size="sm"
            className={`h-9 w-9 p-0 transition-all ${
              viewMode === 'chart' 
                ? "bg-[#595fb7] text-white shadow-sm hover:bg-[#4e50a8]" 
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setViewMode('chart')}
            title="Chart View"
          >
            <BarChart2 size={16} />
          </Button>
          
          {/* Chart Type Selector - only show when in chart mode */}
          {viewMode === 'chart' && (
            <>
              <div className="w-px h-6 bg-gray-300 mx-1" />
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
            </>
          )}
          
          {/* Maximize and Download buttons */}
          {viewMode === 'table' && !isTableMaximized && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsTableMaximized(true)}
              className="h-9 w-9 p-0 transition-all text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              title="Maximize table"
            >
              <Maximize size={16} />
            </Button>
          )}
          {viewMode === 'chart' && !isChartMaximized && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 p-0 transition-all text-gray-600 hover:text-gray-800 hover:bg-gray-200" 
              onClick={() => setIsChartMaximized(true)}
              title="Maximize Chart"
            >
              <Maximize size={16} />
            </Button>
          )}
          
          {/* Download Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 transition-all text-gray-600 hover:text-gray-800 hover:bg-gray-200" title="Download">
                <Download size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {viewMode === 'table' && (
                <DropdownMenuItem onClick={handleDownloadExcel} className="cursor-pointer">
                  <FileText size={16} className="mr-2" />
                  Download Excel
                </DropdownMenuItem>
              )}
              {viewMode === 'chart' && (
                <>
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
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>
      </div>
    );
  };

  const renderTableData = () => {
    if (message.mode !== 'endocs') return null;
    
    const paginatedData = getPaginatedData();
    
    const tableContent = (
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <TableComponent>
            <TableHeader>
              <TableRow className="bg-gray-50/80">
                <TableHead className="font-semibold text-gray-900 py-3 px-4 text-base">
                  Document
                </TableHead>
                <TableHead className="font-semibold text-gray-900 py-3 px-4 text-base">
                  Content
                </TableHead>
                <TableHead className="font-semibold text-gray-900 py-3 px-4 text-center text-base">
                  Relevance
                </TableHead>
                <TableHead className="font-semibold text-gray-900 py-3 px-4 text-base">
                  Modified
                </TableHead>
                <TableHead className="font-semibold text-gray-900 py-3 px-4 text-base">
                  Department
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row, i) => (
                <TableRow key={i} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-b-0">
                  <TableCell className="py-3 px-4">
                    <div className="font-medium text-gray-900 text-base">{row.title}</div>
                  </TableCell>
                  <TableCell className="py-3 px-4 max-w-md">
                    <div className="text-gray-700 text-base line-clamp-2">{row.content}</div>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center">
                    <span className={`inline-flex px-2 py-1 rounded-md text-sm font-medium ${
                      Number(row.relevance.replace('%', '')) >= 90 
                        ? 'bg-green-100 text-green-800' 
                        : Number(row.relevance.replace('%', '')) >= 80 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {row.relevance}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-600 text-base">
                    {row.lastUpdated}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <span className="inline-flex px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium">
                      {row.department}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableComponent>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-base text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-9"
              >
                <ChevronLeft size={16} />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                      className="h-9 w-9"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-9"
              >
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
    
    return (
      <>
        <div className="mt-6">
          {tableContent}
        </div>

        {/* Maximized Table Dialog */}
        <Dialog open={isTableMaximized} onOpenChange={setIsTableMaximized}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full flex flex-col p-6" hideCloseButton>
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="sr-only">Search Results - Full View</DialogTitle>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Search Results - Full View</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsTableMaximized(false)}
                  className="h-9 w-9"
                  title="Minimize table"
                >
                  <Minimize size={16} />
                </Button>
              </div>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
              {tableContent}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  };

  const getMethodologyText = () => {
    const chartData = message.mode === 'endocs' ? convertTableToChartData() : message.chartData;
    if (!chartData || chartData.length === 0) return null;

    switch(chartType) {
      case 'line':
        return message.mode === 'endocs' 
          ? "This visualization employs document frequency analysis across departments using linear trend modeling. The X-axis represents different departments, while the Y-axis displays document count, providing clear insight into document distribution patterns across organizational units."
          : "This visualization employs a sophisticated linear regression model enhanced with seasonal decomposition algorithms. The X-axis represents time periods (months/quarters) showing chronological progression, while the Y-axis displays revenue values in thousands of dollars, providing clear insight into financial performance trends. The methodology uses the formula: Revenue(t) = Base Revenue + (Growth Rate × Time) + Seasonal Adjustment, where seasonal adjustments are calculated using historical patterns including holiday boosts (25% increase in December), post-holiday corrections (15% decrease in January), and summer slowdowns (8% decrease in July-August).";
      case 'bar':
        return message.mode === 'endocs'
          ? "The bar chart methodology aggregates document counts using discrete categorical analysis. The X-axis shows distinct departments as categorical variables, while the Y-axis represents absolute document counts, enabling direct comparison between departments and identification of documentation density patterns."
          : "The bar chart methodology aggregates monthly revenue using discrete categorical analysis. The X-axis shows distinct time periods (months/quarters) as categorical variables, while the Y-axis represents absolute revenue values in thousands of dollars, enabling direct comparison between periods. This approach uses the formula: Monthly Revenue = Σ(Customer Segments) + Regional Performance + Product Mix, providing a comprehensive view of business performance across different time periods and enabling easy identification of peak performance months and growth anomalies.";
      case 'pie':
        return message.mode === 'endocs'
          ? "The pie chart utilizes proportional analysis to show document distribution across departments. Each segment represents a percentage of total documents, with the entire circle representing 100% of the document library. This visualization helps identify departmental documentation concentration and distribution patterns."
          : "The pie chart utilizes proportional analysis to show revenue distribution across time periods. Each segment represents a percentage of total annual revenue, with the entire circle representing 100% of the dataset. The methodology uses the formula: Percentage = (Individual Month Revenue / Total Annual Revenue) × 100, revealing the distribution and concentration patterns. This visualization helps identify seasonal dependencies, revenue concentration risk, and distribution patterns that inform strategic planning decisions.";
      case 'composed':
        return message.mode === 'endocs'
          ? "This advanced dual-axis visualization combines document counts with relevance metrics for comprehensive analysis. The primary Y-axis (left) shows document counts, while the secondary Y-axis (right) displays average relevance scores. This approach enables correlation analysis between document volume and content quality across departments."
          : "This advanced dual-axis visualization combines absolute values with relative metrics for comprehensive analysis. The primary Y-axis (left) shows revenue values in thousands of dollars, while the secondary Y-axis (right) displays growth rate percentages. The X-axis represents time periods enabling temporal analysis. The methodology leverages cross-correlation analysis using the formula: Combined Analysis = Revenue Trends + Growth Rate Correlation, identifying leading indicators and performance patterns across multiple dimensions.";
      default:
        return "";
    }
  };

  const renderChartData = () => {
    if ((message.mode !== 'ensights' && message.mode !== 'endocs') || viewMode !== 'chart') return null;
    
    const chartColors = {
      primary: '#595fb7',
      secondary: '#4e50a8',
      accent: '#373995',
      success: '#059669',
      warning: '#d97706'
    };

    // Use appropriate data based on mode
    const rawChartData = message.mode === 'endocs' ? convertTableToChartData() : message.chartData;
    if (!rawChartData || rawChartData.length === 0) return null;

    // Transform data for Recharts
    const chartData = rawChartData.map((item, index) => ({
      name: item.name,
      [message.mode === 'endocs' ? 'documents' : 'revenue']: item.value,
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

    const dataKey = message.mode === 'endocs' ? 'documents' : 'revenue';
    const yAxisLabel = message.mode === 'endocs' ? 'Document Count' : 'Revenue (USD thousands)';
    const tooltipFormatter = (value: any) => [
      message.mode === 'endocs' ? `${value} docs` : `$${(value/1000).toFixed(0)}k`,
      message.mode === 'endocs' ? 'Documents' : 'Revenue'
    ];

    const chartContent = (
      <div className="space-y-6">
        {/* Methodology Text */}
        <div className="relative">
          <p 
            className="text-base text-gray-700 leading-relaxed cursor-pointer transition-all duration-300"
            onClick={() => setIsMethodologyExpanded(!isMethodologyExpanded)}
          >
            <span className={isMethodologyExpanded ? '' : 'line-clamp-2'}>
              {getMethodologyText()}
            </span>
            <span className="text-blue-600 text-sm ml-2 hover:underline">
              {isMethodologyExpanded ? '... click to collapse' : '... click to expand'}
            </span>
          </p>
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
                    label={{ value: message.mode === 'endocs' ? 'Departments' : 'Time Period (Months)', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: '12px', fill: '#374151' } }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => message.mode === 'endocs' ? `${value}` : `$${(value/1000).toFixed(0)}k`}
                    label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fill: '#374151' } }}
                  />
                  <Tooltip 
                    formatter={tooltipFormatter}
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
                    dataKey={dataKey} 
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
                    label={{ value: message.mode === 'endocs' ? 'Departments' : 'Time Period (Months)', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: '12px', fill: '#374151' } }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => message.mode === 'endocs' ? `${value}` : `$${(value/1000).toFixed(0)}k`}
                    label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fill: '#374151' } }}
                  />
                  <Tooltip 
                    formatter={tooltipFormatter}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey={dataKey} 
                    fill={chartColors.primary}
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBar>
              ) : chartType === 'pie' ? (
                <RechartsPie margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <Pie
                    data={chartData}
                    dataKey={dataKey}
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
                      message.mode === 'endocs' ? `${value} docs` : `$${(value/1000).toFixed(0)}k`,
                      `${name} ${message.mode === 'endocs' ? 'Documents' : 'Revenue'}`
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
                    label={{ value: message.mode === 'endocs' ? 'Departments' : 'Time Period (Months)', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: '12px', fill: '#374151' } }}
                  />
                  <YAxis 
                    yAxisId="primary"
                    orientation="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => message.mode === 'endocs' ? `${value}` : `$${(value/1000).toFixed(0)}k`}
                    label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fill: '#374151' } }}
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
                      name === dataKey ? (message.mode === 'endocs' ? `${value} docs` : `$${(value/1000).toFixed(0)}k`) : `${value}%`,
                      name === dataKey ? (message.mode === 'endocs' ? 'Documents' : 'Revenue') : 'Growth Rate'
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
                    yAxisId="primary"
                    dataKey={dataKey} 
                    fill={chartColors.primary}
                    radius={[4, 4, 0, 0]}
                    name={dataKey}
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
    
    return (
      <>
        <div className="mt-8">
          {chartContent}
        </div>

        {/* Maximized Chart Dialog - No close button, only minimize */}
        <Dialog open={isChartMaximized} onOpenChange={setIsChartMaximized}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full flex flex-col p-6" hideCloseButton>
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="sr-only">{message.mode === 'endocs' ? 'Document Analysis' : 'Business Intelligence Analysis'} - Full View</DialogTitle>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">{message.mode === 'endocs' ? 'Document Analysis' : 'Business Intelligence Analysis'} - Full View</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsChartMaximized(false)}
                  className="h-9 w-9"
                  title="Minimize chart"
                >
                  <Minimize size={16} />
                </Button>
              </div>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
              {chartContent}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  };

  const renderFileInfo = () => {
    if (!message.file) return null;
    
    return (
      <div className="text-sm text-gray-500 mt-1">
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
          <p className="text-base leading-relaxed text-gray-900 font-medium">
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
            <div className="text-base text-gray-800 leading-relaxed space-y-4">
              {restOfContent.split('\n').map((line, index) => {
                const trimmedLine = line.trim();
                
                if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                  return (
                    <h3 key={index} className="text-base font-bold text-gray-900 mt-6 mb-3 first:mt-0">
                      {trimmedLine.replace(/\*\*/g, '')}
                    </h3>
                  );
                } else if (trimmedLine.startsWith('###')) {
                  return (
                    <h4 key={index} className="text-base font-bold text-gray-900 mt-4 mb-2">
                      {trimmedLine.replace(/### /g, '')}
                    </h4>
                  );
                } else if (trimmedLine.startsWith('- ')) {
                  return (
                    <li key={index} className="ml-6 text-base text-gray-800 list-disc leading-relaxed">
                      {trimmedLine.replace(/^- /, '')}
                    </li>
                  );
                } else if (trimmedLine !== '') {
                  return (
                    <p key={index} className="text-base leading-relaxed text-gray-800">
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
            <ul key={`list-${index}`} className="list-disc list-inside space-y-2 my-4 text-gray-800 ml-6">
              {currentListItems}
            </ul>
          );
          currentListItems = [];
          inList = false;
        }
        
        // Main headings - consistent 16px bold
        formattedContent.push(
          <h2 key={index} className="text-base font-bold text-gray-900 mt-6 mb-3 first:mt-0">
            {trimmedLine.replace(/\*\*/g, '')}
          </h2>
        );
      } else if (trimmedLine.startsWith('###')) {
        // Close any open list before adding sub-heading
        if (inList && currentListItems.length > 0) {
          formattedContent.push(
            <ul key={`list-${index}`} className="list-disc list-inside space-y-2 my-4 text-gray-800 ml-6">
              {currentListItems}
            </ul>
          );
          currentListItems = [];
          inList = false;
        }
        
        // Sub-headings - consistent 16px bold
        formattedContent.push(
          <h3 key={index} className="text-base font-bold text-gray-900 mt-4 mb-2">
            {trimmedLine.replace(/### /g, '')}
          </h3>
        );
      } else if (trimmedLine.startsWith('- ')) {
        // List items
        inList = true;
        currentListItems.push(
          <li key={`li-${index}`} className="text-base leading-relaxed">
            {trimmedLine.replace(/^- /, '')}
          </li>
        );
      } else if (trimmedLine === '' && inList) {
        // Empty line - close the list
        if (currentListItems.length > 0) {
          formattedContent.push(
            <ul key={`list-${index}`} className="list-disc list-inside space-y-2 my-4 text-gray-800 ml-6">
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
            <ul key={`list-${index}`} className="list-disc list-inside space-y-2 my-4 text-gray-800 ml-6">
              {currentListItems}
            </ul>
          );
          currentListItems = [];
          inList = false;
        }
        
        // Regular paragraphs - consistent 16px
        formattedContent.push(
          <p key={index} className="text-base leading-relaxed text-gray-800 mb-3">
            {trimmedLine}
          </p>
        );
      }
    });

    // Close any remaining open list
    if (inList && currentListItems.length > 0) {
      formattedContent.push(
        <ul key="final-list" className="list-disc list-inside space-y-2 my-4 text-gray-800 ml-6">
          {currentListItems}
        </ul>
      );
    }

    return <div className="space-y-3">{formattedContent}</div>;
  };


  // Sources button to replace source cards
  const renderSourcesButton = () => {
    if (message.mode !== 'endocs' && message.mode !== 'ensights' && message.mode !== 'encore') return null;
    
    const sourceInfo = getSourceInfo();
    if (!sourceInfo || !sourceInfo.items.length) return null;

    return (
      <div className="mt-6 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onShowSources?.(sourceInfo)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-sm text-gray-700 font-medium"
        >
          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">UW</span>
          </div>
          <span>Sources</span>
        </Button>
      </div>
    );
  };

  return (
    <div className="flex mb-4">
      {!message.isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 mt-1 border border-gray-200">
          <span className="text-gray-700 font-bold text-sm font-comfortaa">e</span>
        </div>
      )}
      
      <div className={`flex flex-col ${message.isUser ? 'items-end ml-auto' : 'ml-3'} max-w-[85%]`}>
        <div className="w-full">
          {message.isUser ? (
            <>
              <div className="rounded-2xl py-3 px-4 text-gray-800 max-w-lg" style={{ backgroundColor: '#F1F1F9' }}>
                <p className="text-base leading-relaxed">{message.content}</p>
                {renderFileInfo()}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="p-1.5 h-auto text-gray-400 hover:text-gray-600 rounded transition-colors"
                  title="Edit message"
                >
                  <Edit2 size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="p-1.5 h-auto text-gray-400 hover:text-gray-600 rounded transition-colors"
                  title="Copy message"
                >
                  <Copy size={14} />
                </Button>
                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="text-gray-800 w-full">
                {/* Render context bar for endocs and ensights */}
                {(message.mode === 'endocs' || message.mode === 'ensights') && renderContextBar()}
                
                {/* Show text content only when in text mode or for encore mode */}
                {(viewMode === 'text' || message.mode === 'encore' || (message.mode !== 'endocs' && message.mode !== 'ensights')) && (
                  <div className="mb-6">
                    {renderFormattedContent()}
                  </div>
                )}
                
                {/* Show table when in table mode for endocs */}
                {message.mode === 'endocs' && viewMode === 'table' && renderTableData()}
                
                {/* Show chart when in chart mode for ensights or endocs */}
                {((message.mode === 'ensights' && (viewMode === 'chart' || message.chartData)) || (message.mode === 'endocs' && viewMode === 'chart')) && renderChartData()}
                
                {/* Legacy rendering for ensights without context bar */}
                {message.mode === 'ensights' && !renderContextBar() && message.chartData && renderChartData()}
                
                {/* Show sources button at bottom */}
                {renderSourcesButton()}
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
    </div>
  );
};

export default ChatMessage;
