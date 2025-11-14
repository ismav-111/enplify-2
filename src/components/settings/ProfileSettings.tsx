
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Eye, EyeOff, Copy, Trash2, Save } from 'lucide-react';

const ProfileSettings = () => {
  const [email, setEmail] = useState('andrew@example.com');
  const [orgName, setOrgName] = useState('Enplify AI');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 123-4567');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Password changed successfully');
  };

  const handleEnable2FA = () => {
    toast.success('Two-factor authentication enabled');
  };

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }
    toast.success('API key saved successfully');
  };

  const handleCopyApiKey = () => {
    if (!apiKey) {
      toast.error('No API key to copy');
      return;
    }
    navigator.clipboard.writeText(apiKey);
    toast.success('API key copied to clipboard');
  };
  
  const handleDeleteProfile = () => {
    toast.success('Profile/Organization deleted successfully');
  };
  
  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full space-y-4">
        {/* Profile Information */}
        <AccordionItem value="profile" className="border rounded-lg px-4 bg-card shadow-sm">
          <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
            Profile Information
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground mb-4">
              Update your organization and contact details
            </p>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="orgName" className="text-sm font-medium text-foreground">
                  Organization Name
                </label>
                <Input
                  id="orgName"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-10"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <Button type="submit" variant="secondary">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </form>
          </AccordionContent>
        </AccordionItem>

        {/* Security & Authentication */}
        <AccordionItem value="security" className="border rounded-lg px-4 bg-card shadow-sm">
          <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
            Security & Authentication
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your security settings and authentication methods
            </p>
            <div className="space-y-6">
              {/* Change Password */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Password</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Update your password to keep your account secure
                </p>
                <form onSubmit={handlePasswordChange} className="space-y-3">
                  <Input
                    type="password"
                    placeholder="Current Password"
                    className="h-10"
                  />
                  <Input
                    type="password"
                    placeholder="New Password"
                    className="h-10"
                  />
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    className="h-10"
                  />
                  <Button type="submit" variant="secondary">
                    Change Password
                  </Button>
                </form>
              </div>

              {/* Two-Factor Authentication */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold text-foreground mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Add an extra layer of security to your account
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleEnable2FA}
                >
                  Enable 2FA
                </Button>
              </div>

              {/* Sessions */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold text-foreground mb-2">Active Sessions</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Manage your active sessions across devices
                </p>
                <Button variant="outline">
                  View Active Sessions
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* API Configuration */}
        <AccordionItem value="api" className="border rounded-lg px-4 bg-card shadow-sm">
          <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
            API Configuration
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your API keys and integration settings
            </p>
            <div className="space-y-6">
              {/* API Key */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">API Key</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Enter your API key to authenticate requests
                </p>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showApiKey ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk_test_..."
                        className="h-10 pr-10 font-mono text-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyApiKey}
                      className="h-10"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    variant="secondary"
                    onClick={handleSaveApiKey}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save API Key
                  </Button>
                </div>
              </div>

              {/* API Usage */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold text-foreground mb-2">API Usage</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Monitor your API usage and rate limits
                </p>
                <div className="p-4 bg-muted rounded-lg border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Requests this month</span>
                    <span className="text-sm font-semibold text-foreground">1,234 / 10,000</span>
                  </div>
                  <div className="w-full bg-muted-foreground/20 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '12.34%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Delete Profile/Organization */}
        <AccordionItem value="delete" className="border border-destructive/50 rounded-lg px-4 bg-card shadow-sm">
          <AccordionTrigger className="text-lg font-semibold text-destructive hover:no-underline">
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Profile/Organization
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your profile and organization data
            </p>
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg mb-4">
              <p className="text-sm text-foreground font-medium mb-2">Warning: This action cannot be undone</p>
              <p className="text-sm text-muted-foreground mb-4">
                Deleting your profile/organization will:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Permanently delete all your data</li>
                <li>Remove all workspaces and members</li>
                <li>Revoke all API keys and integrations</li>
                <li>Cancel all active subscriptions</li>
              </ul>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Profile/Organization
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your profile, organization, and all associated data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteProfile}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProfileSettings;
