
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Trash2, Globe, Youtube, Database } from 'lucide-react';

const DataSourceSettings = () => {
  const [connectedSources, setConnectedSources] = useState([
    { id: 1, type: 'website', name: 'company-website.com', status: 'connected' },
    { id: 2, type: 'youtube', name: 'Company Channel', status: 'connected' },
  ]);
  
  const [newWebsite, setNewWebsite] = useState('');
  const [selectedSocialMedia, setSelectedSocialMedia] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const socialMediaPlatforms = [
    'Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'TikTok', 'YouTube', 'Pinterest'
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
      const newSource = {
        id: Date.now(),
        type: 'social',
        name: selectedSocialMedia,
        status: 'connected'
      };
      setConnectedSources([...connectedSources, newSource]);
      setSelectedSocialMedia('');
      toast.success(`${selectedSocialMedia} connected successfully`);
    }
  };

  const handleAddYoutube = () => {
    if (youtubeUrl.trim()) {
      const newSource = {
        id: Date.now(),
        type: 'youtube',
        name: youtubeUrl,
        status: 'connected'
      };
      setConnectedSources([...connectedSources, newSource]);
      setYoutubeUrl('');
      toast.success('YouTube source connected successfully');
    }
  };

  const handleRemoveSource = (id: number) => {
    setConnectedSources(connectedSources.filter(source => source.id !== id));
    toast.success('Data source removed');
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'website': return <Globe className="h-4 w-4" />;
      case 'youtube': return <Youtube className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Connected Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Data Sources</CardTitle>
          <CardDescription>Manage your connected websites and social media accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {connectedSources.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No data sources connected yet</p>
          ) : (
            <div className="space-y-3">
              {connectedSources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getSourceIcon(source.type)}
                    <div>
                      <p className="font-medium">{source.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{source.type}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveSource(source.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Website */}
      <Card>
        <CardHeader>
          <CardTitle>Add Website</CardTitle>
          <CardDescription>Connect a website to extract data from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="https://example.com"
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
              />
            </div>
            <Button onClick={handleAddWebsite}>
              <Plus className="h-4 w-4 mr-2" />
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Add Social Media</CardTitle>
          <CardDescription>Connect your social media accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Select value={selectedSocialMedia} onValueChange={setSelectedSocialMedia}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {socialMediaPlatforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddSocialMedia} disabled={!selectedSocialMedia}>
              <Plus className="h-4 w-4 mr-2" />
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add YouTube */}
      <Card>
        <CardHeader>
          <CardTitle>Add YouTube</CardTitle>
          <CardDescription>Connect YouTube channels or playlists</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="YouTube channel or playlist URL"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
            </div>
            <Button onClick={handleAddYoutube}>
              <Plus className="h-4 w-4 mr-2" />
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSourceSettings;
