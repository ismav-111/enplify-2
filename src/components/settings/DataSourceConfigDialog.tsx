
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { 
  Database, 
  Server, 
  Cloud, 
  Building2, 
  FolderOpen, 
  Globe,
  Youtube,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Eye,
  EyeOff
} from 'lucide-react';

interface DataSourceConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  source: any;
  onConnect: (sourceId: string, sourceName: string) => void;
  isConnected: boolean;
}

const DataSourceConfigDialog = ({ 
  isOpen, 
  onClose, 
  source, 
  onConnect, 
  isConnected 
}: DataSourceConfigDialogProps) => {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!source) return null;

  const getConfigFields = (sourceId: string) => {
    const commonFields = {
      // Database configurations
      'snowflake': [
        { name: 'account', label: 'Account', type: 'text', required: true, placeholder: 'your-account.snowflakecomputing.com' },
        { name: 'username', label: 'Username', type: 'text', required: true },
        { name: 'password', label: 'Password', type: 'password', required: true },
        { name: 'database', label: 'Database', type: 'text', required: true },
        { name: 'schema', label: 'Schema', type: 'text', required: false, placeholder: 'public' },
        { name: 'warehouse', label: 'Warehouse', type: 'text', required: true }
      ],
      'postgresql': [
        { name: 'host', label: 'Host', type: 'text', required: true, placeholder: 'localhost' },
        { name: 'port', label: 'Port', type: 'number', required: true, placeholder: '5432' },
        { name: 'database', label: 'Database', type: 'text', required: true },
        { name: 'username', label: 'Username', type: 'text', required: true },
        { name: 'password', label: 'Password', type: 'password', required: true },
        { name: 'ssl', label: 'SSL Mode', type: 'select', options: ['disable', 'require', 'verify-ca', 'verify-full'], required: false }
      ],
      'mysql': [
        { name: 'host', label: 'Host', type: 'text', required: true, placeholder: 'localhost' },
        { name: 'port', label: 'Port', type: 'number', required: true, placeholder: '3306' },
        { name: 'database', label: 'Database', type: 'text', required: true },
        { name: 'username', label: 'Username', type: 'text', required: true },
        { name: 'password', label: 'Password', type: 'password', required: true }
      ],
      'mongodb': [
        { name: 'connectionString', label: 'Connection String', type: 'text', required: true, placeholder: 'mongodb://localhost:27017' },
        { name: 'database', label: 'Database', type: 'text', required: true },
        { name: 'authSource', label: 'Auth Source', type: 'text', required: false, placeholder: 'admin' }
      ],
      // Cloud storage
      's3': [
        { name: 'accessKeyId', label: 'Access Key ID', type: 'text', required: true },
        { name: 'secretAccessKey', label: 'Secret Access Key', type: 'password', required: true },
        { name: 'region', label: 'Region', type: 'text', required: true, placeholder: 'us-east-1' },
        { name: 'bucketName', label: 'Bucket Name', type: 'text', required: true }
      ],
      'adls': [
        { name: 'accountName', label: 'Storage Account Name', type: 'text', required: true },
        { name: 'accountKey', label: 'Account Key', type: 'password', required: true },
        { name: 'containerName', label: 'Container Name', type: 'text', required: true }
      ],
      'gcs': [
        { name: 'projectId', label: 'Project ID', type: 'text', required: true },
        { name: 'keyFile', label: 'Service Account Key (JSON)', type: 'textarea', required: true },
        { name: 'bucketName', label: 'Bucket Name', type: 'text', required: true }
      ],
      // Enterprise applications
      'salesforce': [
        { name: 'username', label: 'Username', type: 'text', required: true },
        { name: 'password', label: 'Password', type: 'password', required: true },
        { name: 'securityToken', label: 'Security Token', type: 'password', required: true },
        { name: 'environment', label: 'Environment', type: 'select', options: ['production', 'sandbox'], required: true }
      ],
      'sap': [
        { name: 'serverHost', label: 'Server Host', type: 'text', required: true },
        { name: 'systemNumber', label: 'System Number', type: 'text', required: true },
        { name: 'username', label: 'Username', type: 'text', required: true },
        { name: 'password', label: 'Password', type: 'password', required: true },
        { name: 'client', label: 'Client', type: 'text', required: true }
      ],
      // File repositories
      'sharepoint': [
        { name: 'siteUrl', label: 'Site URL', type: 'text', required: true, placeholder: 'https://company.sharepoint.com/sites/sitename' },
        { name: 'username', label: 'Username', type: 'text', required: true },
        { name: 'password', label: 'Password', type: 'password', required: true },
        { name: 'documentLibrary', label: 'Document Library', type: 'text', required: false }
      ],
      'googledrive': [
        { name: 'clientId', label: 'Client ID', type: 'text', required: true },
        { name: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
        { name: 'refreshToken', label: 'Refresh Token', type: 'password', required: true }
      ],
      // Social media
      'youtube': [
        { name: 'apiKey', label: 'API Key', type: 'password', required: true },
        { name: 'channelId', label: 'Channel ID', type: 'text', required: false },
        { name: 'playlistId', label: 'Playlist ID', type: 'text', required: false }
      ],
      'twitter': [
        { name: 'apiKey', label: 'API Key', type: 'password', required: true },
        { name: 'apiSecret', label: 'API Secret', type: 'password', required: true },
        { name: 'accessToken', label: 'Access Token', type: 'password', required: true },
        { name: 'accessTokenSecret', label: 'Access Token Secret', type: 'password', required: true }
      ],
      // Web sources
      'website': [
        { name: 'url', label: 'Website URL', type: 'text', required: true, placeholder: 'https://example.com' },
        { name: 'crawlDepth', label: 'Crawl Depth', type: 'number', required: false, placeholder: '3' },
        { name: 'includePatterns', label: 'Include URL Patterns', type: 'text', required: false, placeholder: '/docs/*, /blog/*' }
      ]
    };

    return commonFields[sourceId] || [
      { name: 'name', label: 'Connection Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'text', required: false }
    ];
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isConnected) {
        toast.success(`${source.name} configuration updated successfully`);
      } else {
        onConnect(source.id, source.name);
      }
      
      onClose();
    } catch (error) {
      toast.error('Failed to configure data source');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    toast.info('Testing connection...');
    // Simulate test connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success('Connection test successful!');
  };

  const fields = getConfigFields(source.id);
  const Icon = source.icon;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-muted rounded-lg">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl">
                {isConnected ? 'Configure' : 'Connect'} {source.name}
              </AlertDialogTitle>
              {isConnected && (
                <Badge className="mt-1 bg-green-500/10 text-green-600 border-green-500/20 text-xs">
                  Connected
                </Badge>
              )}
            </div>
          </div>
          <AlertDialogDescription>
            {source.description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name} className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.name}
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="relative">
                  <Input
                    id={field.name}
                    type={field.type === 'password' && showPassword ? 'text' : field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                  />
                  {field.type === 'password' && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          <AlertDialogFooter className="flex gap-2 pt-6">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={isLoading}
            >
              Test Connection
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Connecting...' : (isConnected ? 'Update' : 'Connect')}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DataSourceConfigDialog;
