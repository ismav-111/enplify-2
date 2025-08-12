import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { FileSpreadsheet, Database, Globe, Youtube, BarChart, LucideIcon, Briefcase, Search, Loader2, Server, Cloud, ChevronDown, Rocket, Sparkles, HardDrive, Folder, FileText, Share2, Facebook, Twitter, Linkedin, Instagram, MonitorSpeaker, CloudSnow, Zap, Archive, FolderOpen, CloudDrizzle, Shield, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface DataSourceType {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  isConnected: boolean;
  fields: {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    required: boolean;
  }[];
}

// Group data sources by category
const dataSourceCategories = {
  api: [{
    id: 'rest-api',
    name: 'REST API',
    description: 'Connect to any REST API endpoint',
    icon: Settings,
    isConnected: false,
    fields: [{
      id: 'endpoint',
      label: 'API Endpoint',
      type: 'url',
      placeholder: 'https://api.example.com/data',
      required: true
    }, {
      id: 'method',
      label: 'HTTP Method',
      type: 'text',
      placeholder: 'GET, POST, PUT, DELETE',
      required: true
    }, {
      id: 'api_key',
      label: 'API Key',
      type: 'password',
      placeholder: '••••••••',
      required: false
    }, {
      id: 'headers',
      label: 'Custom Headers',
      type: 'textarea',
      placeholder: 'Authorization: Bearer token',
      required: false
    }]
  }, {
    id: 'graphql',
    name: 'GraphQL API',
    description: 'Connect to GraphQL endpoints',
    icon: Database,
    isConnected: false,
    fields: [{
      id: 'endpoint',
      label: 'GraphQL Endpoint',
      type: 'url',
      placeholder: 'https://api.example.com/graphql',
      required: true
    }, {
      id: 'query',
      label: 'GraphQL Query',
      type: 'textarea',
      placeholder: 'query { users { id name email } }',
      required: true
    }, {
      id: 'api_key',
      label: 'API Key',
      type: 'password',
      placeholder: '••••••••',
      required: false
    }]
  }],
  web: [{
    id: 'website',
    name: 'Website',
    description: 'Connect to website content via URL or API',
    icon: Globe,
    isConnected: false,
    fields: [{
      id: 'url',
      label: 'Website URL',
      type: 'text',
      placeholder: 'https://www.example.com',
      required: true
    }, {
      id: 'api_endpoint',
      label: 'API Endpoint',
      type: 'text',
      placeholder: 'https://api.example.com',
      required: false
    }, {
      id: 'api_key',
      label: 'API Key',
      type: 'password',
      placeholder: '••••••••',
      required: false
    }, {
      id: 'crawl_depth',
      label: 'Crawl Depth',
      type: 'text',
      placeholder: '1, 2, or 3',
      required: false
    }]
  }, {
    id: 'youtube',
    name: 'YouTube',
    description: 'Connect to YouTube channels and videos',
    icon: Youtube,
    isConnected: false,
    fields: [{
      id: 'channel_url',
      label: 'Channel URL',
      type: 'text',
      placeholder: 'https://www.youtube.com/@channel',
      required: true
    }, {
      id: 'api_key',
      label: 'YouTube API Key',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }, {
      id: 'video_limit',
      label: 'Video Limit',
      type: 'text',
      placeholder: '50',
      required: false
    }]
  }, {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Connect to LinkedIn profiles and company pages',
    icon: Linkedin,
    isConnected: false,
    fields: [{
      id: 'profile_url',
      label: 'Profile/Company URL',
      type: 'text',
      placeholder: 'https://www.linkedin.com/in/username',
      required: true
    }, {
      id: 'access_token',
      label: 'Access Token',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }, {
      id: 'post_limit',
      label: 'Post Limit',
      type: 'text',
      placeholder: '100',
      required: false
    }]
  }, {
    id: 'facebook',
    name: 'Facebook',
    description: 'Connect to Facebook pages and posts',
    icon: Facebook,
    isConnected: false,
    fields: [{
      id: 'page_id',
      label: 'Page ID',
      type: 'text',
      placeholder: 'Your Facebook Page ID',
      required: true
    }, {
      id: 'access_token',
      label: 'Access Token',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }, {
      id: 'post_limit',
      label: 'Post Limit',
      type: 'text',
      placeholder: '100',
      required: false
    }]
  }, {
    id: 'twitter',
    name: 'X (formerly Twitter)',
    description: 'Connect to X (Twitter) profiles and tweets',
    icon: Twitter,
    isConnected: false,
    fields: [{
      id: 'username',
      label: 'Username',
      type: 'text',
      placeholder: '@username',
      required: true
    }, {
      id: 'bearer_token',
      label: 'Bearer Token',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }, {
      id: 'tweet_limit',
      label: 'Tweet Limit',
      type: 'text',
      placeholder: '100',
      required: false
    }]
  }, {
    id: 'instagram',
    name: 'Instagram',
    description: 'Connect to Instagram profiles and posts',
    icon: Instagram,
    isConnected: false,
    fields: [{
      id: 'username',
      label: 'Username',
      type: 'text',
      placeholder: '@username',
      required: true
    }, {
      id: 'access_token',
      label: 'Access Token',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }, {
      id: 'post_limit',
      label: 'Post Limit',
      type: 'text',
      placeholder: '50',
      required: false
    }]
  }],
  warehouses: [{
    id: 'snowflake',
    name: 'Snowflake',
    description: 'Connect to your Snowflake data warehouse for scalable analytics',
    icon: CloudSnow,
    isConnected: true,
    fields: [{
      id: 'account',
      label: 'Account Identifier',
      type: 'text',
      placeholder: 'your-account.snowflakecomputing.com',
      required: true
    }, {
      id: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Enter your username',
      required: true
    }, {
      id: 'password',
      label: 'Password',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }, {
      id: 'warehouse',
      label: 'Warehouse',
      type: 'text',
      placeholder: 'COMPUTE_WH',
      required: true
    }, {
      id: 'database',
      label: 'Database',
      type: 'text',
      placeholder: 'Enter database name',
      required: true
    }, {
      id: 'schema',
      label: 'Schema',
      type: 'text',
      placeholder: 'PUBLIC',
      required: false
    }]
  }, {
    id: 'databricks',
    name: 'Databricks',
    description: 'Connect to your Databricks platform for unified analytics',
    icon: Zap,
    isConnected: false,
    fields: [{
      id: 'server_hostname',
      label: 'Server Hostname',
      type: 'text',
      placeholder: 'your-workspace.cloud.databricks.com',
      required: true
    }, {
      id: 'http_path',
      label: 'HTTP Path',
      type: 'text',
      placeholder: '/sql/1.0/warehouses/your-warehouse-id',
      required: true
    }, {
      id: 'access_token',
      label: 'Personal Access Token',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }, {
      id: 'catalog',
      label: 'Catalog',
      type: 'text',
      placeholder: 'main',
      required: false
    }, {
      id: 'schema',
      label: 'Schema',
      type: 'text',
      placeholder: 'default',
      required: false
    }]
  }, {
    id: 'redshift',
    name: 'Amazon Redshift',
    description: 'Connect to your Amazon Redshift data warehouse',
    icon: Archive,
    isConnected: false,
    fields: [{
      id: 'host',
      label: 'Host',
      type: 'text',
      placeholder: 'your-cluster.region.redshift.amazonaws.com',
      required: true
    }, {
      id: 'port',
      label: 'Port',
      type: 'text',
      placeholder: '5439',
      required: true
    }, {
      id: 'database',
      label: 'Database',
      type: 'text',
      placeholder: 'dev',
      required: true
    }, {
      id: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Enter your username',
      required: true
    }, {
      id: 'password',
      label: 'Password',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }]
  }],
  databases: [{
    id: 'postgresql',
    name: 'PostgreSQL',
    description: 'Connect to your PostgreSQL database',
    icon: Database,
    isConnected: false,
    fields: [{
      id: 'host',
      label: 'Host',
      type: 'text',
      placeholder: 'localhost or db.example.com',
      required: true
    }, {
      id: 'port',
      label: 'Port',
      type: 'text',
      placeholder: '5432',
      required: true
    }, {
      id: 'database',
      label: 'Database Name',
      type: 'text',
      placeholder: 'Enter database name',
      required: true
    }, {
      id: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Enter your username',
      required: true
    }, {
      id: 'password',
      label: 'Password',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }]
  }, {
    id: 'mysql',
    name: 'MySQL',
    description: 'Connect to your MySQL database',
    icon: Database,
    isConnected: false,
    fields: [{
      id: 'host',
      label: 'Host',
      type: 'text',
      placeholder: 'localhost or mysql.example.com',
      required: true
    }, {
      id: 'port',
      label: 'Port',
      type: 'text',
      placeholder: '3306',
      required: true
    }, {
      id: 'database',
      label: 'Database Name',
      type: 'text',
      placeholder: 'Enter database name',
      required: true
    }, {
      id: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Enter your username',
      required: true
    }, {
      id: 'password',
      label: 'Password',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }]
  }, {
    id: 'sqlserver',
    name: 'SQL Server',
    description: 'Connect to your Microsoft SQL Server database',
    icon: Server,
    isConnected: false,
    fields: [{
      id: 'host',
      label: 'Host',
      type: 'text',
      placeholder: 'localhost or sqlserver.example.com',
      required: true
    }, {
      id: 'port',
      label: 'Port',
      type: 'text',
      placeholder: '1433',
      required: true
    }, {
      id: 'database',
      label: 'Database Name',
      type: 'text',
      placeholder: 'Enter database name',
      required: true
    }, {
      id: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Enter your username',
      required: true
    }, {
      id: 'password',
      label: 'Password',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }]
  }, {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'Connect to your MongoDB database',
    icon: HardDrive,
    isConnected: false,
    fields: [{
      id: 'connection_string',
      label: 'Connection String',
      type: 'text',
      placeholder: 'mongodb://localhost:27017/mydb',
      required: true
    }, {
      id: 'database',
      label: 'Database Name',
      type: 'text',
      placeholder: 'Enter database name',
      required: true
    }, {
      id: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Enter your username',
      required: false
    }, {
      id: 'password',
      label: 'Password',
      type: 'password',
      placeholder: '••••••••',
      required: false
    }]
  }],
  lakes: [{
    id: 'adls',
    name: 'Azure Data Lake Storage',
    description: 'Connect to your Azure Data Lake Storage for big data analytics',
    icon: CloudDrizzle,
    isConnected: false,
    fields: [{
      id: 'account_name',
      label: 'Storage Account Name',
      type: 'text',
      placeholder: 'your-storage-account',
      required: true
    }, {
      id: 'container_name',
      label: 'Container Name',
      type: 'text',
      placeholder: 'your-container',
      required: true
    }, {
      id: 'account_key',
      label: 'Account Key',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }, {
      id: 'directory',
      label: 'Directory Path',
      type: 'text',
      placeholder: '/path/to/data',
      required: false
    }]
  }, {
    id: 'amazons3',
    name: 'Amazon S3',
    description: 'Connect to your Amazon S3 buckets for object storage',
    icon: Archive,
    isConnected: false,
    fields: [{
      id: 'bucket_name',
      label: 'Bucket Name',
      type: 'text',
      placeholder: 'your-bucket-name',
      required: true
    }, {
      id: 'aws_access_key',
      label: 'AWS Access Key ID',
      type: 'text',
      placeholder: 'Enter your access key',
      required: true
    }, {
      id: 'aws_secret_key',
      label: 'AWS Secret Access Key',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }, {
      id: 'region',
      label: 'AWS Region',
      type: 'text',
      placeholder: 'us-east-1',
      required: true
    }, {
      id: 'prefix',
      label: 'Prefix/Folder',
      type: 'text',
      placeholder: 'data/',
      required: false
    }]
  }, {
    id: 'gcs',
    name: 'Google Cloud Storage',
    description: 'Connect to your Google Cloud Storage buckets',
    icon: Cloud,
    isConnected: false,
    fields: [{
      id: 'bucket_name',
      label: 'Bucket Name',
      type: 'text',
      placeholder: 'your-bucket-name',
      required: true
    }, {
      id: 'project_id',
      label: 'Project ID',
      type: 'text',
      placeholder: 'your-project-id',
      required: true
    }, {
      id: 'service_account_key',
      label: 'Service Account Key (JSON)',
      type: 'password',
      placeholder: 'Paste your JSON key',
      required: true
    }, {
      id: 'prefix',
      label: 'Prefix/Folder',
      type: 'text',
      placeholder: 'data/',
      required: false
    }]
  }],
  repositories: [{
    id: 'sharepoint',
    name: 'SharePoint',
    description: 'Connect to your SharePoint sites and document libraries',
    icon: Share2,
    isConnected: false,
    fields: [{
      id: 'site_url',
      label: 'SharePoint Site URL',
      type: 'text',
      placeholder: 'https://company.sharepoint.com/sites/yoursite',
      required: true
    }, {
      id: 'client_id',
      label: 'Client ID',
      type: 'text',
      placeholder: 'Enter your client ID',
      required: true
    }, {
      id: 'client_secret',
      label: 'Client Secret',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }, {
      id: 'library_name',
      label: 'Document Library Name',
      type: 'text',
      placeholder: 'Documents',
      required: false
    }]
  }, {
    id: 'local-files',
    name: 'Document Library',
    description: 'Upload and manage local files and documents',
    icon: FolderOpen,
    isConnected: false,
    fields: [{
      id: 'library_name',
      label: 'Library Name',
      type: 'text',
      placeholder: 'My Documents',
      required: true
    }, {
      id: 'file_types',
      label: 'Supported File Types',
      type: 'text',
      placeholder: 'PDF, DOC, DOCX, TXT',
      required: false
    }]
  }, {
    id: 'onedrive',
    name: 'OneDrive',
    description: 'Connect to your Microsoft OneDrive for file access',
    icon: Cloud,
    isConnected: false,
    fields: [{
      id: 'client_id',
      label: 'Client ID',
      type: 'text',
      placeholder: 'Enter your client ID',
      required: true
    }, {
      id: 'client_secret',
      label: 'Client Secret',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }, {
      id: 'folder_path',
      label: 'Folder Path',
      type: 'text',
      placeholder: '/Documents',
      required: false
    }]
  }, {
    id: 'googledrive',
    name: 'Google Drive',
    description: 'Connect to your Google Drive for file access',
    icon: HardDrive,
    isConnected: false,
    fields: [{
      id: 'client_id',
      label: 'Client ID',
      type: 'text',
      placeholder: 'Enter your client ID',
      required: true
    }, {
      id: 'client_secret',
      label: 'Client Secret',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }, {
      id: 'folder_id',
      label: 'Folder ID',
      type: 'text',
      placeholder: 'Enter folder ID',
      required: false
    }]
  }, {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Connect to your Dropbox for file synchronization',
    icon: Cloud,
    isConnected: false,
    fields: [{
      id: 'access_token',
      label: 'Access Token',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }, {
      id: 'folder_path',
      label: 'Folder Path',
      type: 'text',
      placeholder: '/Documents',
      required: false
    }]
  }],
  enterprise: [{
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Connect to your Salesforce CRM for customer data',
    icon: Briefcase,
    isConnected: true,
    fields: [{
      id: 'instance_url',
      label: 'Instance URL',
      type: 'text',
      placeholder: 'https://yourinstance.salesforce.com',
      required: true
    }, {
      id: 'client_id',
      label: 'Client ID',
      type: 'text',
      placeholder: 'Enter your client ID',
      required: true
    }, {
      id: 'client_secret',
      label: 'Client Secret',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }, {
      id: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'user@example.com',
      required: true
    }, {
      id: 'password',
      label: 'Password',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }, {
      id: 'security_token',
      label: 'Security Token',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }]
  }, {
    id: 'sap',
    name: 'SAP',
    description: 'Connect to your SAP enterprise system',
    icon: BarChart,
    isConnected: false,
    fields: [{
      id: 'host',
      label: 'SAP Host',
      type: 'text',
      placeholder: 'sap.example.com',
      required: true
    }, {
      id: 'system_number',
      label: 'System Number',
      type: 'text',
      placeholder: '00',
      required: true
    }, {
      id: 'client',
      label: 'Client',
      type: 'text',
      placeholder: '100',
      required: true
    }, {
      id: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Enter your username',
      required: true
    }, {
      id: 'password',
      label: 'Password',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }]
  }, {
    id: 'servicenow',
    name: 'ServiceNow',
    description: 'Connect to your ServiceNow instance for ITSM data',
    icon: Shield,
    isConnected: false,
    fields: [{
      id: 'instance_url',
      label: 'ServiceNow Instance URL',
      type: 'text',
      placeholder: 'https://your-instance.service-now.com',
      required: true
    }, {
      id: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Enter your username',
      required: true
    }, {
      id: 'password',
      label: 'Password',
      type: 'password',
      placeholder: '••••••••',
      required: true
    }, {
      id: 'table',
      label: 'Table Name',
      type: 'text',
      placeholder: 'incident, change_request, etc.',
      required: false
    }]
  }]
};

// Flatten all data sources for backward compatibility
const dataSources: DataSourceType[] = [...dataSourceCategories.api, ...dataSourceCategories.web, ...dataSourceCategories.warehouses, ...dataSourceCategories.databases, ...dataSourceCategories.lakes, ...dataSourceCategories.repositories, ...dataSourceCategories.enterprise];
const DataSourceSettings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [connectedSources, setConnectedSources] = useState<Record<string, boolean>>(dataSources.reduce((acc, source) => ({
    ...acc,
    [source.id]: source.isConnected
  }), {}));
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  const [connectingSource, setConnectingSource] = useState<string | null>(null);
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(true);

  // Auto-expand first data source for quick setup
  useEffect(() => {
    const firstUnconnectedSource = dataSources.find(source => !connectedSources[source.id]);
    if (firstUnconnectedSource && showWelcomeDialog) {
      setExpandedSource(firstUnconnectedSource.id);
    }
  }, [connectedSources, showWelcomeDialog]);

  // Filter data sources based on search query and category
  const getFilteredDataSources = () => {
    let sources = dataSources;

    // Filter by category
    if (selectedCategory !== 'all') {
      sources = dataSourceCategories[selectedCategory as keyof typeof dataSourceCategories] || [];
    }

    // Filter by search query
    if (searchQuery.trim()) {
      sources = sources.filter(source => source.name.toLowerCase().includes(searchQuery.toLowerCase()) || source.description.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return sources;
  };
  const filteredDataSources = getFilteredDataSources();
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
      setConnectedSources(prev => ({
        ...prev,
        [sourceId]: true
      }));
      toast.success(`Connected to ${dataSources.find(s => s.id === sourceId)?.name}`);
      setExpandedSource(null);
      setConnectingSource(null);
      setConnectionProgress(0);
    }, 2000);
  };
  const handleDisconnect = (sourceId: string) => {
    setConnectedSources(prev => ({
      ...prev,
      [sourceId]: false
    }));
    toast.success(`Disconnected from ${dataSources.find(s => s.id === sourceId)?.name}`);
  };
  const toggleExpanded = (sourceId: string) => {
    setExpandedSource(expandedSource === sourceId ? null : sourceId);
  };
  return <>
      {/* Welcome Dialog */}
      <Dialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        
      </Dialog>

    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Data Sources</h2>
          <Badge variant="outline" className="px-4 py-2 text-base bg-blue-50 text-blue-700 border-blue-200 font-medium">
            {Object.values(connectedSources).filter(Boolean).length} Connected
          </Badge>
        </div>
        <p className="text-gray-600 text-base leading-relaxed">
          Connect your external data sources to enhance your queries with relevant information from your organization's systems.
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="space-y-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Filter by Category</label>
            <div className="flex flex-wrap gap-2">
              <Button variant={selectedCategory === 'all' ? 'default' : 'outline'} size="sm" className={selectedCategory === 'all' ? 'bg-[#4E50A8] text-white' : 'text-gray-600 hover:bg-gray-50'} onClick={() => setSelectedCategory('all')}>
                All Sources
              </Button>
              <Button variant={selectedCategory === 'api' ? 'default' : 'outline'} size="sm" className={selectedCategory === 'api' ? 'bg-[#4E50A8] text-white' : 'text-gray-600 hover:bg-gray-50'} onClick={() => setSelectedCategory('api')}>
                API Configuration
              </Button>
              <Button variant={selectedCategory === 'web' ? 'default' : 'outline'} size="sm" className={selectedCategory === 'web' ? 'bg-[#4E50A8] text-white' : 'text-gray-600 hover:bg-gray-50'} onClick={() => setSelectedCategory('web')}>
                Web Sources
              </Button>
              <Button variant={selectedCategory === 'warehouses' ? 'default' : 'outline'} size="sm" className={selectedCategory === 'warehouses' ? 'bg-[#4E50A8] text-white' : 'text-gray-600 hover:bg-gray-50'} onClick={() => setSelectedCategory('warehouses')}>
                Data Warehouses
              </Button>
              <Button variant={selectedCategory === 'databases' ? 'default' : 'outline'} size="sm" className={selectedCategory === 'databases' ? 'bg-[#4E50A8] text-white' : 'text-gray-600 hover:bg-gray-50'} onClick={() => setSelectedCategory('databases')}>
                Databases
              </Button>
              <Button variant={selectedCategory === 'lakes' ? 'default' : 'outline'} size="sm" className={selectedCategory === 'lakes' ? 'bg-[#4E50A8] text-white' : 'text-gray-600 hover:bg-gray-50'} onClick={() => setSelectedCategory('lakes')}>
                Data Lakes
              </Button>
              <Button variant={selectedCategory === 'repositories' ? 'default' : 'outline'} size="sm" className={selectedCategory === 'repositories' ? 'bg-[#4E50A8] text-white' : 'text-gray-600 hover:bg-gray-50'} onClick={() => setSelectedCategory('repositories')}>
                Repositories
              </Button>
              <Button variant={selectedCategory === 'enterprise' ? 'default' : 'outline'} size="sm" className={selectedCategory === 'enterprise' ? 'bg-[#4E50A8] text-white' : 'text-gray-600 hover:bg-gray-50'} onClick={() => setSelectedCategory('enterprise')}>
                Enterprise
              </Button>
            </div>
          </div>

          {/* Search Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Search Data Sources</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input type="text" placeholder="Search by name or description..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-base" />
            </div>
          </div>
        </div>
      </div>

      {/* No Results Message */}
      {(searchQuery || selectedCategory !== 'all') && filteredDataSources.length === 0 && <div className="bg-white rounded-xl border border-gray-200 p-16 shadow-sm">
          <div className="text-center text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-6 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No data sources found</h3>
            <p className="text-base">
              {searchQuery ? `No data sources match "${searchQuery}" in the ${selectedCategory === 'all' ? 'all categories' : selectedCategory + ' category'}.` : `No data sources available in the ${selectedCategory} category.`}
            </p>
          </div>
        </div>}
      
      {/* Data Sources List */}
      <div className="space-y-6">
        {filteredDataSources.map(source => <div key={source.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Main Row */}
            <div className="flex items-center justify-between p-8 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => !connectedSources[source.id] && toggleExpanded(source.id)}>
              <div className="flex items-center gap-6">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <source.icon className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">
                    {source.name}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {source.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                {connectedSources[source.id] ? <div className="flex items-center gap-4">
                    <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50 text-base px-4 py-2 font-medium">
                      Connected
                    </Badge>
                    <ChevronDown className={`h-5 w-5 text-gray-400 cursor-pointer transition-transform hover:text-gray-600 ${expandedSource === source.id ? 'rotate-180' : ''}`} onClick={e => {
                  e.stopPropagation();
                  toggleExpanded(source.id);
                }} />
                  </div> : connectingSource === source.id ? <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-base px-4 py-2 font-medium">
                    Connecting...
                  </Badge> : <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-gray-500 text-base px-4 py-2 border-gray-300 font-medium">
                      Not Connected
                    </Badge>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform hover:text-gray-600 ${expandedSource === source.id ? 'rotate-180' : ''}`} />
                  </div>}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedSource === source.id && <div className="border-t border-gray-100 bg-gray-50">
                <div className="p-5">
                  {connectingSource === source.id ? <div className="space-y-4">
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
                    </div> : connectedSources[source.id] ? <div className="space-y-4">
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
                        <Button variant="secondary" onClick={() => handleDisconnect(source.id)}>
                          Disconnect
                        </Button>
                      </div>
                    </div> : <div className="bg-white rounded-lg border border-gray-200 p-5">
                      <form className="space-y-4">
                        {source.fields.map(field => <div key={field.id} className="space-y-2">
                            <label htmlFor={`${source.id}-${field.id}`} className="block text-sm font-medium text-gray-700">
                              {field.label} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            {field.type === 'textarea' ? (
                              <textarea
                                id={`${source.id}-${field.id}`}
                                placeholder={field.placeholder}
                                required={field.required}
                                className="w-full min-h-[60px] px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                                rows={3}
                              />
                            ) : (
                              <Input id={`${source.id}-${field.id}`} type={field.type} placeholder={field.placeholder} required={field.required} className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500" />
                            )}
                          </div>)}
                        <div className="pt-3 border-t border-gray-100">
                          <Button type="button" onClick={() => handleConnect(source.id)} disabled={connectingSource !== null} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {connectingSource === source.id ? <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Connecting...
                              </> : `Connect to ${source.name}`}
                          </Button>
                        </div>
                      </form>
                    </div>}
                </div>
              </div>}
          </div>)}
      </div>
    </div>
    </>;
};
export default DataSourceSettings;
