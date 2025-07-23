import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  FileSpreadsheet, Database, Globe, Youtube, BarChart, LucideIcon, 
  Briefcase, Search, Loader2, Server, Cloud, ChevronDown, Rocket, 
  Sparkles, Warehouse, HardDrive, FolderOpen, Share2, MessageSquare, 
  Plus, X, Settings, CheckCircle, AlertCircle, ExternalLink, Shield,
  Zap, Users, Activity
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DataSourceType {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  isConnected: boolean;
  category: string;
  fields: { id: string; label: string; type: string; placeholder: string; required: boolean }[];
  popularity?: 'high' | 'medium' | 'low';
}

interface SocialPlatform {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  fields: { id: string; label: string; type: string; placeholder: string; required: boolean }[];
}

// Enhanced data sources with enterprise focus
const dataSourcesConfig = {
  warehouses: [
    {
      id: 'snowflake',
      name: 'Snowflake',
      description: 'Cloud data platform for analytics and data warehousing',
      icon: Cloud,
      isConnected: true,
      category: 'warehouses',
      popularity: 'high' as const,
      fields: [
        { id: 'account', label: 'Account Identifier', type: 'text', placeholder: 'xy12345.snowflakecomputing.com', required: true },
        { id: 'username', label: 'Username', type: 'text', placeholder: 'your.email@company.com', required: true },
        { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true },
        { id: 'warehouse', label: 'Warehouse', type: 'text', placeholder: 'COMPUTE_WH', required: true },
        { id: 'database', label: 'Database', type: 'text', placeholder: 'PROD_DB', required: true },
        { id: 'schema', label: 'Schema', type: 'text', placeholder: 'PUBLIC', required: false },
      ]
    },
    {
      id: 'databricks',
      name: 'Databricks',
      description: 'Unified analytics platform for big data and machine learning',
      icon: Warehouse,
      isConnected: false,
      category: 'warehouses',
      popularity: 'high' as const,
      fields: [
        { id: 'workspace_url', label: 'Workspace URL', type: 'text', placeholder: 'https://dbc-12345678-90ab.cloud.databricks.com', required: true },
        { id: 'token', label: 'Personal Access Token', type: 'password', placeholder: 'dapi••••••••••••••••', required: true },
        { id: 'cluster_id', label: 'Cluster ID', type: 'text', placeholder: '1234-567890-abc123', required: true },
        { id: 'http_path', label: 'HTTP Path', type: 'text', placeholder: '/sql/1.0/warehouses/abc123def456', required: false },
      ]
    },
    {
      id: 'redshift',
      name: 'Amazon Redshift',
      description: 'Fast, simple, cost-effective data warehousing',
      icon: Database,
      isConnected: false,
      category: 'warehouses',
      popularity: 'high' as const,
      fields: [
        { id: 'host', label: 'Cluster Endpoint', type: 'text', placeholder: 'redshift-cluster.abc123.us-west-2.redshift.amazonaws.com', required: true },
        { id: 'port', label: 'Port', type: 'text', placeholder: '5439', required: true },
        { id: 'database', label: 'Database', type: 'text', placeholder: 'prod', required: true },
        { id: 'username', label: 'Username', type: 'text', placeholder: 'admin', required: true },
        { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true },
      ]
    }
  ],
  databases: [
    {
      id: 'postgresql',
      name: 'PostgreSQL',
      description: 'Advanced open source relational database',
      icon: Database,
      isConnected: false,
      category: 'databases',
      popularity: 'high' as const,
      fields: [
        { id: 'host', label: 'Host', type: 'text', placeholder: 'db.company.com', required: true },
        { id: 'port', label: 'Port', type: 'text', placeholder: '5432', required: true },
        { id: 'database', label: 'Database Name', type: 'text', placeholder: 'production', required: true },
        { id: 'username', label: 'Username', type: 'text', placeholder: 'dbuser', required: true },
        { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true },
        { id: 'ssl_mode', label: 'SSL Mode', type: 'text', placeholder: 'require', required: false },
      ]
    },
    {
      id: 'mysql',
      name: 'MySQL',
      description: 'World\'s most popular open source database',
      icon: Database,
      isConnected: false,
      category: 'databases',
      popularity: 'high' as const,
      fields: [
        { id: 'host', label: 'Host', type: 'text', placeholder: 'mysql.company.com', required: true },
        { id: 'port', label: 'Port', type: 'text', placeholder: '3306', required: true },
        { id: 'database', label: 'Database Name', type: 'text', placeholder: 'app_production', required: true },
        { id: 'username', label: 'Username', type: 'text', placeholder: 'app_user', required: true },
        { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true },
      ]
    },
    {
      id: 'sqlserver',
      name: 'SQL Server',
      description: 'Microsoft SQL Server database management system',
      icon: Database,
      isConnected: false,
      category: 'databases',
      popularity: 'medium' as const,
      fields: [
        { id: 'server', label: 'Server', type: 'text', placeholder: 'sql.company.com', required: true },
        { id: 'port', label: 'Port', type: 'text', placeholder: '1433', required: true },
        { id: 'database', label: 'Database Name', type: 'text', placeholder: 'ProductionDB', required: true },
        { id: 'username', label: 'Username', type: 'text', placeholder: 'sa', required: true },
        { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true },
      ]
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      description: 'Document-based NoSQL database',
      icon: Database,
      isConnected: false,
      category: 'databases',
      popularity: 'medium' as const,
      fields: [
        { id: 'connection_string', label: 'Connection String', type: 'text', placeholder: 'mongodb+srv://user:pass@cluster.mongodb.net/dbname', required: true },
        { id: 'database', label: 'Database Name', type: 'text', placeholder: 'production', required: true },
        { id: 'collection', label: 'Default Collection', type: 'text', placeholder: 'users', required: false },
      ]
    }
  ],
  datalakes: [
    {
      id: 'adls',
      name: 'Azure Data Lake Storage',
      description: 'Scalable data lake solution for big data analytics',
      icon: HardDrive,
      isConnected: false,
      category: 'datalakes',
      popularity: 'high' as const,
      fields: [
        { id: 'account_name', label: 'Storage Account Name', type: 'text', placeholder: 'companydatalake', required: true },
        { id: 'container', label: 'Container Name', type: 'text', placeholder: 'raw-data', required: true },
        { id: 'access_key', label: 'Access Key', type: 'password', placeholder: '••••••••', required: true },
        { id: 'tenant_id', label: 'Tenant ID', type: 'text', placeholder: 'abc123-def456-ghi789', required: false },
      ]
    },
    {
      id: 'amazons3',
      name: 'Amazon S3',
      description: 'Object storage built to store and retrieve any amount of data',
      icon: HardDrive,
      isConnected: false,
      category: 'datalakes',
      popularity: 'high' as const,
      fields: [
        { id: 'bucket_name', label: 'Bucket Name', type: 'text', placeholder: 'company-data-lake', required: true },
        { id: 'region', label: 'Region', type: 'text', placeholder: 'us-east-1', required: true },
        { id: 'access_key', label: 'Access Key ID', type: 'text', placeholder: 'AKIA••••••••••••••••', required: true },
        { id: 'secret_key', label: 'Secret Access Key', type: 'password', placeholder: '••••••••', required: true },
        { id: 'prefix', label: 'Path Prefix', type: 'text', placeholder: 'data/', required: false },
      ]
    },
    {
      id: 'gcs',
      name: 'Google Cloud Storage',
      description: 'Unified object storage for developers and enterprises',
      icon: HardDrive,
      isConnected: false,
      category: 'datalakes',
      popularity: 'medium' as const,
      fields: [
        { id: 'bucket_name', label: 'Bucket Name', type: 'text', placeholder: 'company-datalake', required: true },
        { id: 'project_id', label: 'Project ID', type: 'text', placeholder: 'my-project-123456', required: true },
        { id: 'service_account_key', label: 'Service Account Key (JSON)', type: 'password', placeholder: 'Paste your service account key JSON', required: true },
      ]
    }
  ],
  repositories: [
    {
      id: 'sharepoint',
      name: 'SharePoint',
      description: 'Microsoft collaboration platform and document management',
      icon: FileSpreadsheet,
      isConnected: false,
      category: 'repositories',
      popularity: 'high' as const,
      fields: [
        { id: 'tenant_url', label: 'SharePoint Tenant URL', type: 'text', placeholder: 'https://company.sharepoint.com', required: true },
        { id: 'site_url', label: 'Site URL', type: 'text', placeholder: '/sites/yoursite', required: true },
        { id: 'client_id', label: 'Client ID', type: 'text', placeholder: 'abc123-def456-ghi789', required: true },
        { id: 'client_secret', label: 'Client Secret', type: 'password', placeholder: '••••••••', required: true },
      ]
    },
    {
      id: 'onedrive',
      name: 'OneDrive for Business',
      description: 'Cloud storage and file sharing service',
      icon: FolderOpen,
      isConnected: false,
      category: 'repositories',
      popularity: 'high' as const,
      fields: [
        { id: 'tenant_id', label: 'Tenant ID', type: 'text', placeholder: 'abc123-def456-ghi789', required: true },
        { id: 'client_id', label: 'Application ID', type: 'text', placeholder: 'abc123-def456-ghi789', required: true },
        { id: 'client_secret', label: 'Client Secret', type: 'password', placeholder: '••••••••', required: true },
      ]
    },
    {
      id: 'googledrive',
      name: 'Google Drive',
      description: 'Cloud storage and collaboration platform',
      icon: FolderOpen,
      isConnected: false,
      category: 'repositories',
      popularity: 'medium' as const,
      fields: [
        { id: 'service_account_key', label: 'Service Account Key (JSON)', type: 'password', placeholder: 'Paste your service account key JSON', required: true },
        { id: 'folder_id', label: 'Folder ID (Optional)', type: 'text', placeholder: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms', required: false },
      ]
    },
    {
      id: 'documentlibrary',
      name: 'Local Document Library',
      description: 'Connect to local or network file systems',
      icon: FolderOpen,
      isConnected: false,
      category: 'repositories',
      popularity: 'low' as const,
      fields: [
        { id: 'folder_path', label: 'Folder Path', type: 'text', placeholder: '/mnt/company-docs', required: true },
        { id: 'file_types', label: 'File Types', type: 'text', placeholder: 'pdf,docx,txt,xlsx,pptx', required: false },
        { id: 'recursive', label: 'Include Subfolders', type: 'checkbox', placeholder: '', required: false },
      ]
    }
  ],
  enterprise: [
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Customer relationship management platform',
      icon: Briefcase,
      isConnected: true,
      category: 'enterprise',
      popularity: 'high' as const,
      fields: [
        { id: 'instance_url', label: 'Instance URL', type: 'text', placeholder: 'https://company.salesforce.com', required: true },
        { id: 'username', label: 'Username', type: 'text', placeholder: 'admin@company.com', required: true },
        { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true },
        { id: 'security_token', label: 'Security Token', type: 'password', placeholder: '••••••••', required: true },
        { id: 'api_version', label: 'API Version', type: 'text', placeholder: '58.0', required: false },
      ]
    },
    {
      id: 'sap',
      name: 'SAP',
      description: 'Enterprise resource planning software',
      icon: BarChart,
      isConnected: false,
      category: 'enterprise',
      popularity: 'medium' as const,
      fields: [
        { id: 'server_host', label: 'SAP Server Host', type: 'text', placeholder: 'sap.company.com', required: true },
        { id: 'system_number', label: 'System Number', type: 'text', placeholder: '00', required: true },
        { id: 'client', label: 'Client', type: 'text', placeholder: '100', required: true },
        { id: 'username', label: 'Username', type: 'text', placeholder: 'sapuser', required: true },
        { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true },
      ]
    },
    {
      id: 'servicenow',
      name: 'ServiceNow',
      description: 'Cloud computing platform for digital workflows',
      icon: Server,
      isConnected: false,
      category: 'enterprise',
      popularity: 'medium' as const,
      fields: [
        { id: 'instance_url', label: 'ServiceNow Instance URL', type: 'text', placeholder: 'https://dev12345.service-now.com', required: true },
        { id: 'username', label: 'Username', type: 'text', placeholder: 'admin', required: true },
        { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true },
        { id: 'table_filter', label: 'Table Filter', type: 'text', placeholder: 'incident,change_request,problem', required: false },
      ]
    }
  ]
};

