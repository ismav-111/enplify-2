import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Users, 
  Plus, 
  MoreVertical, 
  UserPlus, 
  Crown, 
  Mail,
  Calendar,
  Trash2,
  Settings,
  Shield,
  Edit3,
  Eye,
  UserCheck,
  ChevronDown,
  Database
} from 'lucide-react';
import { toast } from 'sonner';

type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'viewer' | 'guest';

interface WorkspaceMember {
  id: string;
  email: string;
  role: WorkspaceRole;
  joinedAt: string;
}

interface Workspace {
  id: string;
  name: string;
  memberCount: number;
  role: WorkspaceRole;
  createdAt: string;
  isShared: boolean;
  dataSources?: string[];
  members?: WorkspaceMember[];
}

// Form validation schema
const inviteSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  role: z.enum(['admin', 'editor', 'viewer'], {
    required_error: "Please select a role",
  }),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

const WorkspacesSettings = () => {
  const [inviteDialog, setInviteDialog] = useState(false);
  const [createWorkspaceDialog, setCreateWorkspaceDialog] = useState(false);
  const [selectedWorkspaceForInvite, setSelectedWorkspaceForInvite] = useState<string | null>(null);
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(new Set());
  
  // Form for invite dialog
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role: 'viewer',
    },
  });

  // Form for create workspace dialog
  const createWorkspaceForm = useForm({
    defaultValues: {
      name: '',
    },
  });
  
  // Mock data - replace with actual data from your backend
  const workspaces: Workspace[] = [
    {
      id: '1',
      name: 'Team Alpha',
      memberCount: 5,
      role: 'owner',
      createdAt: '2024-01-15',
      isShared: true,
      dataSources: ['Snowflake', 'PostgreSQL'],
      members: [
        { id: '1', email: 'john@example.com', role: 'admin', joinedAt: '2024-01-15' },
        { id: '2', email: 'mike@example.com', role: 'editor', joinedAt: '2024-02-01' },
        { id: '3', email: 'emma@example.com', role: 'viewer', joinedAt: '2024-02-10' },
        { id: '4', email: 'sarah@example.com', role: 'editor', joinedAt: '2024-02-15' },
        { id: '5', email: 'tom@example.com', role: 'viewer', joinedAt: '2024-03-01' },
      ],
    },
    {
      id: '2',
      name: 'Marketing Team',
      memberCount: 8,
      role: 'viewer',
      createdAt: '2024-01-20',
      isShared: true,
      dataSources: ['MySQL'],
      members: [],
    },
    {
      id: '3',
      name: 'Client Work',
      memberCount: 3,
      role: 'admin',
      createdAt: '2024-02-20',
      isShared: true,
      dataSources: ['Snowflake', 'MongoDB'],
      members: [
        { id: '6', email: 'client1@example.com', role: 'viewer', joinedAt: '2024-02-20' },
        { id: '7', email: 'client2@example.com', role: 'viewer', joinedAt: '2024-02-25' },
      ],
    },
    {
      id: '4',
      name: 'Product Design',
      memberCount: 4,
      role: 'editor',
      createdAt: '2024-03-01',
      isShared: true,
      dataSources: [],
      members: [],
    },
  ];

  // Separate workspaces by ownership
  const ownedWorkspaces = workspaces.filter(w => w.role === 'owner' || w.role === 'admin');
  const invitedWorkspaces = workspaces.filter(w => w.role === 'editor' || w.role === 'viewer' || w.role === 'guest');
  
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(
    ownedWorkspaces.length > 0 ? ownedWorkspaces[0].id : null
  );


  const members: WorkspaceMember[] = [
    {
      id: '1',
      email: 'mike@example.com',
      role: 'editor',
      joinedAt: '2024-02-01',
    },
    {
      id: '2',
      email: 'emma@example.com',
      role: 'viewer',
      joinedAt: '2024-02-10',
    },
    {
      id: '3',
      email: 'guest@example.com',
      role: 'guest',
      joinedAt: '2024-03-01',
    },
  ];

  const handleInvite = (values: InviteFormValues) => {
    const workspace = workspaces.find(w => w.id === selectedWorkspaceForInvite);
    toast.success(`Invitation sent to ${values.email} as ${values.role} for workspace "${workspace?.name}"`);
    
    // Reset form and close dialog
    form.reset();
    setInviteDialog(false);
    setSelectedWorkspaceForInvite(null);
  };

  const handleOpenInviteDialog = (workspaceId: string) => {
    setSelectedWorkspaceForInvite(workspaceId);
    form.reset();
    setInviteDialog(true);
  };

  const handleLeaveWorkspace = (workspaceId: string) => {
    toast.success('Left workspace successfully');
  };

  const handleRemoveMember = (memberId: string) => {
    toast.success('Member removed successfully');
  };

  const handleCreateWorkspace = (values: any) => {
    toast.success(`Workspace "${values.name}" created successfully`);
    createWorkspaceForm.reset();
    setCreateWorkspaceDialog(false);
  };

  const toggleWorkspaceExpansion = (workspaceId: string) => {
    setExpandedWorkspaces(prev => {
      const newSet = new Set(prev);
      if (newSet.has(workspaceId)) {
        newSet.delete(workspaceId);
      } else {
        newSet.add(workspaceId);
      }
      return newSet;
    });
  };

  const getRoleBadge = (role: WorkspaceRole) => {
    const roleConfig = {
      owner: { variant: 'default' as const, icon: Crown, label: 'Owner' },
      admin: { variant: 'secondary' as const, icon: Shield, label: 'Admin' },
      editor: { variant: 'outline' as const, icon: Edit3, label: 'Editor' },
      viewer: { variant: 'outline' as const, icon: Eye, label: 'Viewer' },
      guest: { variant: 'outline' as const, icon: UserCheck, label: 'Guest' },
    };

    const config = roleConfig[role];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="capitalize">
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Workspaces You Own/Manage */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">My Workspace</CardTitle>
              <CardDescription className="mt-1.5">
                Shared workspaces where you can invite and manage members
              </CardDescription>
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => setCreateWorkspaceDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Workspace
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {ownedWorkspaces.length > 0 ? (
            <div className="space-y-3">
              {ownedWorkspaces.map((workspace) => (
                <Collapsible key={workspace.id}>
                  <div className="rounded-lg border border-border/50 bg-card hover:border-primary/20 hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{workspace.name}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {workspace.memberCount} {workspace.memberCount === 1 ? 'member' : 'members'}
                            </span>
                            {workspace.dataSources && workspace.dataSources.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Database className="w-3.5 h-3.5" />
                                {workspace.dataSources.length} {workspace.dataSources.length === 1 ? 'source' : 'sources'}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              Created {new Date(workspace.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleWorkspaceExpansion(workspace.id)}
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform ${expandedWorkspaces.has(workspace.id) ? 'rotate-180' : ''}`} />
                          </Button>
                        </CollapsibleTrigger>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white z-50">
                            <DropdownMenuItem
                              onClick={() => handleOpenInviteDialog(workspace.id)}
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              Invite Members
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="w-4 h-4 mr-2" />
                              Workspace Settings
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <CollapsibleContent>
                      <div className="border-t border-border/50 p-4 space-y-4">
                        {/* Data Sources */}
                        {workspace.dataSources && workspace.dataSources.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Database className="w-4 h-4" />
                              Data Sources
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {workspace.dataSources.map((source, idx) => (
                                <Badge key={idx} variant="outline" className="bg-muted">
                                  {source}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Members */}
                        {workspace.members && workspace.members.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Team Members
                            </h4>
                            <div className="space-y-2">
                              {workspace.members.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xs font-medium">
                                      {member.email.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm">{member.email}</span>
                                  </div>
                                  {getRoleBadge(member.role)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>You don't manage any shared workspaces yet</p>
              <p className="text-sm mt-1">Create a new shared workspace to collaborate with your team</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workspaces You Were Invited To */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <div>
            <CardTitle className="text-xl">Shared Workspace</CardTitle>
            <CardDescription className="mt-1.5">
              Shared workspaces where you collaborate as a member
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {invitedWorkspaces.length > 0 ? (
            <div className="space-y-3">
              {invitedWorkspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card hover:border-primary/20 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{workspace.name}</h3>
                        {getRoleBadge(workspace.role)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {workspace.memberCount} {workspace.memberCount === 1 ? 'member' : 'members'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Joined {new Date(workspace.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white z-50">
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleLeaveWorkspace(workspace.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Leave Workspace
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>You haven't been invited to any workspaces yet</p>
              <p className="text-sm mt-1">When someone invites you to collaborate, it will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Workspace Members - Show for selected workspace */}
      {selectedWorkspace && (
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Team Members</CardTitle>
                <CardDescription className="mt-1.5">
                  Members in the selected workspace
                </CardDescription>
              </div>
              {ownedWorkspaces.find(w => w.id === selectedWorkspace) && (
                <Button
                  variant="outline"
                  onClick={() => handleOpenInviteDialog(selectedWorkspace)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Invite
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border/50">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-sm font-medium">
                            {member.email.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{member.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(member.role)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {ownedWorkspaces.find(w => w.id === selectedWorkspace) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="bg-white z-50">
                              <DropdownMenuItem>Change Role</DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRemoveMember(member.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invite Dialog */}
      <Dialog open={inviteDialog} onOpenChange={(open) => {
        setInviteDialog(open);
        if (!open) {
          form.reset();
          setSelectedWorkspaceForInvite(null);
        }
      }}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to collaborate on{' '}
              <span className="font-semibold text-foreground">
                {workspaces.find(w => w.id === selectedWorkspaceForInvite)?.name || 'this workspace'}
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleInvite)} className="space-y-6 py-4">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="colleague@example.com"
                        type="email"
                        {...field}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the email address of the person you want to invite
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role Selection */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="admin" className="cursor-pointer">
                          <div className="flex flex-col items-start py-1">
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-primary" />
                              <span className="font-medium">Admin</span>
                            </div>
                            <span className="text-xs text-muted-foreground mt-1">
                              Manage workspace settings, users, and all chat sessions
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="editor" className="cursor-pointer">
                          <div className="flex flex-col items-start py-1">
                            <div className="flex items-center gap-2">
                              <Edit3 className="w-4 h-4 text-secondary" />
                              <span className="font-medium">Editor</span>
                            </div>
                            <span className="text-xs text-muted-foreground mt-1">
                              Create and edit chat sessions within the workspace
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="viewer" className="cursor-pointer">
                          <div className="flex flex-col items-start py-1">
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">Viewer</span>
                            </div>
                            <span className="text-xs text-muted-foreground mt-1">
                              View chat sessions but cannot make changes
                            </span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the level of access for this team member
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    form.reset();
                    setInviteDialog(false);
                    setSelectedWorkspaceForInvite(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90"
                  disabled={form.formState.isSubmitting}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Create Workspace Dialog */}
      <Dialog open={createWorkspaceDialog} onOpenChange={setCreateWorkspaceDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Create New Workspace</DialogTitle>
            <DialogDescription>
              Create a new workspace to organize your data sources and collaborate with your team
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={createWorkspaceForm.handleSubmit(handleCreateWorkspace)} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                placeholder="My Workspace"
                {...createWorkspaceForm.register('name')}
                className="bg-white"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  createWorkspaceForm.reset();
                  setCreateWorkspaceDialog(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Workspace
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkspacesSettings;
