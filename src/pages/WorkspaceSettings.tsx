import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
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

interface WorkspaceData {
  id: string;
  name: string;
  description: string;
  created: string;
  avatarUrl?: string;
}

interface WorkspaceSettingsProps {
  workspaceData?: WorkspaceData;
  onUpdate?: (data: Partial<WorkspaceData>) => void;
  onDelete?: () => void;
}

const WorkspaceSettings = ({ workspaceData, onUpdate, onDelete }: WorkspaceSettingsProps) => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (workspaceData) {
      setName(workspaceData.name);
      setDescription(workspaceData.description);
      setAvatarUrl(workspaceData.avatarUrl || '');
    }
  }, [workspaceData]);

  useEffect(() => {
    if (workspaceData) {
      const changed = 
        name !== workspaceData.name ||
        description !== workspaceData.description ||
        avatarUrl !== (workspaceData.avatarUrl || '');
      setHasChanges(changed);
    }
  }, [name, description, avatarUrl, workspaceData]);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Workspace name is required');
      return;
    }

    onUpdate?.({
      name: name.trim(),
      description: description.trim(),
      avatarUrl: avatarUrl.trim() || undefined
    });

    setHasChanges(false);
    toast.success('Workspace updated successfully');
  };

  const handleDelete = () => {
    onDelete?.();
    setDeleteDialogOpen(false);
    navigate('/settings');
    toast.success('Workspace deleted successfully');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!workspaceData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/settings')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Settings
          </Button>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">Workspace Settings</h1>
          <p className="text-muted-foreground">Manage your workspace details and preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Workspace Details</CardTitle>
            <CardDescription>Update your workspace information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="space-y-3">
              <Label>Workspace Avatar</Label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-semibold text-muted-foreground">
                      {getInitials(name)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Enter image URL"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter a URL to display as workspace avatar
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Workspace Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter workspace name"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this workspace"
                rows={3}
              />
            </div>

            {/* Created Date (Read-only) */}
            <div className="space-y-2">
              <Label>Created Date</Label>
              <div className="px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground">
                {new Date(workspaceData.created).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSave}
                disabled={!hasChanges}
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions for this workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Delete Workspace</p>
                <p className="text-sm text-muted-foreground">
                  This will permanently delete all workspace data
                </p>
              </div>
              <Button 
                variant="destructive" 
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{workspaceData.name}</strong>? This will permanently delete all workspace data, sessions, and settings. This action cannot be undone.
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

export default WorkspaceSettings;