// Social media platforms with enterprise focus
const socialMediaPlatforms: SocialPlatform[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Users,
    description: 'Professional networking platform',
    fields: [
      { id: 'client_id', label: 'Client ID', type: 'text', placeholder: 'Enter your LinkedIn app client ID', required: true },
      { id: 'client_secret', label: 'Client Secret', type: 'password', placeholder: '••••••••', required: true },
      { id: 'access_token', label: 'Access Token', type: 'password', placeholder: '••••••••', required: true },
    ]
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: MessageSquare,
    description: 'Real-time information and opinion sharing',
    fields: [
      { id: 'api_key', label: 'API Key', type: 'text', placeholder: 'Enter your Twitter API key', required: true },
      { id: 'api_secret', label: 'API Secret', type: 'password', placeholder: '••••••••', required: true },
      { id: 'access_token', label: 'Access Token', type: 'password', placeholder: '••••••••', required: true },
      { id: 'access_token_secret', label: 'Access Token Secret', type: 'password', placeholder: '••••••••', required: true },
    ]
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: MessageSquare,
    description: 'Social networking platform',
    fields: [
      { id: 'app_id', label: 'App ID', type: 'text', placeholder: 'Enter your Facebook app ID', required: true },
      { id: 'app_secret', label: 'App Secret', type: 'password', placeholder: '••••••••', required: true },
      { id: 'access_token', label: 'Page Access Token', type: 'password', placeholder: '••••••••', required: true },
    ]
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: MessageSquare,
    description: 'Photo and video sharing platform',
    fields: [
      { id: 'access_token', label: 'Access Token', type: 'password', placeholder: '••••••••', required: true },
      { id: 'business_account_id', label: 'Business Account ID', type: 'text', placeholder: 'Enter your Instagram business account ID', required: true },
    ]
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: MessageSquare,
    description: 'Short-form video hosting service',
    fields: [
      { id: 'client_key', label: 'Client Key', type: 'text', placeholder: 'Enter your TikTok client key', required: true },
      { id: 'client_secret', label: 'Client Secret', type: 'password', placeholder: '••••••••', required: true },
    ]
  },
  {
    id: 'reddit',
    name: 'Reddit',
    icon: MessageSquare,
    description: 'Social news aggregation platform',
    fields: [
      { id: 'client_id', label: 'Client ID', type: 'text', placeholder: 'Enter your Reddit app client ID', required: true },
      { id: 'client_secret', label: 'Client Secret', type: 'password', placeholder: '••••••••', required: true },
      { id: 'user_agent', label: 'User Agent', type: 'text', placeholder: 'YourApp/1.0 by YourUsername', required: true },
    ]
  }
];

