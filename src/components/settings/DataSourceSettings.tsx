
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeType, setYoutubeType] = useState('');

  const dataSourceCategories = [
    {
      id: 'social',
      title: 'Social Media',
      description: 'Connect your social media accounts',
      icon: Instagram,
      color: 'bg-gradient-to-br from-pink-500 to-rose-500',
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
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
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
      color: 'bg-gradient-to-br from-green-500 to-emerald-500',
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
      color: 'bg-gradient-to-br from-purple-500 to-violet-500',
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
      color: 'bg-gradient-to-br from-orange-500 to-amber-500',
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
      color: 'bg-gradient-to-br from-indigo-500 to-blue-500',
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
    return <IconComponent className="h-5 w-5" />;
  };

  const filteredSources = connectedSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || source.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Data Sources</h1>
        <p className="text-muted-foreground text-lg">Connect and manage your data sources</p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span>{connectedSources.length} sources connected</span>
        </div>
      </div>

      {/* Connected Sources Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Connected Sources</h2>
          <div className="flex items-center gap-3">
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
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Database className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No sources found</p>
              <p className="text-sm text-muted-foreground/75">Try adjusting your search or filter</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredSources.map((source) => (
              <Card key={source.id} className="group hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-muted rounded-xl">
                        {getSourceIcon(source.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{source.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="capitalize">{source.type}</span>
                          <span>•</span>
                          <span>{source.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600 font-medium">Connected</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveSource(source.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
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

      {/* Add New Sources Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-center">Add New Data Sources</h2>
        
        {/* Quick Add Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg">Website</h3>
                  <p className="text-sm text-muted-foreground font-normal">Connect any website URL</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
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

          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                  <Youtube className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg">YouTube</h3>
                  <p className="text-sm text-muted-foreground font-normal">Connect channels, playlists, or videos</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
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
            </CardContent>
          </Card>
        </div>

        {/* Data Source Categories */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dataSourceCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-3 ${category.color} rounded-xl`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg">{category.title}</h3>
                      <p className="text-sm text-muted-foreground font-normal">{category.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {category.sources.map((source) => (
                      <button
                        key={source.value}
                        onClick={() => handleAddSource(source.value, source.label, category.title)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left group"
                      >
                        <source.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium flex-1">{source.label}</span>
                        <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
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
