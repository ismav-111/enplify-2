
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { BarChart3, Table, FileText, Database, Brain, FileSpreadsheet, LayoutGrid, Check } from 'lucide-react';

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

  // Filter format options based on data source and mode
  const getAvailableFormats = () => {
    // For endocs and ensights, show all format options
    if (mode === 'endocs' || mode === 'ensights') {
      return allFormatOptions; // table, graph, text
    }
    
    // For encore mode, filter based on data source
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
            className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/80 shadow-sm hover:shadow-md hover:from-slate-100 hover:to-slate-200 transition-all duration-200 group"
          >
            <LayoutGrid size={18} className="text-slate-600 group-hover:text-slate-700 transition-colors" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 p-0 shadow-xl border-0 bg-white/95 backdrop-blur-sm" align="end">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <LayoutGrid size={20} className="text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-800">Output Preferences</h4>
                <p className="text-sm text-slate-500">Customize your response format</p>
              </div>
            </div>
            
            {/* Data Source selection - only for encore mode */}
            {mode === 'encore' && (
              <div className="mb-6">
                <label className="text-sm font-medium text-slate-700 mb-3 block">Data Source</label>
                <div className="grid grid-cols-1 gap-2">
                  {dataSourceOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleDataSourceChange(option.value)}
                      className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        preferences.dataSource === option.value
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <option.icon className="h-4 w-4 flex-shrink-0" />
                      <span>{option.label}</span>
                      {preferences.dataSource === option.value && (
                        <Check className="h-4 w-4 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-slate-700 mb-3 block">Output Format</label>
              <div className={`grid gap-2 ${availableFormats.length === 3 ? 'grid-cols-3' : availableFormats.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {availableFormats.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onPreferencesChange({ ...preferences, format: option.value })}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      preferences.format === option.value
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <option.icon className="h-5 w-5" />
                    <span>{option.label}</span>
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
