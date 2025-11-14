
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Copy, RefreshCw, Trash2 } from 'lucide-react';

const ProfileSettings = () => {
  const [email, setEmail] = useState('andrew@example.com');
  const [orgName, setOrgName] = useState('Enplify AI');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 123-4567');
  const [apiKey, setApiKey] = useState('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
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

  const handleRegenerateApiKey = () => {
    const newKey = 'sk_test_' + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    toast.success('API key regenerated successfully');
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('API key copied to clipboard');
  };
  
  const handleDeleteProfile = () => {
    toast.success('Profile/Organization deleted successfully');
  };
  
  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">Profile Information</CardTitle>
          <CardDescription className="text-gray-600">
            Update your organization and contact details
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleProfileSave}>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
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
              <label htmlFor="orgName" className="text-sm font-medium text-gray-700">
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
              <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
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
          </CardContent>
          <CardFooter className="pt-4 border-t border-gray-100">
            <Button type="submit" variant="secondary">
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {/* Security & Authentication */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">Security & Authentication</CardTitle>
          <CardDescription className="text-gray-600">
            Manage your security settings and authentication methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          {/* Change Password */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Password</h3>
            <p className="text-sm text-gray-600 mb-3">
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

          <Separator className="bg-gray-200" />

          {/* Two-Factor Authentication */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-600 mb-3">
              Add an extra layer of security to your account
            </p>
            <Button 
              variant="outline" 
              onClick={handleEnable2FA}
              className="border-gray-300 hover:bg-gray-50"
            >
              Enable 2FA
            </Button>
          </div>

          <Separator className="bg-gray-200" />

          {/* Sessions */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Active Sessions</h3>
            <p className="text-sm text-gray-600 mb-3">
              Manage your active sessions across devices
            </p>
            <Button 
              variant="outline" 
              className="border-gray-300 hover:bg-gray-50"
            >
              View Active Sessions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">API Configuration</CardTitle>
          <CardDescription className="text-gray-600">
            Manage your API keys and integration settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">API Key</h3>
            <p className="text-sm text-gray-600 mb-3">
              Use this key to authenticate API requests
            </p>
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  readOnly
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
              variant="outline" 
              onClick={handleRegenerateApiKey}
              className="border-gray-300 hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate API Key
            </Button>
          </div>

          <Separator className="bg-gray-200" />

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">API Usage</h3>
            <p className="text-sm text-gray-600 mb-3">
              Monitor your API usage and rate limits
            </p>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Requests this month</span>
                <span className="text-sm font-semibold text-gray-900">1,234 / 10,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '12.34%' }}></div>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Webhooks</h3>
            <p className="text-sm text-gray-600 mb-3">
              Configure webhook endpoints for real-time notifications
            </p>
            <Button 
              variant="outline" 
              className="border-gray-300 hover:bg-gray-50"
            >
              Manage Webhooks
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Delete Profile/Organization */}
      <Card className="shadow-sm border-destructive">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-destructive flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Delete Profile/Organization
          </CardTitle>
          <CardDescription className="text-gray-600">
            Permanently delete your profile and organization data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
            <p className="text-sm text-foreground font-medium mb-2">Warning: This action cannot be undone</p>
            <p className="text-sm text-muted-foreground mb-4">
              Deleting your profile/organization will:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-4">
              <li>Permanently delete all your data</li>
              <li>Remove all workspaces and members</li>
              <li>Revoke all API keys and integrations</li>
              <li>Cancel all active subscriptions</li>
            </ul>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="shadow-md">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
