
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Trash2, Globe, Youtube, Facebook, Twitter, Instagram, Linkedin, Database, ExternalLink } from 'lucide-react';

const DataSourceSettings = () => {
  const [connectedSources, setConnectedSources] = useState([
    { id: 1, type: 'website', name: 'company-website.com', status: 'connected' },
    { id: 2, type: 'youtube', name: 'Company Channel', status: 'connected' },
    { id: 3, type: 'facebook', name: 'Company Facebook', status: 'connected' },
  ]);
  
  const [newWebsite, setNewWebsite] = useState('');
  const [selectedSocialMedia, setSelectedSocialMedia] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeType, setYoutubeType] = useState('');

  const socialMediaPlatforms = [
    { value: 'facebook', label: 'Facebook', icon: Facebook },
    { value: 'twitter', label: 'Twitter', icon: Twitter },
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { value: 'tiktok', label: 'TikTok', icon: Database },
    { value: 'pinterest', label: 'Pinterest', icon: Database },
  ];

  const youtubeTypes = [
    { value: 'channel', label: 'Channel' },
    { value: 'playlist', label: 'Playlist' },
    { value: 'video', label: 'Specific Video' },
  ];

  const handleAddWebsite = () => {
    if (newWebsite.trim()) {
      const newSource = {
        id: Date.now(),
        type: 'website',
        name: newWebsite,
        status: 'connected'
      };
      setConnectedSources([...connectedSources, newSource]);
      setNewWebsite('');
      toast.success('Website connected successfully');
    }
  };

  const handleAddSocialMedia = () => {
    if (selectedSocialMedia) {
      const platform = socialMediaPlatforms.find(p => p.value === selectedSocialMedia);
      const newSource = {
        id: Date.now(),
        type: selectedSocialMedia,
        name: platform?.label || selectedSocialMedia,
        status: 'connected'
      };
      setConnectedSources([...connectedSources, newSource]);
      setSelectedSocialMedia('');
      toast.success(`${platform?.label} connected successfully`);
    }
  };

  const handleAddYoutube = () => {
    if (youtubeUrl.trim() && youtubeType) {
      const newSource = {
        id: Date.now(),
        type: 'youtube',
        name: `${youtubeType}: ${youtubeUrl}`,
        status: 'connected'
      };
      setConnectedSources([...connectedSources, newSource]);
      setYoutubeUrl('');
      setYoutubeType('');
      toast.success('YouTube source connected successfully');
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
    };
    const IconComponent = iconMap[type] || Database;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="space-y-8">
      {/* Connected Sources */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium">Connected Sources</h3>
            <p className="text-sm text-muted-foreground">Manage your data sources</p>
          </div>
          <div className="text-sm text-muted-foreground">
            {connectedSources.length} source{connectedSources.length !== 1 ? 's' : ''} connected
          </div>
        </div>

        {connectedSources.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No data sources connected yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {connectedSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  {getSourceIcon(source.type)}
                  <div>
                    <p className="font-medium">{source.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{source.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    Connected
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveSource(source.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Sources */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Add New Source</h3>
        
        {/* Website */}
        <div className="space-y-3">
          <Label htmlFor="website">Website URL</Label>
          <div className="flex gap-2">
            <Input
              id="website"
              placeholder="https://example.com"
              value={newWebsite}
              onChange={(e) => setNewWebsite(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddWebsite} disabled={!newWebsite.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Connect
            </Button>
          </div>
        </div>

        {/* Social Media */}
        <div className="space-y-3">
          <Label htmlFor="social">Social Media Platform</Label>
          <div className="flex gap-2">
            <Select value={selectedSocialMedia} onValueChange={setSelectedSocialMedia}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {socialMediaPlatforms.map((platform) => (
                  <SelectItem key={platform.value} value={platform.value}>
                    <div className="flex items-center gap-2">
                      <platform.icon className="h-4 w-4" />
                      {platform.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddSocialMedia} disabled={!selectedSocialMedia}>
              <Plus className="h-4 w-4 mr-2" />
              Connect
            </Button>
          </div>
        </div>

        {/* YouTube */}
        <div className="space-y-3">
          <Label htmlFor="youtube">YouTube Source</Label>
          <div className="flex gap-2">
            <Select value={youtubeType} onValueChange={setYoutubeType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {youtubeTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="YouTube URL"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddYoutube} disabled={!youtubeUrl.trim() || !youtubeType}>
              <Plus className="h-4 w-4 mr-2" />
              Connect
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSourceSettings;
