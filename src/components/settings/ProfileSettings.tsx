import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User, Mail, Lock, Phone, Building2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ProfileSettings = () => {
  const [email, setEmail] = useState('vamsiquadrant@gmail.com');
  const [orgName, setOrgName] = useState('Acme Corp');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 123-4567');
  const [password, setPassword] = useState('');
  const [azureSsoEnabled, setAzureSsoEnabled] = useState(false);
  const [showAzureDialog, setShowAzureDialog] = useState(false);
  const [azureClientId, setAzureClientId] = useState('');
  const [azureClientSecret, setAzureClientSecret] = useState('');
  const [azureTenantId, setAzureTenantId] = useState('');

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

  return (
    <div className="space-y-12 max-w-5xl">
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
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="orgName" className="text-sm text-foreground">Organization Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="orgName"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm text-foreground">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-foreground">Update Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter New Password"
                className="pl-10"
              />
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
            <Badge variant="secondary" className="text-xs">Business</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Enable Microsoft Azure Active Directory SSO for your workspace members.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="azure-sso" className="text-sm font-normal cursor-pointer">
              Microsoft Azure Directory
            </Label>
            <Switch
              id="azure-sso"
              checked={azureSsoEnabled}
              onCheckedChange={handleAzureToggle}
            />
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
              <Input
                id="azure_client_id"
                value={azureClientId}
                onChange={(e) => setAzureClientId(e.target.value)}
                placeholder="Enter Azure Client ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="azure_client_secret">Azure Client Secret</Label>
              <Input
                id="azure_client_secret"
                type="password"
                value={azureClientSecret}
                onChange={(e) => setAzureClientSecret(e.target.value)}
                placeholder="Enter Azure Client Secret"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="azure_tenant_id">Azure Tenant ID</Label>
              <Input
                id="azure_tenant_id"
                value={azureTenantId}
                onChange={(e) => setAzureTenantId(e.target.value)}
                placeholder="Enter Azure Tenant ID"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowAzureDialog(false);
                setAzureSsoEnabled(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setAzureSsoEnabled(true);
                setShowAzureDialog(false);
              }}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Changes Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button className="bg-primary hover:bg-primary/90">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