// Special YouTube configuration
const youtubeConfig = {
  id: 'youtube',
  name: 'YouTube',
  description: 'Video sharing and discovery platform',
  icon: Youtube,
  isConnected: false,
  category: 'websources',
  fields: [
    { id: 'api_key', label: 'YouTube Data API Key', type: 'password', placeholder: '••••••••', required: true },
    { id: 'channel_id', label: 'Channel ID (Optional)', type: 'text', placeholder: 'UCxxxxxxxxxxxxxxx', required: false },
    { id: 'playlist_ids', label: 'Playlist IDs', type: 'text', placeholder: 'PLxxxxxxx,PLyyyyyyy (comma-separated)', required: false },
    { id: 'video_ids', label: 'Specific Video IDs', type: 'text', placeholder: 'dQw4w9WgXcQ,jNQXAC9IVRw (comma-separated)', required: false },
  ]
};

// Website sources
const websiteConfig = {
  id: 'website',
  name: 'Website Content',
  description: 'Web scraping and API integration',
  icon: Globe,
  isConnected: false,
  category: 'websources',
  fields: [
    { id: 'url', label: 'Website URL', type: 'text', placeholder: 'https://www.company.com', required: true },
    { id: 'api_endpoint', label: 'API Endpoint (Optional)', type: 'text', placeholder: 'https://api.company.com/v1', required: false },
    { id: 'api_key', label: 'API Key (Optional)', type: 'password', placeholder: '••••••••', required: false },
    { id: 'crawl_depth', label: 'Crawl Depth', type: 'text', placeholder: '3', required: false },
    { id: 'content_types', label: 'Content Types', type: 'text', placeholder: 'articles,products,news', required: false },
  ]
};

