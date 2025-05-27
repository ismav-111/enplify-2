
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
import { toast } from 'sonner';
import { FileSpreadsheet, Database, Globe, Youtube, BarChart, LucideIcon, Briefcase, Search } from 'lucide-react';
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
    icon: Database,
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

  // Filter data sources based on search query
  const filteredDataSources = dataSources.filter(source =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    source.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConnect = (sourceId: string) => {
    setConnectedSources(prev => ({...prev, [sourceId]: true}));
    toast.success(`Connected to ${dataSources.find(s => s.id === sourceId)?.name}`);
    setExpandedSource(null);
  };

  const handleDisconnect = (sourceId: string) => {
    setConnectedSources(prev => ({...prev, [sourceId]: false}));
    toast.success(`Disconnected from ${dataSources.find(s => s.id === sourceId)?.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Data Sources</h2>
        <Badge variant="outline" className="text-xs">
          {Object.values(connectedSources).filter(Boolean).length} Connected
        </Badge>
      </div>
      
      <p className="text-sm text-gray-500">
        Connect your external data sources to enhance your queries with relevant information.
      </p>

      {/* Search Field */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search data sources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Show message if no results found */}
      {searchQuery && filteredDataSources.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No data sources found matching "{searchQuery}"</p>
        </div>
      )}
      
      <Accordion 
        type="single" 
        collapsible 
        value={expandedSource || undefined}
        onValueChange={(value) => setExpandedSource(value)}
        className="w-full"
      >
        {filteredDataSources.map((source) => (
          <AccordionItem key={source.id} value={source.id}>
            <AccordionTrigger className="py-4">
              <div className="flex items-center w-full justify-between pr-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <source.icon className="h-5 w-5 text-gray-700" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-medium">{source.name}</h3>
                    <p className="text-xs text-gray-500">{source.description}</p>
                  </div>
                </div>
                {connectedSources[source.id] && (
                  <Badge className="bg-green-500 text-white hover:bg-green-600">
                    Connected
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="border-0 shadow-none">
                <CardContent className="pt-4">
                  {connectedSources[source.id] ? (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-medium">Connection Status</h4>
                          <p className="text-xs text-gray-500">Data source is currently active</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`${source.id}-active`}>Active</Label>
                          <Switch id={`${source.id}-active`} defaultChecked />
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button 
                          variant="outline" 
                          onClick={() => handleDisconnect(source.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form className="space-y-4">
                      {source.fields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <label htmlFor={`${source.id}-${field.id}`} className="text-sm font-medium">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          <Input 
                            id={`${source.id}-${field.id}`} 
                            type={field.type}
                            placeholder={field.placeholder}
                            required={field.required}
                          />
                        </div>
                      ))}
                      <Button 
                        type="button" 
                        onClick={() => handleConnect(source.id)}
                      >
                        Connect
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default DataSourceSettings;
