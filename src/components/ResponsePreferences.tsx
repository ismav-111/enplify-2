
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BarChart3, Table, FileText, Database, Brain, FileSpreadsheet, ChevronDown, ChevronUp } from 'lucide-react';

export interface ResponsePreferences {
  format: 'table' | 'graph' | 'text';
  dataSource: 'sql' | 'vector' | 'documents' | 'spreadsheets';
}

interface ResponsePreferencesProps {
  preferences: ResponsePreferences;
  onPreferencesChange: (preferences: ResponsePreferences) => void;
  className?: string;
}

const formatOptions = [
  { value: 'table', label: 'Table', icon: Table, description: 'Structured data in rows and columns', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'graph', label: 'Graph', icon: BarChart3, description: 'Visual charts and graphs', color: 'bg-green-50 text-green-700 border-green-200' },
  { value: 'text', label: 'Text', icon: FileText, description: 'Natural language response', color: 'bg-purple-50 text-purple-700 border-purple-200' },
] as const;

const dataSourceOptions = [
  { value: 'sql', label: 'SQL Database', icon: Database, description: 'Structured database queries', color: 'bg-orange-50 text-orange-700' },
  { value: 'vector', label: 'Vector DB', icon: Brain, description: 'AI-powered semantic search', color: 'bg-indigo-50 text-indigo-700' },
  { value: 'documents', label: 'Documents', icon: FileText, description: 'PDF and document analysis', color: 'bg-red-50 text-red-700' },
  { value: 'spreadsheets', label: 'Spreadsheets', icon: FileSpreadsheet, description: 'Excel and CSV data', color: 'bg-emerald-50 text-emerald-700' },
] as const;

const ResponsePreferences = ({ preferences, onPreferencesChange, className = '' }: ResponsePreferencesProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedFormat = formatOptions.find(opt => opt.value === preferences.format);
  const selectedDataSource = dataSourceOptions.find(opt => opt.value === preferences.dataSource);

  return (
    <Card className={`border-2 border-dashed border-gray-200 bg-gradient-to-r from-gray-50/50 to-blue-50/30 hover:border-blue-300 transition-all duration-200 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h3 className="text-sm font-semibold text-gray-700">Response Preferences</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={14} className="mr-1" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown size={14} className="mr-1" />
                Customize
              </>
            )}
          </Button>
        </div>

        {/* Current Selection Summary */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge 
            variant="secondary" 
            className={`flex items-center gap-1.5 px-3 py-1 ${selectedFormat?.color} border font-medium`}
          >
            {selectedFormat?.icon && <selectedFormat.icon size={14} />}
            {selectedFormat?.label}
          </Badge>
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1.5 px-3 py-1 ${selectedDataSource?.color} border font-medium`}
          >
            {selectedDataSource?.icon && <selectedDataSource.icon size={14} />}
            {selectedDataSource?.label}
          </Badge>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 animate-fade-in">
          <div className="space-y-6">
            {/* Response Format Selection */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">Response Format</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {formatOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onPreferencesChange({ ...preferences, format: option.value })}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md group ${
                      preferences.format === option.value
                        ? `${option.color} border-current shadow-sm scale-105`
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${
                        preferences.format === option.value 
                          ? 'bg-white/80' 
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      } transition-colors`}>
                        <option.icon size={18} />
                      </div>
                      <span className="text-sm font-semibold">{option.label}</span>
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Data Source Selection */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">Data Source</label>
              <Select
                value={preferences.dataSource}
                onValueChange={(value: ResponsePreferences['dataSource']) =>
                  onPreferencesChange({ ...preferences, dataSource: value })
                }
              >
                <SelectTrigger className="w-full h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-200 shadow-lg">
                  {dataSourceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="p-3 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${option.color} transition-colors`}>
                          <option.icon size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">{option.label}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ResponsePreferences;
