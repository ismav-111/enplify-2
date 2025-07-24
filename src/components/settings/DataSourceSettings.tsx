
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Search, 
  ChevronRight, 
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
  Linkedin,
  Settings,
  Plus
} from 'lucide-react';
import DataSourceConfigDialog from '@/components/settings/DataSourceConfigDialog';

const DataSourceSettings = () => {
  const [connectedSources, setConnectedSources] = useState([
    { id: 1, type: 'snowflake', name: 'Snowflake', status: 'connected' },
    { id: 2, type: 'salesforce', name: 'Salesforce', status: 'connected' },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  const dataSources = [
    {
      id: 'snowflake',
      name: 'Snowflake',
      description: 'Connect to your Snowflake data warehouse',
      icon: Database,
      category: 'Data Warehouses'
    },
    {
      id: 'databricks',
      name: 'Databricks',
      description: 'Connect to your Databricks workspace',
      icon: Database,
      category: 'Data Warehouses'
    },
    {
      id: 'redshift',
      name: 'Amazon Redshift',
      description: 'Connect to your Amazon Redshift cluster',
      icon: Database,
      category: 'Data Warehouses'
    },
    {
      id: 'sql-database',
      name: 'SQL Database',
      description: 'Connect to your SQL Server database',
      icon: Server,
      category: 'Databases'
    },
    {
      id: 'postgresql',
      name: 'PostgreSQL',
      description: 'Connect to your PostgreSQL database',
      icon: Server,
      category: 'Databases'
    },
    {
      id: 'mysql',
      name: 'MySQL',
      description: 'Connect to your MySQL database',
      icon: Server,
      category: 'Databases'
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      description: 'Connect to your MongoDB database',
      icon: Server,
      category: 'Databases'
    },
    {
      id: 'adls',
      name: 'Azure Data Lake Storage',
      description: 'Connect to your Azure Data Lake Storage',
      icon: Cloud,
      category: 'Cloud Storage'
    },
    {
      id: 's3',
      name: 'Amazon S3',
      description: 'Connect to your Amazon S3 bucket',
      icon: Cloud,
      category: 'Cloud Storage'
    },
    {
      id: 'gcs',
      name: 'Google Cloud Storage',
      description: 'Connect to your Google Cloud Storage',
      icon: Cloud,
      category: 'Cloud Storage'
    },
    {
      id: 'sharepoint',
      name: 'SharePoint',
      description: 'Connect to your SharePoint sites and documents',
      icon: FolderOpen,
      category: 'File Repositories'
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      description: 'Connect to your OneDrive files',
      icon: FolderOpen,
      category: 'File Repositories'
    },
    {
      id: 'googledrive',
      name: 'Google Drive',
      description: 'Connect to your Google Drive files',
      icon: FolderOpen,
      category: 'File Repositories'
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'Connect to your Dropbox files',
      icon: FolderOpen,
      category: 'File Repositories'
    },
    {
      id: 'local',
      name: 'Document Library',
      description: 'Upload and manage local files',
      icon: FolderOpen,
      category: 'File Repositories'
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Connect to your Salesforce organization',
      icon: Building2,
      category: 'Enterprise Applications'
    },
    {
      id: 'sap',
      name: 'SAP',
      description: 'Connect to your SAP instance',
      icon: Building2,
      category: 'Enterprise Applications'
    },
    {
      id: 'servicenow',
      name: 'ServiceNow',
      description: 'Connect to your ServiceNow instance',
      icon: Building2,
      category: 'Enterprise Applications'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      description: 'Connect to YouTube channels and videos',
      icon: Youtube,
      category: 'Social Media'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Connect to your Facebook pages and posts',
      icon: Facebook,
      category: 'Social Media'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      description: 'Connect to your Twitter account',
      icon: Twitter,
      category: 'Social Media'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Connect to your LinkedIn profile and company',
      icon: Linkedin,
      category: 'Social Media'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Connect to your Instagram account',
      icon: Instagram,
      category: 'Social Media'
    },
    {
      id: 'website',
      name: 'Website',
      description: 'Connect to website content via URL',
      icon: Globe,
      category: 'Web Sources'
    }
  ];

  const isConnected = (sourceId: string) => {
    return connectedSources.some(source => source.type === sourceId);
  };

  const handleConfigureSource = (source) => {
    setSelectedSource(source);
    setIsConfigDialogOpen(true);
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
    setIsConfigDialogOpen(false);
  };

  const connectedCount = connectedSources.length;

  const filteredSources = dataSources.filter(source =>
    source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group sources by category
  const groupedSources = filteredSources.reduce((acc, source) => {
    if (!acc[source.category]) {
      acc[source.category] = [];
    }
    acc[source.category].push(source);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
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

      {/* Grouped Data Sources */}
      <div className="space-y-8">
        {Object.entries(groupedSources).map(([category, sources]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-lg font-medium text-foreground border-b border-border pb-2">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sources.map((source) => {
                const Icon = source.icon;
                const connected = isConnected(source.id);

                return (
                  <div
                    key={source.id}
                    className="group relative bg-card border border-border rounded-lg p-6 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer"
                    onClick={() => handleConfigureSource(source)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                          <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {source.name}
                          </h3>
                          {connected && (
                            <Badge className="mt-1 bg-green-500/10 text-green-600 border-green-500/20 text-xs">
                              Connected
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {source.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={connected ? "secondary" : "default"}
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfigureSource(source);
                        }}
                      >
                        {connected ? (
                          <>
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Connect
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(groupedSources).length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No data sources found matching your search.</p>
        </div>
      )}

      {/* Configuration Dialog */}
      <DataSourceConfigDialog
        isOpen={isConfigDialogOpen}
        onClose={() => setIsConfigDialogOpen(false)}
        source={selectedSource}
        onConnect={handleConnect}
        isConnected={selectedSource ? isConnected(selectedSource.id) : false}
      />
    </div>
  );
};

export default DataSourceSettings;
