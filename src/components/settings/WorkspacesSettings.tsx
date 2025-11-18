import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Plus, 
  MoreVertical, 
  Calendar,
  Trash2,
  Edit3,
  Database,
  User,
  Settings as SettingsIcon
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface WorkspaceSettingsData {
  id: string;
  name: string;
  memberCount: number;
  description: string;
  created: string;
  dataSources: string[];
  avatarUrl?: string;
}

interface WorkspacesSettingsProps {
  workspaces: WorkspaceSettingsData[];
  onCreateWorkspace: (name: string, description?: string) => void;
  onDeleteWorkspace: (workspaceId: string) => void;
  onRenameWorkspace: (workspaceId: string, newName: string) => void;
  onSelectWorkspace: (workspaceId: string) => void;
  onUpdateAvatar: (workspaceId: string, avatarUrl: string) => void;
}

const WorkspacesSettings = ({
  workspaces,
  onCreateWorkspace,
  onDeleteWorkspace,
  onRenameWorkspace,
  onSelectWorkspace,
  onUpdateAvatar
}: WorkspacesSettingsProps) => {
  const navigate = useNavigate();
  const [createDialog, setCreateDialog] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) {
      toast.error('Please enter a workspace name');
      return;
    }
    onCreateWorkspace(newWorkspaceName.trim(), newWorkspaceDescription.trim());
    setNewWorkspaceName('');
    setNewWorkspaceDescription('');
    setCreateDialog(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (id: string) => {
    const colors = [
      'bg-[hsl(var(--primary))]',
      'bg-[hsl(var(--chart-1))]',
      'bg-[hsl(var(--chart-2))]',
      'bg-[hsl(var(--chart-3))]',
      'bg-[hsl(var(--chart-4))]',
    ];
    const index = id.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="space-y-6 flex flex-col items-center w-full">
      <div className="space-y-2 w-full max-w-2xl">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">My Workspaces</h1>
      </div>

      <div className="space-y-3 w-full max-w-2xl">
        {workspaces.map((workspace) => (
          <Card key={workspace.id} className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => onSelectWorkspace(workspace.id)}>
                  <div className={`w-10 h-10 rounded-lg ${workspace.avatarUrl ? 'bg-muted' : getAvatarColor(workspace.id)} flex items-center justify-center text-primary-foreground font-semibold overflow-hidden`}>
                    {workspace.avatarUrl ? (
                      <img src={workspace.avatarUrl} alt={workspace.name} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(workspace.name)
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{workspace.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {workspace.memberCount} {workspace.memberCount === 1 ? 'person' : 'people'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/settings/workspace/${workspace.id}`)}
                >
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setCreateDialog(true)}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                <Plus className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">New Workspace</h3>
                <p className="text-sm text-muted-foreground">Create new workspace for your next project.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Workspace Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
            <DialogDescription>
              Create a new workspace to organize your team and data sources
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name *</Label>
              <Input
                id="workspace-name"
                placeholder="e.g., Marketing Team"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateWorkspace();
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspace-description">Description (Optional)</Label>
              <Input
                id="workspace-description"
                placeholder="Brief description of this workspace"
                value={newWorkspaceDescription}
                onChange={(e) => setNewWorkspaceDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkspace}>
              Create Workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default WorkspacesSettings;
