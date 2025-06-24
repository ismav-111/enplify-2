
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

const ProfileSettings = () => {
  const [fullName, setFullName] = useState('Andrew Neilson');
  const [email, setEmail] = useState('andrew@example.com');
  
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };
  
  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Password updated successfully');
  };
  
  const handleClearConversations = () => {
    toast.success('All conversations have been cleared');
  };
  
  const handleDeleteAccount = () => {
    toast.success('Account successfully deleted');
  };
  
  const handleDownloadData = () => {
    toast.success('Your data is being prepared for download');
  };
  
  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">Profile Information</CardTitle>
          <CardDescription className="text-gray-600">
            Update your account details
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleProfileSave}>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-10"
              />
            </div>
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
          </CardContent>
          <CardFooter className="pt-4 border-t border-gray-100">
            <Button type="submit" variant="secondary">
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {/* Password Update */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">Password</CardTitle>
          <CardDescription className="text-gray-600">
            Update your password
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordSave}>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                Current Password
              </label>
              <Input id="currentPassword" type="password" className="h-10" />
            </div>
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                New Password
              </label>
              <Input id="newPassword" type="password" className="h-10" />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <Input id="confirmPassword" type="password" className="h-10" />
            </div>
          </CardContent>
          <CardFooter className="pt-4 border-t border-gray-100">
            <Button type="submit" variant="secondary">
              Update Password
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {/* Data Management */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">Data Management</CardTitle>
          <CardDescription className="text-gray-600">
            Manage your data and account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Export Your Data</h3>
            <p className="text-sm text-gray-600 mb-3">
              Download a copy of your data
            </p>
            <Button 
              variant="outline" 
              onClick={handleDownloadData}
              className="border-gray-300 hover:bg-gray-50"
            >
              Download Data
            </Button>
          </div>
          
          <Separator className="bg-gray-200" />
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Clear Conversations</h3>
            <p className="text-sm text-gray-600 mb-3">
              Remove all your conversation history
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                  Clear All Conversations
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete all your conversations and cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearConversations}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <Separator className="bg-gray-200" />
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Delete Account</h3>
            <p className="text-sm text-gray-600 mb-3">
              Permanently delete your account and all of your data
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="secondary">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all of your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
