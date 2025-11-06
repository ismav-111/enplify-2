import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Database, FileText, Users, ArrowLeft, ArrowRight, Settings, Globe, Youtube, Linkedin, Facebook, Instagram, CloudSnow, Zap, Archive, Server, HardDrive, CloudDrizzle, Cloud, FolderOpen, Share2, Briefcase, BarChart, Shield, ChevronDown } from 'lucide-react';
import { XIcon } from '@/components/icons/XIcon';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface InvitedUser {
  email: string;
  role: 'admin' | 'contributor' | 'viewer';
}

interface WorkspaceCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (data: {
    name: string;
    dataSources: Array<{
      id: string;
      config: Record<string, string>;
    }>;
    invitedUsers: InvitedUser[];
  }) => void;
}

// Data sources grouped by category - matching DataSourceSettings
const dataSourceCategories = {
  repositories: [
    { id: 'googledrive', name: 'Google Drive', icon: HardDrive, requiresOAuth: true, fields: [] },
    { id: 'onedrive', name: 'OneDrive', icon: Cloud, requiresOAuth: true, fields: [] },
    { id: 'dropbox', name: 'Dropbox', icon: Cloud, fields: [
      { id: 'access_token', label: 'Access Token', type: 'password', placeholder: '••••••••', required: true },
      { id: 'folder_path', label: 'Folder Path', type: 'text', placeholder: '/Documents', required: false }
    ]},
    { id: 'sharepoint', name: 'SharePoint', icon: Share2, requiresOAuth: true, fields: [
      { id: 'site_url', label: 'SharePoint Site URL', type: 'text', placeholder: 'https://company.sharepoint.com/sites/yoursite', required: true },
      { id: 'library_name', label: 'Document Library Name', type: 'text', placeholder: 'Documents', required: false }
    ]},
    { id: 'local-files', name: 'Document Library', icon: FolderOpen, fields: [
      { id: 'library_name', label: 'Library Name', type: 'text', placeholder: 'My Documents', required: true },
      { id: 'file_types', label: 'Supported File Types', type: 'text', placeholder: 'PDF, DOC, DOCX, TXT', required: false }
    ]}
  ],
  databases: [
    { id: 'postgresql', name: 'PostgreSQL', icon: Database, fields: [
      { id: 'host', label: 'Host', type: 'text', placeholder: 'localhost or db.example.com', required: true },
      { id: 'port', label: 'Port', type: 'text', placeholder: '5432', required: true },
      { id: 'database', label: 'Database Name', type: 'text', placeholder: 'Enter database name', required: true },
      { id: 'username', label: 'Username', type: 'text', placeholder: 'Enter your username', required: true },
      { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true }
    ]},
    { id: 'mysql', name: 'MySQL', icon: Database, fields: [
      { id: 'host', label: 'Host', type: 'text', placeholder: 'localhost or mysql.example.com', required: true },
      { id: 'port', label: 'Port', type: 'text', placeholder: '3306', required: true },
      { id: 'database', label: 'Database Name', type: 'text', placeholder: 'Enter database name', required: true },
      { id: 'username', label: 'Username', type: 'text', placeholder: 'Enter your username', required: true },
      { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true }
    ]},
    { id: 'mongodb', name: 'MongoDB', icon: HardDrive, fields: [
      { id: 'connection_string', label: 'Connection String', type: 'text', placeholder: 'mongodb://localhost:27017/mydb', required: true },
      { id: 'database', label: 'Database Name', type: 'text', placeholder: 'Enter database name', required: true },
      { id: 'username', label: 'Username', type: 'text', placeholder: 'Enter your username', required: false },
      { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: false }
    ]}
  ],
  api: [
    { id: 'rest-api', name: 'REST API', icon: Settings, fields: [
      { id: 'endpoint', label: 'API Endpoint', type: 'url', placeholder: 'https://api.example.com/data', required: true },
      { id: 'method', label: 'HTTP Method', type: 'text', placeholder: 'GET, POST, PUT, DELETE', required: true },
      { id: 'api_key', label: 'API Key', type: 'password', placeholder: '••••••••', required: false },
      { id: 'headers', label: 'Custom Headers', type: 'textarea', placeholder: 'Authorization: Bearer token', required: false }
    ]},
    { id: 'graphql', name: 'GraphQL API', icon: Database, fields: [
      { id: 'endpoint', label: 'GraphQL Endpoint', type: 'url', placeholder: 'https://api.example.com/graphql', required: true },
      { id: 'query', label: 'GraphQL Query', type: 'textarea', placeholder: 'query { users { id name email } }', required: true },
      { id: 'api_key', label: 'API Key', type: 'password', placeholder: '••••••••', required: false }
    ]}
  ],
  web: [
    { id: 'website', name: 'Website', icon: Globe, fields: [
      { id: 'url', label: 'Website URL', type: 'text', placeholder: 'https://www.example.com', required: true },
      { id: 'api_endpoint', label: 'API Endpoint', type: 'text', placeholder: 'https://api.example.com', required: false },
      { id: 'api_key', label: 'API Key', type: 'password', placeholder: '••••••••', required: false },
      { id: 'crawl_depth', label: 'Crawl Depth', type: 'text', placeholder: '1, 2, or 3', required: false }
    ]},
    { id: 'youtube', name: 'YouTube', icon: Youtube, fields: [
      { id: 'channel_url', label: 'Channel URL', type: 'text', placeholder: 'https://www.youtube.com/@channel', required: true },
      { id: 'api_key', label: 'YouTube API Key', type: 'password', placeholder: '••••••••', required: true },
      { id: 'video_limit', label: 'Video Limit', type: 'text', placeholder: '50', required: false }
    ]}
  ],
  enterprise: [
    { id: 'salesforce', name: 'Salesforce', icon: Briefcase, fields: [
      { id: 'instance_url', label: 'Instance URL', type: 'text', placeholder: 'https://yourinstance.salesforce.com', required: true },
      { id: 'client_id', label: 'Client ID', type: 'text', placeholder: 'Enter your client ID', required: true },
      { id: 'client_secret', label: 'Client Secret', type: 'password', placeholder: '••••••••', required: true },
      { id: 'username', label: 'Username', type: 'text', placeholder: 'user@example.com', required: true },
      { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true },
      { id: 'security_token', label: 'Security Token', type: 'password', placeholder: '••••••••', required: true }
    ]}
  ]
};

