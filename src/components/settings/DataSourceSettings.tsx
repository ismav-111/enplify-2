
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Trash2, Globe, Youtube, Facebook, Twitter, Instagram, Linkedin, Database, Cloud, Server, FolderOpen, Building2, Search, Filter, CheckCircle2 } from 'lucide-react';

const DataSourceSettings = () => {
  const [connectedSources, setConnectedSources] = useState([
    { id: 1, type: 'website', name: 'company-website.com', status: 'connected', category: 'Web' },
    { id: 2, type: 'youtube', name: 'Company Channel', status: 'connected', category: 'Social' },
    { id: 3, type: 'facebook', name: 'Company Facebook', status: 'connected', category: 'Social' },
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [newWebsite, setNewWebsite] = useState('');
  const [selectedSocialMedia, setSelectedSocialMedia] = useState('');
  const [selectedDataWarehouse, setSelectedDataWarehouse] = useState('');
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [selectedDataLake, setSelectedDataLake] = useState('');
  const [selectedRepository, setSelectedRepository] = useState('');
  const [selectedEnterprise, setSelectedEnterprise] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeType, setYoutubeType] = useState('');

  const dataSourceCategories = [
    {
      id: 'social',
      title: 'Social Media',
      description: 'Connect your social media accounts',
      icon: Instagram,
      color: 'from-pink-500 to-rose-500',
      sources: [
        { value: 'facebook', label: 'Facebook', icon: Facebook },
        { value: 'twitter', label: 'Twitter', icon: Twitter },
        { value: 'instagram', label: 'Instagram', icon: Instagram },
        { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
      ]
    },
    {
      id: 'warehouse',
      title: 'Data Warehouses',
      description: 'Connect to your data warehouse',
      icon: Database,
      color: 'from-blue-500 to-cyan-500',
      sources: [
        { value: 'snowflake', label: 'Snowflake', icon: Database },
        { value: 'databricks', label: 'Databricks', icon: Database },
        { value: 'redshift', label: 'Amazon Redshift', icon: Database },
      ]
    },
    {
      id: 'database',
      title: 'Databases',
      description: 'Connect to your databases',
      icon: Server,
      color: 'from-green-500 to-emerald-500',
      sources: [
        { value: 'postgresql', label: 'PostgreSQL', icon: Server },
        { value: 'mysql', label: 'MySQL', icon: Server },
        { value: 'sqlserver', label: 'SQL Server', icon: Server },
        { value: 'mongodb', label: 'MongoDB', icon: Server },
      ]
    },
    {
      id: 'lake',
      title: 'Data Lakes',
      description: 'Connect to cloud storage',
      icon: Cloud,
      color: 'from-purple-500 to-violet-500',
      sources: [
        { value: 'adls', label: 'Azure Data Lake Storage', icon: Cloud },
        { value: 's3', label: 'Amazon S3', icon: Cloud },
        { value: 'gcs', label: 'Google Cloud Storage', icon: Cloud },
      ]
    },
    {
      id: 'repository',
      title: 'Repositories',
      description: 'Connect to document repositories',
      icon: FolderOpen,
      color: 'from-orange-500 to-amber-500',
      sources: [
        { value: 'sharepoint', label: 'SharePoint', icon: FolderOpen },
        { value: 'onedrive', label: 'OneDrive', icon: FolderOpen },
        { value: 'googledrive', label: 'Google Drive', icon: FolderOpen },
        { value: 'dropbox', label: 'Dropbox', icon: FolderOpen },
        { value: 'local', label: 'Document Library (Local)', icon: FolderOpen },
      ]
    },
    {
      id: 'enterprise',
      title: 'Enterprise Systems',
      description: 'Connect to enterprise platforms',
      icon: Building2,
      color: 'from-indigo-500 to-blue-500',
      sources: [
        { value: 'salesforce', label: 'Salesforce', icon: Building2 },
        { value: 'sap', label: 'SAP', icon: Building2 },
        { value: 'servicenow', label: 'ServiceNow', icon: Building2 },
      ]
    }
  ];

  const youtubeTypes = [
    { value: 'channel', label: 'Channel' },
    { value: 'playlist', label: 'Playlist' },
    { value: 'video', label: 'Video' },
  ];

  const handleAddSource = (type: string, name: string, category: string) => {
    const newSource = {
      id: Date.now(),
      type,
      name,
      status: 'connected',
      category
    };
    setConnectedSources([...connectedSources, newSource]);
    toast.success(`${name} connected successfully`);
  };

  const handleAddWebsite = () => {
    if (newWebsite.trim()) {
      handleAddSource('website', newWebsite, 'Web');
      setNewWebsite('');
    }
  };

  const handleAddYoutube = () => {
    if (youtubeUrl.trim() && youtubeType) {
      handleAddSource('youtube', `${youtubeType}: ${youtubeUrl}`, 'Social');
      setYoutubeUrl('');
      setYoutubeType('');
    }
  };

  const handleRemoveSource = (id: number) => {
    setConnectedSources(connectedSources.filter(source => source.id !== id));
    toast.success('Data source removed');
  };

  const getSourceIcon = (type: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      website: Globe,
      youtube: Youtube,
      facebook: Facebook,
      twitter: Twitter,
      instagram: Instagram,
      linkedin: Linkedin,
      snowflake: Database,
      databricks: Database,
      redshift: Database,
      postgresql: Server,
      mysql: Server,
      sqlserver: Server,
      mongodb: Server,
      adls: Cloud,
      s3: Cloud,
      gcs: Cloud,
      sharepoint: FolderOpen,
      onedrive: FolderOpen,
      googledrive: FolderOpen,
      dropbox: FolderOpen,
      local: FolderOpen,
      salesforce: Building2,
      sap: Building2,
      servicenow: Building2,
    };
    const IconComponent = iconMap[type] || Database;
    return <IconComponent className="h-4 w-4" />;
  };

  const filteredSources = connectedSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || source.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Data Sources</h2>
          <p className="text-muted-foreground">Connect and manage your data sources</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          {connectedSources.length} connected
        </div>
      </div>

      {/* Connected Sources */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Connected Sources</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="web">Web</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="cloud">Cloud</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredSources.length === 0 ? (
          <Card className="border-dashed border-2 border-muted-foreground/25">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Database className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No sources found</p>
              <p className="text-sm text-muted-foreground/75">Try adjusting your search or filter</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {filteredSources.map((source) => (
              <Card key={source.id} className="group hover:shadow-md transition-all duration-200 border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        {getSourceIcon(source.type)}
                      </div>
                      <div>
                        <p className="font-medium">{source.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="capitalize">{source.type}</span>
                          <span>•</span>
                          <span>{source.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-600 font-medium">Connected</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveSource(source.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add New Sources */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Add New Sources</h3>
        
        {/* Website & YouTube - Special Cases */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="group hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Website</h4>
                  <p className="text-sm text-muted-foreground">Connect any website URL</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com"
                  value={newWebsite}
                  onChange={(e) => setNewWebsite(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddWebsite} disabled={!newWebsite.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                  <Youtube className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">YouTube</h4>
                  <p className="text-sm text-muted-foreground">Connect channels, playlists, or videos</p>
                </div>
              </div>
              <div className="space-y-2">
                <Select value={youtubeType} onValueChange={setYoutubeType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {youtubeTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Input
                    placeholder="YouTube URL"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddYoutube} disabled={!youtubeUrl.trim() || !youtubeType}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Source Categories */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dataSourceCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.id} className="group hover:shadow-lg transition-all duration-200 border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 bg-gradient-to-r ${category.color} rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{category.title}</h4>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {category.sources.map((source) => (
                      <button
                        key={source.value}
                        onClick={() => handleAddSource(source.value, source.label, category.title)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                      >
                        <source.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{source.label}</span>
                        <Plus className="h-4 w-4 ml-auto text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DataSourceSettings;
