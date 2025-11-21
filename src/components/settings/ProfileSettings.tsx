import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Lock, Phone, Building2, Key, Copy, Trash2, Plus, Sparkles, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
const ProfileSettings = ({ className }: { className?: string }) => {
  const [fullName, setFullName] = useState('vamsi');
  const [email, setEmail] = useState('vamsiquadrant@gmail.com');
  const [orgName, setOrgName] = useState('Acme Corp');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 123-4567');
  const [password, setPassword] = useState('');
  const [tokenUsage, setTokenUsage] = useState({
    used: 450000,
    limit: 1000000,
    resetDate: '2025-12-01'
  });
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
  const [newApiKeyValue, setNewApiKeyValue] = useState('');
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

  const handleSaveApiKey = () => {
    if (!newApiKeyName.trim()) {
      toast({ title: "Error", description: "Please enter a name for the API key", variant: "destructive" });
      return;
    }
    if (!newApiKeyValue.trim()) {
      toast({ title: "Error", description: "Please enter the API key", variant: "destructive" });
      return;
    }
    const newApiKey = {
      id: String(apiKeys.length + 1),
      name: newApiKeyName,
      key: newApiKeyValue,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never'
    };
    setApiKeys([...apiKeys, newApiKey]);
    setShowApiKeyDialog(false);
    setNewApiKeyName('');
    setNewApiKeyValue('');
    toast({ title: "Success", description: "API key saved successfully" });
  };

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: "Copied", description: "API key copied to clipboard" });
  };

  const handleDeleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
    toast({ title: "Deleted", description: "API key has been revoked" });
  };
  return <div className={`space-y-8 max-w-5xl ${className || ''}`}>
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">My Settings</h1>
      </div>

      {/* Profile Section Header with Avatar */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-1">
            <h2 className="text-xl font-semibold text-foreground">Profile</h2>
            <p className="text-sm text-muted-foreground">
              Your personal information and account security settings.
            </p>
          </div>
        </div>
      </div>

      {/* Avatar and Account Type */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm text-foreground">Avatar</Label>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 bg-muted">
              <AvatarFallback className="text-2xl font-semibold bg-muted text-muted-foreground">
                V
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">{fullName}</p>
              <Badge variant="secondary" className="gap-1">
                <User className="h-3 w-3" />
                Admin Account
              </Badge>
            </div>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm text-foreground">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-foreground">Password</Label>
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

      {/* API Keys Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">API Keys</h3>
              <Badge variant="secondary" className="text-xs">Enterprise</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Manage API keys for programmatic access to your workspace.
            </p>
          </div>
          <Button onClick={() => {
            setShowApiKeyDialog(true);
            setNewApiKeyName('');
            setNewApiKeyValue('');
          }} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add API Key
          </Button>
        </div>

        {apiKeys.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                No API keys configured yet.
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {apiKeys.map((apiKey) => (
              <Card key={apiKey.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Key className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="font-medium text-sm text-foreground">{apiKey.name}</p>
                        <p className="text-xs text-muted-foreground font-mono break-all">{apiKey.key}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span>Created: {apiKey.created}</span>
                          <span>Last used: {apiKey.lastUsed}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => handleCopyApiKey(apiKey.key)} className="h-8 w-8 p-0">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteApiKey(apiKey.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
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

      <Separator className="my-6" />

      {/* Token Usage Section */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">Token Usage</h3>
            <Badge variant="outline" className="text-xs gap-1">
              <Sparkles className="h-3 w-3" />
              Premium
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Monitor your API token consumption and limits.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Current Usage</span>
                <span className="text-sm font-semibold text-foreground">
                  {tokenUsage.used.toLocaleString()} / {tokenUsage.limit.toLocaleString()} tokens
                </span>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(tokenUsage.used / tokenUsage.limit) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{((tokenUsage.used / tokenUsage.limit) * 100).toFixed(1)}% used</span>
                <span>Resets on {tokenUsage.resetDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      {/* Delete Profile Section */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground text-destructive">Delete Profile</h3>
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
        </div>

        <Card className="border-destructive/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1 space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Warning</p>
                  <p className="text-sm text-muted-foreground">
                    Deleting your profile will permanently remove all your data, including workspaces, API keys, and settings. This action is irreversible.
                  </p>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Delete My Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={() => {
                          toast({ 
                            title: "Account Deleted", 
                            description: "Your account has been permanently deleted.",
                            variant: "destructive"
                          });
                        }}
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Key Dialog */}
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add API Key</DialogTitle>
            <DialogDescription>
              Enter your API key details to add it to your workspace.
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
            <div className="space-y-2">
              <Label htmlFor="api_key_value">API Key</Label>
              <Input 
                id="api_key_value" 
                type="password"
                value={newApiKeyValue} 
                onChange={e => setNewApiKeyValue(e.target.value)} 
                placeholder="Enter your API key" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setShowApiKeyDialog(false);
              setNewApiKeyName('');
              setNewApiKeyValue('');
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveApiKey}>
              Save API Key
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Changes Button */}
      <div className="flex justify-end pt-4">
        <Button className="bg-primary hover:bg-primary/90">
          Save Changes
        </Button>
      </div>
    </div>;
};
export default ProfileSettings;