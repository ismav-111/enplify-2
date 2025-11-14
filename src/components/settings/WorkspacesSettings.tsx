import { useState } from 'react';
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
  Database
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface WorkspaceSettingsData {
  id: string;
  name: string;
  memberCount: number;
  description: string;
  created: string;
  dataSources: string[];
}

interface WorkspacesSettingsProps {
  workspaces: WorkspaceSettingsData[];
  onCreateWorkspace: (name: string, description?: string) => void;
  onDeleteWorkspace: (workspaceId: string) => void;
  onRenameWorkspace: (workspaceId: string, newName: string) => void;
  onSelectWorkspace: (workspaceId: string) => void;
}

const WorkspacesSettings = ({
  workspaces,
  onCreateWorkspace,
  onDeleteWorkspace,
  onRenameWorkspace,
  onSelectWorkspace
}: WorkspacesSettingsProps) => {
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<{ open: boolean; workspaceId: string; currentName: string }>({
    open: false,
    workspaceId: '',
    currentName: ''
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; workspaceId: string; name: string }>({
    open: false,
    workspaceId: '',
    name: ''
  });
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');
  const [editWorkspaceName, setEditWorkspaceName] = useState('');

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

  const handleRenameWorkspace = () => {
    if (!editWorkspaceName.trim()) {
      toast.error('Please enter a workspace name');
      return;
    }
    onRenameWorkspace(editDialog.workspaceId, editWorkspaceName.trim());
    setEditDialog({ open: false, workspaceId: '', currentName: '' });
    setEditWorkspaceName('');
  };

  const handleDeleteWorkspace = () => {
    onDeleteWorkspace(deleteDialog.workspaceId);
    setDeleteDialog({ open: false, workspaceId: '', name: '' });
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
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">My Workspaces</h1>
      </div>

      <div className="space-y-3">
        {workspaces.map((workspace) => (
          <Card key={workspace.id} className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => onSelectWorkspace(workspace.id)}>
                  <div className={`w-10 h-10 rounded-lg ${getAvatarColor(workspace.id)} flex items-center justify-center text-primary-foreground font-semibold`}>
                    {getInitials(workspace.name)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{workspace.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Free Forever • {workspace.memberCount} {workspace.memberCount === 1 ? 'person' : 'people'}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Settings
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditDialog({ 
                          open: true, 
                          workspaceId: workspace.id, 
                          currentName: workspace.name 
                        });
                        setEditWorkspaceName(workspace.name);
                      }}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteDialog({ 
                          open: true, 
                          workspaceId: workspace.id, 
                          name: workspace.name 
                        });
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

      {/* Edit Workspace Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ ...editDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Workspace</DialogTitle>
            <DialogDescription>
              Enter a new name for this workspace
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-workspace-name">Workspace Name</Label>
              <Input
                id="edit-workspace-name"
                value={editWorkspaceName}
                onChange={(e) => setEditWorkspaceName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRenameWorkspace();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog({ open: false, workspaceId: '', currentName: '' })}>
              Cancel
            </Button>
            <Button onClick={handleRenameWorkspace}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Workspace Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteDialog.name}</strong>? This will also delete all sessions and data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteWorkspace}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Workspace
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkspacesSettings;
