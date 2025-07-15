
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
import { Card } from '@/components/ui/card';
import { BarChart3, Table, FileText, Database, Brain, Globe, FileSpreadsheet } from 'lucide-react';

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
  { value: 'table', label: 'Table', icon: Table, description: 'Structured data in rows and columns' },
  { value: 'graph', label: 'Graph', icon: BarChart3, description: 'Visual charts and graphs' },
  { value: 'text', label: 'Text', icon: FileText, description: 'Natural language response' },
] as const;

const dataSourceOptions = [
  { value: 'sql', label: 'SQL Database', icon: Database, description: 'Structured database queries' },
  { value: 'vector', label: 'Vector DB', icon: Brain, description: 'AI-powered semantic search' },
  { value: 'documents', label: 'Documents', icon: FileText, description: 'PDF and document analysis' },
  { value: 'spreadsheets', label: 'Spreadsheets', icon: FileSpreadsheet, description: 'Excel and CSV data' },
] as const;

const ResponsePreferences = ({ preferences, onPreferencesChange, className = '' }: ResponsePreferencesProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedFormat = formatOptions.find(opt => opt.value === preferences.format);
  const selectedDataSource = dataSourceOptions.find(opt => opt.value === preferences.dataSource);

  return (
    <Card className={`p-4 border border-gray-200 bg-gray-50/50 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Response Preferences</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? 'Collapse' : 'Customize'}
        </Button>
      </div>

      {/* Current Selection Summary */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Badge variant="secondary" className="flex items-center gap-1">
          {selectedFormat?.icon && <selectedFormat.icon size={12} />}
          {selectedFormat?.label}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          {selectedDataSource?.icon && <selectedDataSource.icon size={12} />}
          {selectedDataSource?.label}
        </Badge>
      </div>

      {isExpanded && (
        <div className="space-y-4 animate-fade-in">
          {/* Response Format Selection */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">Response Format</label>
            <div className="grid grid-cols-3 gap-2">
              {formatOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onPreferencesChange({ ...preferences, format: option.value })}
                  className={`p-3 rounded-lg border text-left transition-all hover:bg-white ${
                    preferences.format === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <option.icon size={16} />
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Data Source Selection */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">Data Source</label>
            <Select
              value={preferences.dataSource}
              onValueChange={(value: ResponsePreferences['dataSource']) =>
                onPreferencesChange({ ...preferences, dataSource: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dataSourceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon size={16} />
                      <div>
                        <div className="text-sm font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ResponsePreferences;
