
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { BarChart3, Table, FileText, Database, Brain, FileSpreadsheet, Settings2, Check } from 'lucide-react';

export interface ResponsePreferences {
  format: 'table' | 'graph' | 'text';
  dataSource: 'sql' | 'vector' | 'snowflake';
}

interface ResponsePreferencesProps {
  preferences: ResponsePreferences;
  onPreferencesChange: (preferences: ResponsePreferences) => void;
  className?: string;
  mode?: 'encore' | 'endocs' | 'ensights';
}

const allFormatOptions = [
  { value: 'table', label: 'Table', icon: Table },
  { value: 'graph', label: 'Graph', icon: BarChart3 },
  { value: 'text', label: 'Text', icon: FileText },
] as const;

const dataSourceOptions = [
  { value: 'sql', label: 'SQL', icon: Database },
  { value: 'vector', label: 'Vector DB', icon: Brain },
  { value: 'snowflake', label: 'Snowflake', icon: FileSpreadsheet },
] as const;

const ResponsePreferences = ({ preferences, onPreferencesChange, className = '', mode = 'encore' }: ResponsePreferencesProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Show all format options for all modes
  const availableFormats = allFormatOptions;
  const selectedFormat = allFormatOptions.find(opt => opt.value === preferences.format);
  const selectedDataSource = dataSourceOptions.find(opt => opt.value === preferences.dataSource);

  // Handle data source changes without format restrictions
  const handleDataSourceChange = (newDataSource: ResponsePreferences['dataSource']) => {
    onPreferencesChange({ ...preferences, dataSource: newDataSource });
  };

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-10 w-10 rounded-full bg-white shadow-sm hover:shadow-md border border-gray-100 hover:border-gray-200 transition-all duration-200"
          >
            <Settings2 size={16} className="text-gray-600" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-72 p-0 shadow-lg border border-gray-100" align="end">
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-800 mb-4">Output Format</h4>
            
            {/* Data Source selection - only for encore mode */}
            {mode === 'encore' && (
              <div className="mb-4">
                <label className="text-xs text-gray-500 mb-2 block">Data Source</label>
                <div className="space-y-1">
                  {dataSourceOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleDataSourceChange(option.value)}
                      className={`w-full flex items-center gap-2 p-2 rounded-md text-sm transition-colors ${
                        preferences.dataSource === option.value
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <option.icon className="h-4 w-4" />
                      <span className="flex-1 text-left">{option.label}</span>
                      {preferences.dataSource === option.value && (
                        <Check className="h-3 w-3" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-gray-500 mb-2 block">Format</label>
              <div className="space-y-1">
                {availableFormats.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onPreferencesChange({ ...preferences, format: option.value })}
                    className={`w-full flex items-center gap-2 p-2 rounded-md text-sm transition-colors ${
                      preferences.format === option.value
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <option.icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{option.label}</span>
                    {preferences.format === option.value && (
                      <Check className="h-3 w-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ResponsePreferences;
