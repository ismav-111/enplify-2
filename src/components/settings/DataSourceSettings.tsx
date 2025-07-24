
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
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
  Settings,
  CheckCircle
} from 'lucide-react';

const DataSourceSettings = () => {
  const [connectedSources, setConnectedSources] = useState([
    { id: 1, type: 'snowflake', name: 'Snowflake', status: 'connected' },
    { id: 2, type: 'salesforce', name: 'Salesforce', status: 'connected' },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState(null);
  const [configDialog, setConfigDialog] = useState(false);

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
          name: 'Azure Data Lake Storage',
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
          name: 'Document Library',
          description: 'Upload and manage local files',
          icon: FolderOpen,
          configFields: [
            { name: 'name', label: 'Library Name', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea', required: false },
          ]
        },
        {
          id: 'onedrive',
          name: 'OneDrive',
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
          name: 'Website',
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

  const handleConfigure = (source: any) => {
    setSelectedSource(source);
    setConfigDialog(true);
  };

  const handleSaveConfig = () => {
    if (selectedSource) {
      handleConnect(selectedSource.id, selectedSource.name);
      setConfigDialog(false);
      setSelectedSource(null);
    }
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
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Data Sources</h1>
          <p className="text-muted-foreground text-lg mb-4">
            Connect your external data sources to enhance your queries with relevant information.
          </p>
          <Badge variant="secondary" className="text-sm">
            {connectedCount} Connected
          </Badge>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search data sources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Data Sources Groups */}
        <div className="space-y-6">
          {filteredGroups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <Card key={group.id} className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <GroupIcon className="h-6 w-6 text-primary" />
                    {group.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {group.sources.map((source) => {
                      const SourceIcon = source.icon;
                      const connected = isConnected(source.id);

                      return (
                        <AccordionItem key={source.id} value={source.id}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-muted rounded-lg">
                                  <SourceIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="text-left">
                                  <h3 className="font-medium text-foreground">{source.name}</h3>
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
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pt-4 pl-12">
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                  {connected ? 'This data source is connected and ready to use.' : 'Configure this data source to get started.'}
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleConfigure(source)}
                                  disabled={connected}
                                  className="ml-4"
                                >
                                  <Settings className="h-4 w-4 mr-2" />
                                  {connected ? 'Connected' : 'Configure'}
                                </Button>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No data sources found matching your search.</p>
          </div>
        )}
      </div>

      {/* Configuration Dialog */}
      <Dialog open={configDialog} onOpenChange={setConfigDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configure {selectedSource?.name}</DialogTitle>
            <DialogDescription>
              Enter your connection details to set up this data source.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedSource?.configFields.map((field: any) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea 
                    className="w-full p-3 border border-input rounded-md bg-background text-foreground"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    rows={3}
                  />
                ) : field.type === 'select' ? (
                  <select className="w-full p-3 border border-input rounded-md bg-background text-foreground">
                    <option value="">Select {field.label.toLowerCase()}</option>
                    {field.options?.map((option: string) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    type={field.type}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className="w-full"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setConfigDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveConfig}
              className="flex-1"
            >
              Save & Connect
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataSourceSettings;