const allDataSources = [
  ...dataSourceCategories.repositories,
  ...dataSourceCategories.databases,
  ...dataSourceCategories.api,
  ...dataSourceCategories.web,
  ...dataSourceCategories.enterprise
];

export function WorkspaceCreationWizard({ open, onOpenChange, onComplete }: WorkspaceCreationWizardProps) {
  const [step, setStep] = useState(1);
  const [workspaceName, setWorkspaceName] = useState('');
  const [selectedDataSources, setSelectedDataSources] = useState<Array<{ id: string; config: Record<string, string> }>>([]);
  const [expandedDataSource, setExpandedDataSource] = useState<string | null>(null);
  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentRole, setCurrentRole] = useState<'admin' | 'contributor' | 'viewer'>('contributor');

  const handleClose = () => {
    setStep(1);
    setWorkspaceName('');
    setSelectedDataSources([]);
    setExpandedDataSource(null);
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
    const isSelected = selectedDataSources.some(ds => ds.id === sourceId);
    
    if (isSelected) {
      setSelectedDataSources(prev => prev.filter(ds => ds.id !== sourceId));
      if (expandedDataSource === sourceId) {
        setExpandedDataSource(null);
      }
    } else {
      setSelectedDataSources(prev => [...prev, { id: sourceId, config: {} }]);
      setExpandedDataSource(sourceId);
    }
  };

  const updateDataSourceConfig = (sourceId: string, fieldId: string, value: string) => {
    setSelectedDataSources(prev =>
      prev.map(ds =>
        ds.id === sourceId
          ? { ...ds, config: { ...ds.config, [fieldId]: value } }
          : ds
      )
    );
  };

  const isDataSourceSelected = (sourceId: string) => {
    return selectedDataSources.some(ds => ds.id === sourceId);
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
                Select data sources to connect to this workspace. Configure settings for sources that require credentials.
              </p>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {Object.entries(dataSourceCategories).map(([categoryKey, sources]) => (
                  <div key={categoryKey} className="space-y-2">
                    <h3 className="text-sm font-semibold capitalize text-muted-foreground">
                      {categoryKey}
                    </h3>
                    <div className="space-y-2">
                      {sources.map(source => {
                        const isSelected = isDataSourceSelected(source.id);
                        const isExpanded = expandedDataSource === source.id;
                        const selectedSource = selectedDataSources.find(ds => ds.id === source.id);
                        
                        return (
                          <Collapsible
                            key={source.id}
                            open={isExpanded}
                            onOpenChange={(open) => {
                              if (isSelected) {
                                setExpandedDataSource(open ? source.id : null);
                              }
                            }}
                          >
                            <div
                              className={`
                                border rounded-lg transition-all
                                ${isSelected ? 'border-primary bg-primary/5' : 'border-border'}
                              `}
                            >
                              <div
                                onClick={() => toggleDataSource(source.id)}
                                className="flex items-center gap-3 p-3 cursor-pointer"
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => toggleDataSource(source.id)}
                                />
                                <source.icon className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium flex-1">{source.name}</span>
                                {source.requiresOAuth && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                    OAuth
                                  </span>
                                )}
                                {isSelected && source.fields && source.fields.length > 0 && (
                                  <CollapsibleTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="sm">
                                      <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                    </Button>
                                  </CollapsibleTrigger>
                                )}
                              </div>
                              
                              {isSelected && source.fields && source.fields.length > 0 && (
                                <CollapsibleContent>
                                  <div className="px-3 pb-3 pt-0 space-y-3 border-t bg-muted/30">
                                    {source.fields.map(field => (
                                      <div key={field.id} className="space-y-1.5 pt-3">
                                        <Label htmlFor={`${source.id}-${field.id}`} className="text-xs">
                                          {field.label}
                                          {field.required && <span className="text-destructive ml-1">*</span>}
                                        </Label>
                                        {field.type === 'textarea' ? (
                                          <textarea
                                            id={`${source.id}-${field.id}`}
                                            className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                                            placeholder={field.placeholder}
                                            value={selectedSource?.config[field.id] || ''}
                                            onChange={(e) => updateDataSourceConfig(source.id, field.id, e.target.value)}
                                            rows={3}
                                          />
                                        ) : (
                                          <Input
                                            id={`${source.id}-${field.id}`}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            value={selectedSource?.config[field.id] || ''}
                                            onChange={(e) => updateDataSourceConfig(source.id, field.id, e.target.value)}
                                            className="text-sm"
                                          />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </CollapsibleContent>
                              )}
                            </div>
                          </Collapsible>
                        );
                      })}
                    </div>
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
                <p className="font-medium">Permission levels for chat sessions:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li><span className="font-medium text-destructive">Admin:</span> Manage workspace settings, users, and all chat sessions</li>
                  <li><span className="font-medium text-primary">Contributor:</span> Create and participate in chat sessions, access shared data</li>
                  <li><span className="font-medium">Viewer:</span> View chat sessions and data, cannot create or modify</li>
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
