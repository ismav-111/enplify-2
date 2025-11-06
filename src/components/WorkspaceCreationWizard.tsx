import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Database, FileText, Users, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface InvitedUser {
  email: string;
  role: 'admin' | 'contributor' | 'viewer';
}

interface WorkspaceCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (data: {
    name: string;
    dataSources: string[];
    invitedUsers: InvitedUser[];
  }) => void;
}

const dataSources = [
  { id: 'googledrive', name: 'Google Drive', icon: '📁' },
  { id: 'onedrive', name: 'OneDrive', icon: '☁️' },
  { id: 'dropbox', name: 'Dropbox', icon: '📦' },
  { id: 'notion', name: 'Notion', icon: '📝' },
];

export function WorkspaceCreationWizard({ open, onOpenChange, onComplete }: WorkspaceCreationWizardProps) {
  const [step, setStep] = useState(1);
  const [workspaceName, setWorkspaceName] = useState('');
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentRole, setCurrentRole] = useState<'admin' | 'contributor' | 'viewer'>('contributor');

  const handleClose = () => {
    setStep(1);
    setWorkspaceName('');
    setSelectedDataSources([]);
    setInvitedUsers([]);
    setCurrentEmail('');
    setCurrentRole('contributor');
    onOpenChange(false);
  };

  const handleNext = () => {
    if (step === 1 && !workspaceName.trim()) {
      toast.error('Please enter a workspace name');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleComplete = () => {
    onComplete({
      name: workspaceName,
      dataSources: selectedDataSources,
      invitedUsers,
    });
    toast.success('Workspace created successfully!');
    handleClose();
  };

  const toggleDataSource = (sourceId: string) => {
    setSelectedDataSources(prev =>
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const addUser = () => {
    if (!currentEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (invitedUsers.some(user => user.email === currentEmail)) {
      toast.error('This user is already invited');
      return;
    }

    setInvitedUsers([...invitedUsers, { email: currentEmail, role: currentRole }]);
    setCurrentEmail('');
    setCurrentRole('contributor');
  };

  const removeUser = (email: string) => {
    setInvitedUsers(invitedUsers.filter(user => user.email !== email));
  };

  const updateUserRole = (email: string, role: 'admin' | 'contributor' | 'viewer') => {
    setInvitedUsers(invitedUsers.map(user => 
      user.email === email ? { ...user, role } : user
    ));
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'contributor':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'viewer':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 1 && <FileText className="h-5 w-5" />}
            {step === 2 && <Database className="h-5 w-5" />}
            {step === 3 && <Users className="h-5 w-5" />}
            {step === 1 && 'Create New Workspace'}
            {step === 2 && 'Configure Data Sources'}
            {step === 3 && 'Invite Users'}
          </DialogTitle>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="py-6">
          {/* Step 1: Workspace Name */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input
                  id="workspace-name"
                  placeholder="Enter workspace name"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  autoFocus
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Choose a descriptive name for your workspace. You can change this later.
              </p>
            </div>
          )}

          {/* Step 2: Data Sources */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select data sources to connect to this workspace. You can add more later.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {dataSources.map(source => (
                  <div
                    key={source.id}
                    onClick={() => toggleDataSource(source.id)}
                    className={`
                      flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all
                      ${selectedDataSources.includes(source.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                  >
                    <Checkbox
                      checked={selectedDataSources.includes(source.id)}
                      onCheckedChange={() => toggleDataSource(source.id)}
                    />
                    <span className="text-2xl">{source.icon}</span>
                    <span className="font-medium">{source.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Invite Users */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Invite team members and set their permissions. You can invite more users later.
              </p>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Email address"
                      type="email"
                      value={currentEmail}
                      onChange={(e) => setCurrentEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addUser()}
                    />
                  </div>
                  <Select value={currentRole} onValueChange={(value: any) => setCurrentRole(value)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="contributor">Contributor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addUser}>Add</Button>
                </div>

                {invitedUsers.length > 0 && (
                  <div className="border rounded-lg divide-y">
                    {invitedUsers.map(user => (
                      <div key={user.email} className="flex items-center justify-between p-3">
                        <span className="text-sm">{user.email}</span>
                        <div className="flex items-center gap-2">
                          <Select
                            value={user.role}
                            onValueChange={(value: any) => updateUserRole(user.email, value)}
                          >
                            <SelectTrigger className="w-[140px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="contributor">Contributor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeUser(user.email)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <p className="font-medium">Permission levels:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li><span className="font-medium text-destructive">Admin:</span> Full access including settings and billing</li>
                  <li><span className="font-medium text-primary">Contributor:</span> Can create and edit content</li>
                  <li><span className="font-medium">Viewer:</span> Read-only access</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={step === 1 ? handleClose : handleBack}
            >
              {step === 1 ? (
                'Cancel'
              ) : (
                <>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </>
              )}
            </Button>
            
            {step < 3 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete}>
                Create Workspace
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
