import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProfileSettings from '@/components/settings/ProfileSettings';
import WorkspacesSettings from '@/components/settings/WorkspacesSettings';
import WorkspaceSettings from '@/pages/WorkspaceSettings';
import { toast } from 'sonner';

// Empty workspaces - user needs to create them
const mockWorkspaces: Array<{
  id: string;
  name: string;
  memberCount: number;
  description: string;
  created: string;
  dataSources: string[];
  avatarUrl?: string;
}> = [];

const Settings = () => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const [workspaces, setWorkspaces] = useState(mockWorkspaces);

  const handleCreateWorkspace = (name: string, description?: string) => {
    const newWorkspace = {
      id: `ws-${Date.now()}`,
      name,
      memberCount: 1,
      description: description || '',
      created: new Date().toISOString().split('T')[0],
      dataSources: [],
      avatarUrl: undefined
    };
    setWorkspaces(prev => [...prev, newWorkspace]);
    toast.success('Workspace created successfully');
  };

  const handleDeleteWorkspace = (workspaceId: string) => {
    setWorkspaces(prev => prev.filter(w => w.id !== workspaceId));
    navigate('/settings');
    toast.success('Workspace deleted successfully');
  };

  const handleRenameWorkspace = (workspaceId: string, newName: string) => {
    setWorkspaces(prev => prev.map(w => w.id === workspaceId ? {
      ...w,
      name: newName
    } : w));
    toast.success('Workspace renamed successfully');
  };

  const handleUpdateAvatar = (workspaceId: string, avatarUrl: string) => {
    setWorkspaces(prev => prev.map(w => w.id === workspaceId ? {
      ...w,
      avatarUrl
    } : w));
  };

  const handleUpdateWorkspace = (workspaceId: string, updates: Partial<{
    name: string;
    description: string;
    avatarUrl?: string;
  }>) => {
    setWorkspaces(prev => prev.map(w => w.id === workspaceId ? {
      ...w,
      ...updates
    } : w));
  };

  // If we have a workspaceId in the URL, show the workspace settings page
  if (workspaceId) {
    const workspace = workspaces.find(w => w.id === workspaceId);
    
    return (
      <WorkspaceSettings
        workspaceData={workspace}
        onUpdate={(updates) => handleUpdateWorkspace(workspaceId, updates)}
        onDelete={() => handleDeleteWorkspace(workspaceId)}
      />
    );
  }

  // Otherwise show the main settings page with workspace list
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account and workspace settings</p>
        </div>

        <div className="space-y-8">
          <WorkspacesSettings 
            workspaces={workspaces} 
            onCreateWorkspace={handleCreateWorkspace} 
            onDeleteWorkspace={handleDeleteWorkspace} 
            onRenameWorkspace={handleRenameWorkspace} 
            onUpdateAvatar={handleUpdateAvatar}
            onSelectWorkspace={(id) => navigate(`/settings/workspace/${id}`)} 
          />

          <div className="pt-8 border-t border-border">
            <ProfileSettings className="my-0 py-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;