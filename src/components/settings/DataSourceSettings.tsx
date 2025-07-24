import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import DataSourceConnectionModal from './DataSourceConnectionModal';
import { 
  Search, 
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
  CheckCircle,
  Plus,
  Loader2
} from 'lucide-react';

const DataSourceSettings = () => {
  const [connectedSources, setConnectedSources] = useState([
    { id: 1, type: 'snowflake', name: 'Snowflake', status: 'connected' },
    { id: 2, type: 'salesforce', name: 'Salesforce', status: 'connected' },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dataSourceGroups = [
    {
      id: 'warehouses',
      name: 'Data Warehouses',
      icon: Database,
      sources: [
        {
          id: 'snowflake',
          name: 'Snowflake',
          description: 'Connect to your Snowflake data warehouse',
          icon: Database,
          configFields: [
            { name: 'account', label: 'Account', type: 'text', required: true },
            { name: 'username', label: 'Username', type: 'text', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true },
            { name: 'warehouse', label: 'Warehouse', type: 'text', required: true },
            { name: 'database', label: 'Database', type: 'text', required: true },
            { name: 'schema', label: 'Schema', type: 'text', required: true },
          ]
        },
        {
          id: 'databricks',
          name: 'Databricks',
          description: 'Connect to your Databricks workspace',
          icon: Database,
          configFields: [
            { name: 'server_hostname', label: 'Server Hostname', type: 'text', required: true },
            { name: 'http_path', label: 'HTTP Path', type: 'text', required: true },
            { name: 'access_token', label: 'Access Token', type: 'password', required: true },
          ]
        },
        {
          id: 'redshift',
          name: 'Amazon Redshift',
          description: 'Connect to your Amazon Redshift cluster',
          icon: Database,
          configFields: [
            { name: 'host', label: 'Host', type: 'text', required: true },
            { name: 'port', label: 'Port', type: 'number', required: true },
            { name: 'database', label: 'Database', type: 'text', required: true },
            { name: 'username', label: 'Username', type: 'text', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true },
          ]
        }
      ]
    },
    {
      id: 'databases',
      name: 'Databases',
      icon: Server,
      sources: [
        {
          id: 'postgresql',
          name: 'PostgreSQL',
          description: 'Connect to your PostgreSQL database',
          icon: Server,
          configFields: [
            { name: 'host', label: 'Host', type: 'text', required: true },
            { name: 'port', label: 'Port', type: 'number', required: true },
            { name: 'database', label: 'Database', type: 'text', required: true },
            { name: 'username', label: 'Username', type: 'text', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true },
          ]
        },
        {
          id: 'mysql',
          name: 'MySQL',
          description: 'Connect to your MySQL database',
          icon: Server,
          configFields: [
            { name: 'host', label: 'Host', type: 'text', required: true },
            { name: 'port', label: 'Port', type: 'number', required: true },
            { name: 'database', label: 'Database', type: 'text', required: true },
            { name: 'username', label: 'Username', type: 'text', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true },
          ]
        },
        {
          id: 'sql-server',
          name: 'SQL Server',
          description: 'Connect to your SQL Server database',
          icon: Server,
          configFields: [
            { name: 'server', label: 'Server', type: 'text', required: true },
            { name: 'database', label: 'Database', type: 'text', required: true },
            { name: 'username', label: 'Username', type: 'text', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true },
          ]
        },
        {
          id: 'mongodb',
          name: 'MongoDB',
          description: 'Connect to your MongoDB database',
          icon: Server,
          configFields: [
            { name: 'connection_string', label: 'Connection String', type: 'text', required: true },
            { name: 'database', label: 'Database', type: 'text', required: true },
          ]
        }
      ]
    },
    {
      id: 'lakes',
      name: 'Data Lakes',
      icon: Cloud,
      sources: [
        {
          id: 'adls',
          name: 'Azure Data Lake Storage (ADLS)',
          description: 'Connect to your Azure Data Lake Storage',
          icon: Cloud,
          configFields: [
            { name: 'account_name', label: 'Account Name', type: 'text', required: true },
            { name: 'account_key', label: 'Account Key', type: 'password', required: true },
            { name: 'container', label: 'Container', type: 'text', required: true },
          ]
        },
        {
          id: 's3',
          name: 'Amazon S3',
          description: 'Connect to your Amazon S3 bucket',
          icon: Cloud,
          configFields: [
            { name: 'access_key_id', label: 'Access Key ID', type: 'text', required: true },
            { name: 'secret_access_key', label: 'Secret Access Key', type: 'password', required: true },
            { name: 'bucket', label: 'Bucket', type: 'text', required: true },
            { name: 'region', label: 'Region', type: 'text', required: true },
          ]
        },
        {
          id: 'gcs',
          name: 'Google Cloud Storage',
          description: 'Connect to your Google Cloud Storage',
          icon: Cloud,
          configFields: [
            { name: 'project_id', label: 'Project ID', type: 'text', required: true },
            { name: 'credentials', label: 'Service Account JSON', type: 'textarea', required: true },
            { name: 'bucket', label: 'Bucket', type: 'text', required: true },
          ]
        }
      ]
    },
    {
      id: 'repositories',
      name: 'Repositories',
      icon: FolderOpen,
      sources: [
        {
          id: 'sharepoint',
          name: 'SharePoint',
          description: 'Connect to your SharePoint sites and documents',
          icon: FolderOpen,
          configFields: [
            { name: 'site_url', label: 'Site URL', type: 'text', required: true },
            { name: 'username', label: 'Username', type: 'text', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true },
          ]
        },
        {
          id: 'local',
          name: 'Document Library (Local files)',
          description: 'Upload and manage local files',
          icon: FolderOpen,
          configFields: [
            { name: 'name', label: 'Library Name', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea', required: false },
          ]
        },
        {
          id: 'onedrive',
          name: 'One Drive',
          description: 'Connect to your OneDrive files',
          icon: FolderOpen,
          configFields: [
            { name: 'client_id', label: 'Client ID', type: 'text', required: true },
            { name: 'client_secret', label: 'Client Secret', type: 'password', required: true },
          ]
        },
        {
          id: 'googledrive',
          name: 'Google Drive',
          description: 'Connect to your Google Drive files',
          icon: FolderOpen,
          configFields: [
            { name: 'credentials', label: 'Service Account JSON', type: 'textarea', required: true },
            { name: 'folder_id', label: 'Folder ID (optional)', type: 'text', required: false },
          ]
        },
        {
          id: 'dropbox',
          name: 'Dropbox',
          description: 'Connect to your Dropbox files',
          icon: FolderOpen,
          configFields: [
            { name: 'access_token', label: 'Access Token', type: 'password', required: true },
            { name: 'folder_path', label: 'Folder Path', type: 'text', required: false },
          ]
        }
      ]
    },
    {
      id: 'web',
      name: 'Web Sources',
      icon: Globe,
      sources: [
        {
          id: 'facebook',
          name: 'Facebook',
          description: 'Connect to your Facebook pages and posts',
          icon: Facebook,
          configFields: [
            { name: 'access_token', label: 'Access Token', type: 'password', required: true },
            { name: 'page_id', label: 'Page ID', type: 'text', required: true },
          ]
        },
        {
          id: 'twitter',
          name: 'Twitter',
          description: 'Connect to your Twitter account',
          icon: Twitter,
          configFields: [
            { name: 'api_key', label: 'API Key', type: 'text', required: true },
            { name: 'api_secret', label: 'API Secret', type: 'password', required: true },
            { name: 'access_token', label: 'Access Token', type: 'password', required: true },
            { name: 'access_token_secret', label: 'Access Token Secret', type: 'password', required: true },
          ]
        },
        {
          id: 'linkedin',
          name: 'LinkedIn',
          description: 'Connect to your LinkedIn profile and company',
          icon: Linkedin,
          configFields: [
            { name: 'client_id', label: 'Client ID', type: 'text', required: true },
            { name: 'client_secret', label: 'Client Secret', type: 'password', required: true },
          ]
        },
        {
          id: 'instagram',
          name: 'Instagram',
          description: 'Connect to your Instagram account',
          icon: Instagram,
          configFields: [
            { name: 'access_token', label: 'Access Token', type: 'password', required: true },
            { name: 'user_id', label: 'User ID', type: 'text', required: true },
          ]
        },
        {
          id: 'website',
          name: 'Website (APIs, web scraping)',
          description: 'Connect to website content via URL',
          icon: Globe,
          configFields: [
            { name: 'url', label: 'Website URL', type: 'text', required: true },
            { name: 'scraping_method', label: 'Scraping Method', type: 'select', required: true, options: ['API', 'Web Scraping'] },
            { name: 'api_key', label: 'API Key (if applicable)', type: 'password', required: false },
          ]
        }
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Building2,
      sources: [
        {
          id: 'salesforce',
          name: 'Salesforce',
          description: 'Connect to your Salesforce organization',
          icon: Building2,
          configFields: [
            { name: 'username', label: 'Username', type: 'text', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true },
            { name: 'security_token', label: 'Security Token', type: 'password', required: true },
            { name: 'instance_url', label: 'Instance URL', type: 'text', required: true },
          ]
        },
        {
          id: 'sap',
          name: 'SAP',
          description: 'Connect to your SAP instance',
          icon: Building2,
          configFields: [
            { name: 'server', label: 'Server', type: 'text', required: true },
            { name: 'system_number', label: 'System Number', type: 'text', required: true },
            { name: 'client', label: 'Client', type: 'text', required: true },
            { name: 'username', label: 'Username', type: 'text', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true },
          ]
        },
        {
          id: 'servicenow',
          name: 'ServiceNow',
          description: 'Connect to your ServiceNow instance',
          icon: Building2,
          configFields: [
            { name: 'instance_url', label: 'Instance URL', type: 'text', required: true },
            { name: 'username', label: 'Username', type: 'text', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true },
          ]
        }
      ]
    }
  ];

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

  const handleOpenModal = (source: any) => {
    setSelectedSource(source);
    setIsModalOpen(true);
  };

  const connectedCount = connectedSources.length;

  const filteredGroups = dataSourceGroups.map(group => ({
    ...group,
    sources: group.sources.filter(source =>
      source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      source.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(group => group.sources.length > 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 mb-4">
          <Database className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Data Sources
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect your external data sources to enhance your queries with relevant information.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <CheckCircle className="w-3 h-3 mr-1" />
            {connectedCount} Connected
          </Badge>
          <Badge variant="outline" className="text-sm px-3 py-1">
            <Plus className="w-3 h-3 mr-1" />
            {dataSourceGroups.reduce((acc, group) => acc + group.sources.length, 0)} Available
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search data sources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12 text-base border-2 bg-background/50 backdrop-blur-sm"
        />
      </div>

      {/* Data Sources Groups */}
      <div className="space-y-8">
        {filteredGroups.map((group) => {
          const GroupIcon = group.icon;
          return (
            <Card key={group.id} className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/10">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-4 text-2xl">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <GroupIcon className="h-6 w-6 text-primary" />
                  </div>
                  {group.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.sources.map((source) => {
                    const SourceIcon = source.icon;
                    const connected = isConnected(source.id);

                    return (
                      <div
                        key={source.id}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                          connected
                            ? 'border-green-500/30 bg-gradient-to-br from-green-500/5 to-green-600/5'
                            : 'border-border hover:border-primary/30 bg-gradient-to-br from-background to-muted/20'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              connected ? 'bg-green-500/10' : 'bg-muted'
                            }`}>
                              <SourceIcon className={`h-5 w-5 ${
                                connected ? 'text-green-600' : 'text-muted-foreground'
                              }`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{source.name}</h3>
                              <p className="text-sm text-muted-foreground">{source.description}</p>
                            </div>
                          </div>
                          {connected && (
                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Connected
                            </Badge>
                          )}
                        </div>
                        
                        {!connected && (
                          <Button
                            onClick={() => handleOpenModal(source)}
                            className="w-full"
                            size="sm"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Connect
                          </Button>
                        )}
                        
                        {connected && (
                          <div className="text-sm text-green-600 font-medium">
                            Ready to use
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-16">
          <Search className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No data sources found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms</p>
        </div>
      )}

      {/* Connection Modal */}
      {selectedSource && (
        <DataSourceConnectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          source={selectedSource}
          onConnect={handleConnect}
        />
      )}
    </div>
  );
};

export default DataSourceSettings;
