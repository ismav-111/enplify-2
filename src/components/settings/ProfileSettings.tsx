import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User, Mail, Lock, Phone, Building2, Key, Copy, Trash2, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
const ProfileSettings = ({ className }: { className?: string }) => {
  const [email, setEmail] = useState('vamsiquadrant@gmail.com');
  const [orgName, setOrgName] = useState('Acme Corp');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 123-4567');
  const [password, setPassword] = useState('');
  const [azureSsoEnabled, setAzureSsoEnabled] = useState(false);
  const [showAzureDialog, setShowAzureDialog] = useState(false);
  const [azureClientId, setAzureClientId] = useState('');
  const [azureClientSecret, setAzureClientSecret] = useState('');
  const [azureTenantId, setAzureTenantId] = useState('');
  const [apiKeys, setApiKeys] = useState([
    { id: '1', name: 'Production API Key', key: 'sk_live_••••••••••••••••1234', created: '2024-01-15', lastUsed: '2 hours ago' },
    { id: '2', name: 'Development API Key', key: 'sk_test_••••••••••••••••5678', created: '2024-02-20', lastUsed: 'Never' },
  ]);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [newApiKeyName, setNewApiKeyName] = useState('');
  const [generatedApiKey, setGeneratedApiKey] = useState('');
  const { toast } = useToast();
  const handleAzureToggle = (checked: boolean) => {
    if (checked) {
      setShowAzureDialog(true);
    } else {
      setAzureSsoEnabled(false);
      setAzureClientId('');
      setAzureClientSecret('');
      setAzureTenantId('');
    }
  };

  const handleGenerateApiKey = () => {
    if (!newApiKeyName.trim()) {
      toast({ title: "Error", description: "Please enter a name for the API key", variant: "destructive" });
      return;
    }
    const newKey = `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setGeneratedApiKey(newKey);
    const newApiKey = {
      id: String(apiKeys.length + 1),
      name: newApiKeyName,
      key: newKey,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never'
    };
    setApiKeys([...apiKeys, newApiKey]);
    toast({ title: "Success", description: "API key generated successfully" });
  };

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: "Copied", description: "API key copied to clipboard" });
  };

  const handleDeleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
    toast({ title: "Deleted", description: "API key has been revoked" });
  };
  return <div className={`space-y-12 max-w-5xl ${className || ''}`}>
      {/* Admin Account Badge */}
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Admin Account</span>
      </div>

      {/* Profile Fields */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-foreground">Account Information</h3>
          <p className="text-sm text-muted-foreground">
            Manage your account details and credentials.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="orgName" className="text-sm text-foreground">Organization Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="orgName" value={orgName} onChange={e => setOrgName(e.target.value)} className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm text-foreground">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="phoneNumber" type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+1 (555) 000-0000" className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-foreground">Update Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter New Password" className="pl-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Separator */}
      <Separator className="my-8" />

      {/* Single sign-on (SSO) */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-medium text-foreground">Single sign-on (SSO)</h3>
            
          </div>
          
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="azure-sso" className="text-sm font-normal cursor-pointer">
              Microsoft Azure Directory
            </Label>
            <Switch id="azure-sso" checked={azureSsoEnabled} onCheckedChange={handleAzureToggle} />
          </div>
        </div>
      </div>

      {/* Azure SSO Configuration Dialog */}
      <Dialog open={showAzureDialog} onOpenChange={setShowAzureDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Azure Active Directory</DialogTitle>
            <DialogDescription>
              Enter your Azure AD credentials to enable SSO.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="azure_client_id">Azure Client ID</Label>
              <Input id="azure_client_id" value={azureClientId} onChange={e => setAzureClientId(e.target.value)} placeholder="Enter Azure Client ID" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="azure_client_secret">Azure Client Secret</Label>
              <Input id="azure_client_secret" type="password" value={azureClientSecret} onChange={e => setAzureClientSecret(e.target.value)} placeholder="Enter Azure Client Secret" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="azure_tenant_id">Azure Tenant ID</Label>
              <Input id="azure_tenant_id" value={azureTenantId} onChange={e => setAzureTenantId(e.target.value)} placeholder="Enter Azure Tenant ID" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
            setShowAzureDialog(false);
            setAzureSsoEnabled(false);
          }}>
              Cancel
            </Button>
            <Button onClick={() => {
            setAzureSsoEnabled(true);
            setShowAzureDialog(false);
          }}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Separator */}
      <Separator className="my-8" />

      {/* API Key Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-medium text-foreground">API Keys</h3>
            <Badge variant="secondary" className="text-xs">Enterprise</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage API keys for programmatic access to your workspace.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => {
              setShowApiKeyDialog(true);
              setNewApiKeyName('');
              setGeneratedApiKey('');
            }} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Create API Key
            </Button>
          </div>

          {apiKeys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No API keys configured yet.
            </div>
          ) : (
            <div className="space-y-3">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div className="flex items-center gap-3 flex-1">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{apiKey.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono mt-1">{apiKey.key}</div>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Created: {apiKey.created}</span>
                        <span>Last used: {apiKey.lastUsed}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleCopyApiKey(apiKey.key)} className="h-8 w-8 p-0">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteApiKey(apiKey.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* API Key Creation Dialog */}
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription>
              Generate a new API key for programmatic access. Make sure to copy it as you won't be able to see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api_key_name">API Key Name</Label>
              <Input 
                id="api_key_name" 
                value={newApiKeyName} 
                onChange={e => setNewApiKeyName(e.target.value)} 
                placeholder="e.g., Production API Key" 
              />
            </div>
            {generatedApiKey && (
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <Label className="text-sm font-medium">Your API Key</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-background p-2 rounded border font-mono break-all">
                    {generatedApiKey}
                  </code>
                  <Button variant="outline" size="sm" onClick={() => handleCopyApiKey(generatedApiKey)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Make sure to copy this API key. You won't be able to see it again.
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setShowApiKeyDialog(false);
              setNewApiKeyName('');
              setGeneratedApiKey('');
            }}>
              {generatedApiKey ? 'Done' : 'Cancel'}
            </Button>
            {!generatedApiKey && (
              <Button onClick={handleGenerateApiKey}>
                Generate Key
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Changes Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button className="bg-primary hover:bg-primary/90">
          Save Changes
        </Button>
      </div>
    </div>;
};
export default ProfileSettings;