const DataSourceSettings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [connectedSources, setConnectedSources] = useState<Record<string, boolean>>({});
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  const [connectingSource, setConnectingSource] = useState<string | null>(null);
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [connectedSocialPlatforms, setConnectedSocialPlatforms] = useState<string[]>([]);
  const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<string>('');
  const [socialPlatformConfig, setSocialPlatformConfig] = useState<string | null>(null);

  // Initialize connected sources
  useEffect(() => {
    const initialConnections: Record<string, boolean> = {};
    Object.values(dataSourcesConfig).flat().forEach(source => {
      initialConnections[source.id] = source.isConnected;
    });
    initialConnections['youtube'] = youtubeConfig.isConnected;
    initialConnections['website'] = websiteConfig.isConnected;
    setConnectedSources(initialConnections);
  }, []);

  // Get all data sources
  const getAllDataSources = () => {
    return [
      ...Object.values(dataSourcesConfig).flat(),
      youtubeConfig,
      websiteConfig
    ];
  };

  // Filter data sources
  const getFilteredDataSources = () => {
    let sources = getAllDataSources();
    
    if (selectedCategory !== 'all') {
      sources = sources.filter(source => source.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      sources = sources.filter(source =>
        source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        source.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return sources;
  };

  const handleConnect = async (sourceId: string) => {
    setConnectingSource(sourceId);
    setConnectionProgress(0);
    
    const progressInterval = setInterval(() => {
      setConnectionProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(progressInterval);
      setConnectedSources(prev => ({...prev, [sourceId]: true}));
      const sourceName = getAllDataSources().find(s => s.id === sourceId)?.name || 'Source';
      toast.success(`Successfully connected to ${sourceName}`);
      setExpandedSource(null);
      setConnectingSource(null);
      setConnectionProgress(0);
    }, 1500);
  };

  const handleDisconnect = (sourceId: string) => {
    setConnectedSources(prev => ({...prev, [sourceId]: false}));
    const sourceName = getAllDataSources().find(s => s.id === sourceId)?.name || 'Source';
    toast.success(`Disconnected from ${sourceName}`);
  };

  const toggleExpanded = (sourceId: string) => {
    setExpandedSource(expandedSource === sourceId ? null : sourceId);
  };

  const addSocialPlatform = () => {
    if (selectedSocialPlatform && !connectedSocialPlatforms.includes(selectedSocialPlatform)) {
      setSocialPlatformConfig(selectedSocialPlatform);
    }
  };

  const connectSocialPlatform = (platformId: string) => {
    setConnectedSocialPlatforms(prev => [...prev, platformId]);
    setSocialPlatformConfig(null);
    setSelectedSocialPlatform('');
    const platformName = socialMediaPlatforms.find(p => p.id === platformId)?.name || 'Platform';
    toast.success(`Connected to ${platformName}`);
  };

  const removeSocialPlatform = (platformId: string) => {
    setConnectedSocialPlatforms(prev => prev.filter(id => id !== platformId));
    const platformName = socialMediaPlatforms.find(p => p.id === platformId)?.name || 'Platform';
    toast.success(`Disconnected from ${platformName}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'warehouses': return Warehouse;
      case 'databases': return Database;
      case 'datalakes': return HardDrive;
      case 'repositories': return FolderOpen;
      case 'websources': return Globe;
      case 'enterprise': return Briefcase;
      default: return Database;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'warehouses': return 'Data Warehouses';
      case 'databases': return 'Databases';
      case 'datalakes': return 'Data Lakes';
      case 'repositories': return 'File Repositories';
      case 'websources': return 'Web Sources';
      case 'enterprise': return 'Enterprise Applications';
      default: return 'Other';
    }
  };

  const renderDataSourceCard = (source: DataSourceType) => {
    const isConnected = connectedSources[source.id];
    const isExpanded = expandedSource === source.id;
    const isConnecting = connectingSource === source.id;
    const IconComponent = source.icon;

    return (
      <Card key={source.id} className={`transition-all duration-200 hover:shadow-md ${
        isConnected ? 'border-emerald-200 bg-emerald-50/50' : 'border-border bg-card'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${
                isConnected ? 'bg-emerald-100' : 'bg-muted'
              }`}>
                <IconComponent className={`h-5 w-5 ${
                  isConnected ? 'text-emerald-600' : 'text-muted-foreground'
                }`} />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">{source.name}</CardTitle>
                <CardDescription className="text-sm mt-1">{source.description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {source.popularity === 'high' && (
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                  Popular
                </Badge>
              )}
              {isConnected && (
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex gap-2">
            {isConnected ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleExpanded(source.id)}
                  className="flex-1"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {isExpanded ? 'Hide Settings' : 'Configure'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDisconnect(source.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                onClick={() => toggleExpanded(source.id)}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={isConnecting}
              >
                {isExpanded ? 'Cancel' : 'Connect'}
              </Button>
            )}
          </div>

          {/* Connection Form */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t space-y-4">
              <div className="grid gap-4">
                {source.fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id} className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    <Input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      className="text-sm"
                    />
                  </div>
                ))}
              </div>
              
              {isConnecting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Establishing connection...</span>
                    <span className="text-muted-foreground">{connectionProgress}%</span>
                  </div>
                  <Progress value={connectionProgress} className="h-2" />
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleConnect(source.id)}
                  disabled={isConnecting}
                  size="sm"
                  className="flex-1"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Connect
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setExpandedSource(null)}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const connectedCount = Object.values(connectedSources).filter(Boolean).length + connectedSocialPlatforms.length;
  const totalCount = getAllDataSources().length + socialMediaPlatforms.length;

  return (
    <div className="space-y-6 p-6 bg-background min-h-screen">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">Data Source Integrations</CardTitle>
              <CardDescription className="text-base">
                Connect your enterprise data sources to enable AI-powered insights and analytics
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{connectedCount}</div>
                <div className="text-sm text-muted-foreground">of {totalCount} connected</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="warehouses">Data Warehouses</SelectItem>
                <SelectItem value="databases">Databases</SelectItem>
                <SelectItem value="datalakes">Data Lakes</SelectItem>
                <SelectItem value="repositories">File Repositories</SelectItem>
                <SelectItem value="websources">Web Sources</SelectItem>
                <SelectItem value="enterprise">Enterprise Apps</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources by Category */}
      <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="databases">Databases</TabsTrigger>
          <TabsTrigger value="datalakes">Data Lakes</TabsTrigger>
          <TabsTrigger value="repositories">Files</TabsTrigger>
          <TabsTrigger value="websources">Web</TabsTrigger>
          <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {Object.entries(dataSourcesConfig).map(([categoryKey, sources]) => (
            <Card key={categoryKey}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {React.createElement(getCategoryIcon(categoryKey), { className: "h-5 w-5" })}
                  {getCategoryName(categoryKey)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sources.map(renderDataSourceCard)}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Web Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Web Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Social Media Platforms */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Social Media Platforms</h3>
                
                {/* Connected Platforms */}
                {connectedSocialPlatforms.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Connected Platforms</Label>
                    <div className="flex flex-wrap gap-2">
                      {connectedSocialPlatforms.map((platformId) => {
                        const platform = socialMediaPlatforms.find(p => p.id === platformId);
                        return platform ? (
                          <Badge key={platformId} variant="secondary" className="flex items-center gap-2">
                            <platform.icon className="h-3 w-3" />
                            {platform.name}
                            <button
                              onClick={() => removeSocialPlatform(platformId)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Add New Platform */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1 space-y-2">
                    <Label className="text-sm font-medium">Add Social Media Platform</Label>
                    <Select value={selectedSocialPlatform} onValueChange={setSelectedSocialPlatform}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a platform to connect" />
                      </SelectTrigger>
                      <SelectContent>
                        {socialMediaPlatforms
                          .filter(p => !connectedSocialPlatforms.includes(p.id))
                          .map((platform) => (
                            <SelectItem key={platform.id} value={platform.id}>
                              <div className="flex items-center gap-2">
                                <platform.icon className="h-4 w-4" />
                                {platform.name}
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={addSocialPlatform}
                    disabled={!selectedSocialPlatform}
                  >
                    Connect
                  </Button>
                </div>

                {/* Social Platform Configuration Dialog */}
                {socialPlatformConfig && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-base">
                        Configure {socialMediaPlatforms.find(p => p.id === socialPlatformConfig)?.name}
                      </CardTitle>
                      <CardDescription>
                        {socialMediaPlatforms.find(p => p.id === socialPlatformConfig)?.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {socialMediaPlatforms.find(p => p.id === socialPlatformConfig)?.fields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <Label htmlFor={field.id} className="text-sm font-medium">
                            {field.label}
                            {field.required && <span className="text-destructive ml-1">*</span>}
                          </Label>
                          <Input
                            id={field.id}
                            type={field.type}
                            placeholder={field.placeholder}
                            className="text-sm"
                          />
                        </div>
                      ))}
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => connectSocialPlatform(socialPlatformConfig)}
                          className="flex-1"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Connect Platform
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setSocialPlatformConfig(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* YouTube Integration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Video Content</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDataSourceCard(youtubeConfig)}
                </div>
              </div>

              {/* Website Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Website Content</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDataSourceCard(websiteConfig)}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Individual Category Tabs */}
        {Object.entries(dataSourcesConfig).map(([categoryKey, sources]) => (
          <TabsContent key={categoryKey} value={categoryKey}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {React.createElement(getCategoryIcon(categoryKey), { className: "h-5 w-5" })}
                  {getCategoryName(categoryKey)}
                </CardTitle>
                <CardDescription>
                  Connect to your {getCategoryName(categoryKey).toLowerCase()} to unlock data-driven insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sources.map(renderDataSourceCard)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        {/* Web Sources Tab */}
        <TabsContent value="websources">
          <div className="space-y-6">
            {/* Social Media Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Social Media Platforms
                </CardTitle>
                <CardDescription>
                  Connect to social media platforms to analyze engagement and content performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Connected Platforms */}
                {connectedSocialPlatforms.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Connected Platforms</Label>
                    <div className="flex flex-wrap gap-2">
                      {connectedSocialPlatforms.map((platformId) => {
                        const platform = socialMediaPlatforms.find(p => p.id === platformId);
                        return platform ? (
                          <Badge key={platformId} variant="secondary" className="flex items-center gap-2">
                            <platform.icon className="h-3 w-3" />
                            {platform.name}
                            <button
                              onClick={() => removeSocialPlatform(platformId)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Add New Platform */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1 space-y-2">
                    <Label className="text-sm font-medium">Connect New Platform</Label>
                    <Select value={selectedSocialPlatform} onValueChange={setSelectedSocialPlatform}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a social media platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {socialMediaPlatforms
                          .filter(p => !connectedSocialPlatforms.includes(p.id))
                          .map((platform) => (
                            <SelectItem key={platform.id} value={platform.id}>
                              <div className="flex items-center gap-2">
                                <platform.icon className="h-4 w-4" />
                                {platform.name}
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={addSocialPlatform}
                    disabled={!selectedSocialPlatform}
                  >
                    Connect
                  </Button>
                </div>

                {/* Social Platform Configuration */}
                {socialPlatformConfig && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-base">
                        Configure {socialMediaPlatforms.find(p => p.id === socialPlatformConfig)?.name}
                      </CardTitle>
                      <CardDescription>
                        {socialMediaPlatforms.find(p => p.id === socialPlatformConfig)?.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {socialMediaPlatforms.find(p => p.id === socialPlatformConfig)?.fields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <Label htmlFor={field.id} className="text-sm font-medium">
                            {field.label}
                            {field.required && <span className="text-destructive ml-1">*</span>}
                          </Label>
                          <Input
                            id={field.id}
                            type={field.type}
                            placeholder={field.placeholder}
                          />
                        </div>
                      ))}
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => connectSocialPlatform(socialPlatformConfig)}
                          className="flex-1"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Connect Platform
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setSocialPlatformConfig(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* YouTube */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Youtube className="h-5 w-5" />
                  YouTube Integration
                </CardTitle>
                <CardDescription>
                  Connect to YouTube to analyze video content, comments, and engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDataSourceCard(youtubeConfig)}
                </div>
              </CardContent>
            </Card>

            {/* Website Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Website Content
                </CardTitle>
                <CardDescription>
                  Extract and analyze content from websites through web scraping or API integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDataSourceCard(websiteConfig)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataSourceSettings;