
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BarChart3, Table, FileText, Database, Brain, FileSpreadsheet, Settings, Sparkles } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);

  const selectedFormat = formatOptions.find(opt => opt.value === preferences.format);
  const selectedDataSource = dataSourceOptions.find(opt => opt.value === preferences.dataSource);

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 btn-primary group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse rounded-full"></div>
            <Sparkles className="h-6 w-6 text-white relative z-10 group-hover:rotate-12 transition-transform duration-300" />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5 text-primary" />
              Response Preferences
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Current Selection Summary */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg">
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

            {/* Response Format Selection */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">Response Format</label>
              <div className="grid grid-cols-1 gap-2">
                {formatOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onPreferencesChange({ ...preferences, format: option.value })}
                    className={`p-3 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-sm ${
                      preferences.format === option.value
                        ? `${option.color} border-current shadow-sm`
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        preferences.format === option.value 
                          ? 'bg-white/80' 
                          : 'bg-gray-100'
                      }`}>
                        <option.icon size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{option.label}</div>
                        <div className="text-xs opacity-80">{option.description}</div>
                      </div>
                    </div>
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
                <SelectTrigger className="w-full h-12 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-200 shadow-lg">
                  {dataSourceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="p-3 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${option.color}`}>
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResponsePreferences;
