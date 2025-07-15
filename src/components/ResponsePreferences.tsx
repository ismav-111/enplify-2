
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { BarChart3, Table, FileText, Database, Brain, FileSpreadsheet, Filter, Check } from 'lucide-react';

export interface ResponsePreferences {
  format: 'table' | 'graph' | 'text';
  dataSource: 'sql' | 'vector' | 'snowflake';
}

interface ResponsePreferencesProps {
  preferences: ResponsePreferences;
  onPreferencesChange: (preferences: ResponsePreferences) => void;
  className?: string;
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

const ResponsePreferences = ({ preferences, onPreferencesChange, className = '' }: ResponsePreferencesProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filter format options based on data source
  const getAvailableFormats = () => {
    switch (preferences.dataSource) {
      case 'vector':
        return allFormatOptions.filter(opt => opt.value === 'text');
      case 'sql':
      case 'snowflake':
      default:
        return allFormatOptions;
    }
  };

  const availableFormats = getAvailableFormats();
  const selectedFormat = allFormatOptions.find(opt => opt.value === preferences.format);
  const selectedDataSource = dataSourceOptions.find(opt => opt.value === preferences.dataSource);

  // Auto-adjust format when data source changes
  const handleDataSourceChange = (newDataSource: ResponsePreferences['dataSource']) => {
    let newFormat = preferences.format;
    
    if (newDataSource === 'vector' && preferences.format !== 'text') {
      newFormat = 'text';
    }
    
    onPreferencesChange({ dataSource: newDataSource, format: newFormat });
  };

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-10 w-10 rounded-full bg-white shadow-sm hover:shadow hover:bg-blue-50 transition-colors"
          >
            <Filter size={18} className="text-[#4E50A8] hover:text-blue-700 transition-colors" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-64 p-3" align="end">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Output Format</h4>
            
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Data Source</label>
              <div className="grid grid-cols-2 gap-1">
                {dataSourceOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleDataSourceChange(option.value)}
                    className={`flex items-center gap-2 p-2 rounded-md text-xs transition-colors ${
                      preferences.dataSource === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                    }`}
                  >
                    <option.icon className="h-3 w-3" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Format</label>
              <div className={`grid gap-1 ${availableFormats.length === 3 ? 'grid-cols-3' : availableFormats.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {availableFormats.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onPreferencesChange({ ...preferences, format: option.value })}
                    className={`flex flex-col items-center gap-1 p-2 rounded-md text-xs transition-colors ${
                      preferences.format === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                    }`}
                  >
                    <option.icon className="h-3 w-3" />
                    {option.label}
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
