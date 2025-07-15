
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { BarChart3, Table, FileText, Database, Brain, FileSpreadsheet, Settings, Check } from 'lucide-react';

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
  { value: 'table', label: 'Table', icon: Table },
  { value: 'graph', label: 'Graph', icon: BarChart3 },
  { value: 'text', label: 'Text', icon: FileText },
] as const;

const dataSourceOptions = [
  { value: 'sql', label: 'SQL', icon: Database },
  { value: 'vector', label: 'Vector', icon: Brain },
  { value: 'documents', label: 'Docs', icon: FileText },
  { value: 'spreadsheets', label: 'Sheets', icon: FileSpreadsheet },
] as const;

const ResponsePreferences = ({ preferences, onPreferencesChange, className = '' }: ResponsePreferencesProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedFormat = formatOptions.find(opt => opt.value === preferences.format);
  const selectedDataSource = dataSourceOptions.find(opt => opt.value === preferences.dataSource);

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-72 p-3" align="end">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Response Settings</h4>
            
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Format</label>
              <div className="grid grid-cols-3 gap-1">
                {formatOptions.map((option) => (
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

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Source</label>
              <div className="grid grid-cols-2 gap-1">
                {dataSourceOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onPreferencesChange({ ...preferences, dataSource: option.value })}
                    className={`flex items-center gap-2 p-2 rounded-md text-xs transition-colors ${
                      preferences.dataSource === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                    }`}
                  >
                    <option.icon className="h-3 w-3" />
                    {option.label}
                    {preferences.dataSource === option.value && <Check className="h-3 w-3 ml-auto" />}
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
