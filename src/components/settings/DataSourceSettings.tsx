
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { FileSpreadsheet, Database, Globe, Youtube, BarChart, LucideIcon, Briefcase, Search, Loader2, Server, Cloud, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface DataSourceType {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  isConnected: boolean;
  fields: { id: string; label: string; type: string; placeholder: string; required: boolean }[];
}

const dataSources: DataSourceType[] = [
  {
    id: 'sharepoint',
    name: 'SharePoint',
    description: 'Connect to your SharePoint sites and documents',
    icon: FileSpreadsheet,
    isConnected: false,
    fields: [
      { id: 'site_url', label: 'SharePoint Site URL', type: 'text', placeholder: 'https://company.sharepoint.com/sites/yoursite', required: true },
      { id: 'client_id', label: 'Client ID', type: 'text', placeholder: 'Enter your client ID', required: true },
      { id: 'client_secret', label: 'Client Secret', type: 'password', placeholder: '••••••••', required: true },
    ]
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    description: 'Connect to your Snowflake data warehouse',
    icon: Cloud,
    isConnected: true,
    fields: [
      { id: 'account', label: 'Account Identifier', type: 'text', placeholder: 'your-account', required: true },
      { id: 'username', label: 'Username', type: 'text', placeholder: 'Enter your username', required: true },
      { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true },
      { id: 'warehouse', label: 'Warehouse', type: 'text', placeholder: 'COMPUTE_WH', required: true },
      { id: 'database', label: 'Database', type: 'text', placeholder: 'Enter database name', required: true },
    ]
  },
  {
    id: 'sql',
    name: 'SQL Database',
    description: 'Connect to your SQL Server, MySQL, or PostgreSQL database',
    icon: Database,
    isConnected: false,
    fields: [
      { id: 'db_type', label: 'Database Type', type: 'text', placeholder: 'PostgreSQL, MySQL, SQL Server', required: true },
      { id: 'host', label: 'Host', type: 'text', placeholder: 'localhost or db.example.com', required: true },
      { id: 'port', label: 'Port', type: 'text', placeholder: '5432', required: true },
      { id: 'username', label: 'Username', type: 'text', placeholder: 'Enter your username', required: true },
      { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true },
      { id: 'database', label: 'Database Name', type: 'text', placeholder: 'Enter database name', required: true }
    ]
  },
  {
    id: 'website',
    name: 'Website',
    description: 'Connect to website content via URL',
    icon: Globe,
    isConnected: false,
    fields: [
      { id: 'url', label: 'Website URL', type: 'text', placeholder: 'https://www.example.com', required: true },
      { id: 'crawl_depth', label: 'Crawl Depth', type: 'text', placeholder: '1, 2, or 3', required: false },
    ]
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'Connect to YouTube channels and videos',
    icon: Youtube,
    isConnected: false,
    fields: [
      { id: 'api_key', label: 'API Key', type: 'text', placeholder: 'Enter your YouTube API key', required: true },
      { id: 'channel_id', label: 'Channel ID (Optional)', type: 'text', placeholder: 'Enter channel ID', required: false },
    ]
  },
  {
    id: 'sap',
    name: 'SAP',
    description: 'Connect to your SAP instance',
    icon: BarChart,
    isConnected: false,
    fields: [
      { id: 'host', label: 'SAP Host', type: 'text', placeholder: 'sap.example.com', required: true },
      { id: 'client', label: 'Client', type: 'text', placeholder: '100', required: true },
      { id: 'username', label: 'Username', type: 'text', placeholder: 'Enter your username', required: true },
      { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true },
    ]
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Connect to your Salesforce organization',
    icon: Briefcase,
    isConnected: true,
    fields: [
      { id: 'instance_url', label: 'Instance URL', type: 'text', placeholder: 'https://yourinstance.salesforce.com', required: true },
      { id: 'client_id', label: 'Client ID', type: 'text', placeholder: 'Enter your client ID', required: true },
      { id: 'client_secret', label: 'Client Secret', type: 'password', placeholder: '••••••••', required: true },
      { id: 'username', label: 'Username', type: 'text', placeholder: 'user@example.com', required: true },
      { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true },
    ]
  },
  {
    id: 'servicenow',
    name: 'ServiceNow',
    description: 'Connect to your ServiceNow instance and incidents',
    icon: Server,
    isConnected: false,
    fields: [
      { id: 'instance_url', label: 'ServiceNow Instance URL', type: 'text', placeholder: 'https://your-instance.service-now.com', required: true },
      { id: 'username', label: 'Username', type: 'text', placeholder: 'Enter your username', required: true },
      { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true },
      { id: 'table', label: 'Table Name (Optional)', type: 'text', placeholder: 'incident, change_request, etc.', required: false },
    ]
  },
];

const DataSourceSettings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [connectedSources, setConnectedSources] = useState<Record<string, boolean>>(
    dataSources.reduce((acc, source) => ({
      ...acc,
      [source.id]: source.isConnected
    }), {})
  );
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  const [connectingSource, setConnectingSource] = useState<string | null>(null);
  const [connectionProgress, setConnectionProgress] = useState(0);

  // Filter data sources based on search query
  const filteredDataSources = dataSources.filter(source =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    source.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConnect = async (sourceId: string) => {
    setConnectingSource(sourceId);
    setConnectionProgress(0);
    
    // Simulate connection progress
    const progressInterval = setInterval(() => {
      setConnectionProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate connection time (2 seconds)
    setTimeout(() => {
      clearInterval(progressInterval);
      setConnectedSources(prev => ({...prev, [sourceId]: true}));
      toast.success(`Connected to ${dataSources.find(s => s.id === sourceId)?.name}`);
      setExpandedSource(null);
      setConnectingSource(null);
      setConnectionProgress(0);
    }, 2000);
  };

  const handleDisconnect = (sourceId: string) => {
    setConnectedSources(prev => ({...prev, [sourceId]: false}));
    toast.success(`Disconnected from ${dataSources.find(s => s.id === sourceId)?.name}`);
  };

  const toggleExpanded = (sourceId: string) => {
    setExpandedSource(expandedSource === sourceId ? null : sourceId);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Data Sources</h2>
          <Badge variant="outline" className="px-3 py-1 text-sm bg-blue-50 text-blue-700 border-blue-200">
            {Object.values(connectedSources).filter(Boolean).length} Connected
          </Badge>
        </div>
        <p className="text-gray-600 text-sm m-2">
          Connect your external data sources to enhance your queries with relevant information.
        </p>
      </div>

      {/* Search Field */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search data sources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* No Results Message */}
      {searchQuery && filteredDataSources.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Search className="h-8 w-8 mx-auto mb-4 text-gray-300" />
          <p className="text-sm">No data sources found matching "{searchQuery}"</p>
        </div>
      )}
      
      {/* Data Sources List */}
      <div className="space-y-2">
        {filteredDataSources.map((source, index) => (
          <div key={source.id}>
            <div className="bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
              {/* Main Row */}
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => !connectedSources[source.id] && toggleExpanded(source.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <source.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="m-2">
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">
                      {source.name}
                    </h3>
                    <p className="text-xs text-gray-600 leading-tight">
                      {source.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {connectedSources[source.id] ? (
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50 text-xs px-3 py-1 font-medium">
                        Connected
                      </Badge>
                      <ChevronDown 
                        className={`h-4 w-4 text-gray-400 cursor-pointer transition-transform hover:text-gray-600 ${
                          expandedSource === source.id ? 'rotate-180' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpanded(source.id);
                        }}
                      />
                    </div>
                  ) : connectingSource === source.id ? (
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-3 py-1 font-medium">
                      Connecting...
                    </Badge>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-gray-500 text-xs px-3 py-1 border-gray-300 font-medium">
                        Not Connected
                      </Badge>
                      <ChevronDown 
                        className={`h-4 w-4 text-gray-400 transition-transform hover:text-gray-600 ${
                          expandedSource === source.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedSource === source.id && (
                <div className="border-t border-gray-100">
                  <div className="p-4 bg-gray-50/30">
                    {connectingSource === source.id ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                          <span className="font-medium text-gray-900 text-sm">Connecting to {source.name}...</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Establishing secure connection</span>
                            <span>{connectionProgress}%</span>
                          </div>
                          <Progress value={connectionProgress} className="w-full h-2" />
                        </div>
                        <p className="text-sm text-gray-600">
                          Please wait while we establish a secure connection to your data source.
                        </p>
                      </div>
                    ) : connectedSources[source.id] ? (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                          <div>
                            <h4 className="font-semibold text-green-900 text-sm mb-1">Connection Active</h4>
                            <p className="text-sm text-green-700">Data source is currently connected and active</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`${source.id}-active`} className="text-sm text-green-700">Active</Label>
                            <Switch id={`${source.id}-active`} defaultChecked />
                          </div>
                        </div>
                        <div>
                          <Button 
                            variant="outline" 
                            onClick={() => handleDisconnect(source.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 text-sm px-4 py-2"
                          >
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <form className="space-y-4 bg-white p-4 rounded-lg border border-gray-100">
                        {source.fields.map((field) => (
                          <div key={field.id} className="space-y-2">
                            <label htmlFor={`${source.id}-${field.id}`} className="block text-sm font-medium text-gray-700">
                              {field.label} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            <Input 
                              id={`${source.id}-${field.id}`} 
                              type={field.type}
                              placeholder={field.placeholder}
                              required={field.required}
                              className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        ))}
                        <div className="pt-3 border-t border-gray-100">
                          <Button 
                            type="button" 
                            onClick={() => handleConnect(source.id)}
                            disabled={connectingSource !== null}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2"
                          >
                            Connect to {source.name}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataSourceSettings;
