import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  UserCheck
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
}

const WorkspacesSettings = () => {
  const [inviteDialog, setInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  
  // Mock data - replace with actual data from your backend
  // Only shared workspaces
  const workspaces: Workspace[] = [
    {
      id: '1',
      name: 'Team Alpha',
      memberCount: 5,
      role: 'owner',
      createdAt: '2024-01-15',
      isShared: true,
    },
    {
      id: '2',
      name: 'Marketing Team',
      memberCount: 8,
      role: 'viewer',
      createdAt: '2024-01-20',
      isShared: true,
    },
    {
      id: '3',
      name: 'Client Work',
      memberCount: 3,
      role: 'admin',
      createdAt: '2024-02-20',
      isShared: true,
    },
    {
      id: '4',
      name: 'Product Design',
      memberCount: 4,
      role: 'editor',
      createdAt: '2024-03-01',
      isShared: true,
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

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setInviteDialog(false);
    }
  };

  const handleLeaveWorkspace = (workspaceId: string) => {
    toast.success('Left workspace successfully');
  };

  const handleRemoveMember = (memberId: string) => {
    toast.success('Member removed successfully');
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
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Shared Workspace
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {ownedWorkspaces.length > 0 ? (
            <div className="space-y-3">
              {ownedWorkspaces.map((workspace) => (
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
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {workspace.memberCount} {workspace.memberCount === 1 ? 'member' : 'members'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Created {new Date(workspace.createdAt).toLocaleDateString()}
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
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedWorkspace(workspace.id);
                          setInviteDialog(true);
                        }}
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
                    <DropdownMenuContent align="end">
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
                  onClick={() => setInviteDialog(true)}
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
                            <DropdownMenuContent align="end">
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
      <Dialog open={inviteDialog} onOpenChange={setInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to collaborate on this workspace
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email Address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite} className="bg-primary hover:bg-primary/90">
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkspacesSettings;
