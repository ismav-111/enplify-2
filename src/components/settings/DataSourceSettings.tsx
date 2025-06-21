
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { FileSpreadsheet, Database, Globe, Youtube, BarChart, LucideIcon, Briefcase, Search, Loader2, Settings, Server, Cloud } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [connectedSources, setConnectedSources] = useState<Record<string, boolean>>(
    dataSources.reduce((acc, source) => ({
      ...acc,
      [source.id]: source.isConnected
    }), {})
  );
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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Data Sources</h2>
          <p className="text-sm text-gray-500 mt-1">
            Connect your external data sources to enhance your queries with relevant information.
          </p>
        </div>
        <Badge variant="outline" className="text-xs px-3 py-1">
          {Object.values(connectedSources).filter(Boolean).length} Connected
        </Badge>
      </div>

      {/* Search Field */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search data sources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {/* No Results Message */}
      {searchQuery && filteredDataSources.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Search className="h-8 w-8 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No data sources found matching "{searchQuery}"</p>
        </div>
      )}
      
      {/* Data Sources List */}
      <Accordion 
        type="single" 
        collapsible 
        value={expandedSource || undefined}
        onValueChange={(value) => setExpandedSource(value)}
        className="w-full space-y-3"
      >
        {filteredDataSources.map((source) => (
          <AccordionItem 
            key={source.id} 
            value={source.id} 
            className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                    <source.icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">{source.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{source.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  {connectedSources[source.id] ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                      Connected
                    </Badge>
                  ) : connectingSource === source.id ? (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      Connecting...
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500 border-gray-200">
                      Not Connected
                    </Badge>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="px-6 pb-6">
              <div className="pt-2 border-t border-gray-100">
                {connectingSource === source.id ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                      <span className="font-medium text-gray-900">Connecting to {source.name}...</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Establishing secure connection</span>
                        <span>{connectionProgress}%</span>
                      </div>
                      <Progress value={connectionProgress} className="w-full h-2" />
                    </div>
                    <p className="text-sm text-gray-500">
                      Please wait while we establish a secure connection to your data source.
                    </p>
                  </div>
                ) : connectedSources[source.id] ? (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <h4 className="font-medium text-green-900">Connection Active</h4>
                        <p className="text-sm text-green-700 mt-1">Data source is currently connected and active</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`${source.id}-active`} className="text-sm text-green-700">Active</Label>
                        <Switch id={`${source.id}-active`} defaultChecked />
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        onClick={() => handleDisconnect(source.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form className="space-y-4 mt-4">
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
                          className="bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                    ))}
                    <div className="pt-4 border-t border-gray-100">
                      <Button 
                        type="button" 
                        onClick={() => handleConnect(source.id)}
                        disabled={connectingSource !== null}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        Connect to {source.name}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default DataSourceSettings;
