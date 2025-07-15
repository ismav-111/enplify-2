
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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { BarChart3, Table, FileText, Database, Brain, FileSpreadsheet, Settings2, ChevronDown } from 'lucide-react';

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
  { value: 'table', label: 'Table', icon: Table, description: 'Structured data view', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'graph', label: 'Graph', icon: BarChart3, description: 'Visual charts', color: 'bg-green-50 text-green-700 border-green-200' },
  { value: 'text', label: 'Text', icon: FileText, description: 'Natural language', color: 'bg-purple-50 text-purple-700 border-purple-200' },
] as const;

const dataSourceOptions = [
  { value: 'sql', label: 'SQL Database', icon: Database, description: 'Structured queries' },
  { value: 'vector', label: 'Vector DB', icon: Brain, description: 'AI semantic search' },
  { value: 'documents', label: 'Documents', icon: FileText, description: 'PDF analysis' },
  { value: 'spreadsheets', label: 'Spreadsheets', icon: FileSpreadsheet, description: 'Excel/CSV data' },
] as const;

const ResponsePreferences = ({ preferences, onPreferencesChange, className = '' }: ResponsePreferencesProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedFormat = formatOptions.find(opt => opt.value === preferences.format);
  const selectedDataSource = dataSourceOptions.find(opt => opt.value === preferences.dataSource);

  return (
    <div className={`w-full bg-white border-b border-gray-100 ${className}`}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Settings2 className="h-4 w-4" />
              <span className="font-medium">Response Preferences:</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={`flex items-center gap-1.5 px-2.5 py-1 ${selectedFormat?.color} border text-xs font-medium`}
              >
                {selectedFormat?.icon && <selectedFormat.icon size={12} />}
                {selectedFormat?.label}
              </Badge>
              
              <span className="text-gray-400">•</span>
              
              <Badge 
                variant="outline" 
                className="flex items-center gap-1.5 px-2.5 py-1 border-gray-200 text-gray-600 text-xs font-medium"
              >
                {selectedDataSource?.icon && <selectedDataSource.icon size={12} />}
                {selectedDataSource?.label}
              </Badge>
            </div>
          </div>

          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Response Format</label>
                  <div className="grid grid-cols-1 gap-2">
                    {formatOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onPreferencesChange({ ...preferences, format: option.value });
                          setIsOpen(false);
                        }}
                        className={`p-2.5 rounded-md border text-left transition-all duration-200 hover:shadow-sm ${
                          preferences.format === option.value
                            ? `${option.color} border-current`
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`p-1.5 rounded ${
                            preferences.format === option.value 
                              ? 'bg-white/80' 
                              : 'bg-gray-100'
                          }`}>
                            <option.icon size={14} />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{option.label}</div>
                            <div className="text-xs opacity-75">{option.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Data Source</label>
                  <Select
                    value={preferences.dataSource}
                    onValueChange={(value: ResponsePreferences['dataSource']) => {
                      onPreferencesChange({ ...preferences, dataSource: value });
                      setIsOpen(false);
                    }}
                  >
                    <SelectTrigger className="w-full h-10 bg-white border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      {dataSourceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="p-2.5 hover:bg-gray-50">
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded bg-gray-100">
                              <option.icon size={14} />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800">{option.label}</div>
                              <div className="text-xs text-gray-500">{option.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default ResponsePreferences;
