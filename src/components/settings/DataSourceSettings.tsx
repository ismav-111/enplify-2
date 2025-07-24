
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Search, 
  ChevronDown, 
  Database, 
  FolderOpen, 
  Globe, 
  Youtube, 
  Building2,
  Server,
  Cloud,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';

const DataSourceSettings = () => {
  const [connectedSources, setConnectedSources] = useState([
    { id: 1, type: 'snowflake', name: 'Snowflake', status: 'connected' },
    { id: 2, type: 'salesforce', name: 'Salesforce', status: 'connected' },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSources, setExpandedSources] = useState<string[]>([]);

  const dataSources = [
    {
      id: 'sharepoint',
      name: 'SharePoint',
      description: 'Connect to your SharePoint sites and documents',
      icon: FolderOpen,
      category: 'repositories'
    },
    {
      id: 'snowflake',
      name: 'Snowflake',
      description: 'Connect to your Snowflake data warehouse',
      icon: Database,
      category: 'warehouses'
    },
    {
      id: 'sql-database',
      name: 'SQL Database',
      description: 'Connect to your SQL Server, MySQL, or PostgreSQL database',
      icon: Server,
      category: 'databases'
    },
    {
      id: 'website',
      name: 'Website',
      description: 'Connect to website content via URL',
      icon: Globe,
      category: 'web'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      description: 'Connect to YouTube channels and videos',
      icon: Youtube,
      category: 'social'
    },
    {
      id: 'sap',
      name: 'SAP',
      description: 'Connect to your SAP instance',
      icon: Building2,
      category: 'enterprise'
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Connect to your Salesforce organization',
      icon: Building2,
      category: 'enterprise'
    },
    {
      id: 'databricks',
      name: 'Databricks',
      description: 'Connect to your Databricks workspace',
      icon: Database,
      category: 'warehouses'
    },
    {
      id: 'redshift',
      name: 'Amazon Redshift',
      description: 'Connect to your Amazon Redshift cluster',
      icon: Database,
      category: 'warehouses'
    },
    {
      id: 'postgresql',
      name: 'PostgreSQL',
      description: 'Connect to your PostgreSQL database',
      icon: Server,
      category: 'databases'
    },
    {
      id: 'mysql',
      name: 'MySQL',
      description: 'Connect to your MySQL database',
      icon: Server,
      category: 'databases'
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      description: 'Connect to your MongoDB database',
      icon: Server,
      category: 'databases'
    },
    {
      id: 'adls',
      name: 'Azure Data Lake Storage',
      description: 'Connect to your Azure Data Lake Storage',
      icon: Cloud,
      category: 'lakes'
    },
    {
      id: 's3',
      name: 'Amazon S3',
      description: 'Connect to your Amazon S3 bucket',
      icon: Cloud,
      category: 'lakes'
    },
    {
      id: 'gcs',
      name: 'Google Cloud Storage',
      description: 'Connect to your Google Cloud Storage',
      icon: Cloud,
      category: 'lakes'
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      description: 'Connect to your OneDrive files',
      icon: FolderOpen,
      category: 'repositories'
    },
    {
      id: 'googledrive',
      name: 'Google Drive',
      description: 'Connect to your Google Drive files',
      icon: FolderOpen,
      category: 'repositories'
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'Connect to your Dropbox files',
      icon: FolderOpen,
      category: 'repositories'
    },
    {
      id: 'local',
      name: 'Document Library',
      description: 'Upload and manage local files',
      icon: FolderOpen,
      category: 'repositories'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Connect to your Facebook pages and posts',
      icon: Facebook,
      category: 'social'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      description: 'Connect to your Twitter account',
      icon: Twitter,
      category: 'social'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Connect to your LinkedIn profile and company',
      icon: Linkedin,
      category: 'social'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Connect to your Instagram account',
      icon: Instagram,
      category: 'social'
    },
    {
      id: 'servicenow',
      name: 'ServiceNow',
      description: 'Connect to your ServiceNow instance',
      icon: Building2,
      category: 'enterprise'
    }
  ];

  const toggleExpanded = (sourceId: string) => {
    setExpandedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const isConnected = (sourceId: string) => {
    return connectedSources.some(source => source.type === sourceId);
  };

  const handleConnect = (sourceId: string, sourceName: string) => {
    const newSource = {
      id: Date.now(),
      type: sourceId,
      name: sourceName,
      status: 'connected'
    };
    setConnectedSources([...connectedSources, newSource]);
    toast.success(`${sourceName} connected successfully`);
  };

  const connectedCount = connectedSources.length;

  const filteredSources = dataSources.filter(source =>
    source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Data Sources</h1>
          <p className="text-muted-foreground mt-1">
            Connect your external data sources to enhance your queries with relevant information.
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {connectedCount} Connected
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search data sources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Data Sources List */}
      <div className="space-y-2">
        {filteredSources.map((source) => {
          const Icon = source.icon;
          const connected = isConnected(source.id);
          const expanded = expandedSources.includes(source.id);

          return (
            <div
              key={source.id}
              className="border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => toggleExpanded(source.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{source.name}</h3>
                    <p className="text-sm text-muted-foreground">{source.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {connected && (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      Connected
                    </Badge>
                  )}
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      expanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              {expanded && (
                <div className="px-4 pb-4 border-t border-border">
                  <div className="pt-4 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {connected ? 'This data source is connected and ready to use.' : 'Click connect to set up this data source.'}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleConnect(source.id, source.name)}
                      disabled={connected}
                      className="ml-4"
                    >
                      {connected ? 'Connected' : 'Connect'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredSources.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No data sources found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default DataSourceSettings;
