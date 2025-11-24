import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Trash2, 
  Edit3,
  User
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';

interface Workspace {
  id: string;
  name: string;
  memberCount: number;
  description: string;
  created: string;
  avatarUrl?: string;
}

interface GeneralSectionProps {
  workspace: Workspace;
  onBack: () => void;
  onRename: (workspaceId: string, newName: string) => void;
  onUpdateAvatar: (workspaceId: string, avatarUrl: string) => void;
  onDelete: (workspaceId: string) => void;
}

const GeneralSection = ({
  workspace,
  onBack,
  onRename,
  onUpdateAvatar,
  onDelete
}: GeneralSectionProps) => {
  const [editNameDialog, setEditNameDialog] = useState(false);
  const [editAvatarDialog, setEditAvatarDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [newName, setNewName] = useState(workspace.name);
  const [avatarUrl, setAvatarUrl] = useState(workspace.avatarUrl || '');

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

  const handleRename = () => {
    if (!newName.trim()) {
      toast.error('Please enter a workspace name');
      return;
    }
    onRename(workspace.id, newName.trim());
    setEditNameDialog(false);
  };

  const handleUpdateAvatar = () => {
    if (!avatarUrl.trim()) {
      toast.error('Please enter an avatar URL');
      return;
    }
    onUpdateAvatar(workspace.id, avatarUrl.trim());
    setEditAvatarDialog(false);
    toast.success('Workspace avatar updated');
  };

  const handleDelete = () => {
    onDelete(workspace.id);
    setDeleteDialog(false);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">{workspace.name}</h1>
        <p className="text-base text-muted-foreground">Manage workspace details and preferences</p>
      </div>

      {/* Workspace Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Workspace Details</CardTitle>
          <CardDescription>Basic information about this workspace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-lg ${workspace.avatarUrl ? 'bg-muted' : getAvatarColor(workspace.id)} flex items-center justify-center text-primary-foreground text-2xl font-semibold overflow-hidden`}>
              {workspace.avatarUrl ? (
                <img src={workspace.avatarUrl} alt={workspace.name} className="w-full h-full object-cover" />
              ) : (
                getInitials(workspace.name)
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-2">Workspace Icon</p>
              <Button variant="outline" size="sm" onClick={() => {
                setAvatarUrl(workspace.avatarUrl || '');
                setEditAvatarDialog(true);
              }}>
                <User className="h-4 w-4 mr-2" />
                Change Icon
              </Button>
            </div>
          </div>

          <Separator />

          {/* Name Section */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">Workspace Name</p>
              <p className="text-lg font-semibold text-foreground">{workspace.name}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => {
              setNewName(workspace.name);
              setEditNameDialog(true);
            }}>
              <Edit3 className="h-4 w-4 mr-2" />
              Rename
            </Button>
          </div>

          <Separator />

          {/* Other Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Created Date</p>
              <p className="text-base text-foreground">{workspace.created}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Members</p>
              <p className="text-base text-foreground">{workspace.memberCount} {workspace.memberCount === 1 ? 'member' : 'members'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
              <p className="text-base text-foreground">{workspace.description || 'No description'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone Card */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-xl text-destructive flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Delete Workspace
          </CardTitle>
          <CardDescription>Permanently remove this workspace and all its data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
            <p className="text-sm text-foreground mb-2">
              This action cannot be undone. Deleting this workspace will:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Remove all members from the workspace</li>
              <li>Disconnect all data sources</li>
              <li>Delete all workspace data and settings</li>
            </ul>
          </div>
          <Button variant="destructive" onClick={() => setDeleteDialog(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Workspace Permanently
          </Button>
        </CardContent>
      </Card>

      {/* Edit Name Dialog */}
      <Dialog open={editNameDialog} onOpenChange={setEditNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Workspace</DialogTitle>
            <DialogDescription>
              Enter a new name for this workspace
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRename();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditNameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Avatar Dialog */}
      <Dialog open={editAvatarDialog} onOpenChange={setEditAvatarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Workspace Icon</DialogTitle>
            <DialogDescription>
              Enter an image URL for the workspace icon
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="avatar-url">Icon URL</Label>
              <Input
                id="avatar-url"
                placeholder="https://example.com/icon.jpg"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdateAvatar();
                  }
                }}
              />
            </div>
            {avatarUrl && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-border">
                  <img src={avatarUrl} alt="Icon preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditAvatarDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAvatar}>
              Update Icon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{workspace.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
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

export default GeneralSection;
