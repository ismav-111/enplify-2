import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Folder, 
  FolderOpen, 
  Plus, 
  Users, 
  ChevronDown, 
  ChevronRight,
  MoreHorizontal,
  UserPlus,
  Edit,
  Trash,
  Check,
  X,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface Session {
  id: string;
  name: string;
  isActive: boolean;
  memberCount?: number;
  isOwner: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  isExpanded: boolean;
  isActive: boolean;
  sessions: Session[];
  isOwner: boolean;
  isShared: boolean;
  memberCount?: number;
}

interface WorkspaceSectionProps {
  workspaces: Workspace[];
  onCreateWorkspace: (data?: {
    name: string;
    dataSources: Array<{
      id: string;
      config: Record<string, string>;
    }>;
    invitedUsers: { email: string; role: string }[];
    isShared?: boolean;
  }) => void;
  onCreateSession: (workspaceId: string) => void;
  onSelectWorkspace: (workspaceId: string, sessionId?: string) => void;
  onToggleWorkspace: (workspaceId: string) => void;
  onRenameWorkspace: (workspaceId: string, newName: string) => void;
  onRenameSession: (workspaceId: string, sessionId: string, newName: string) => void;
  onDeleteWorkspace: (workspaceId: string) => void;
  onDeleteSession: (workspaceId: string, sessionId: string) => void;
  onInviteUsers: (workspaceId: string, sessionId: string) => void;
  onInviteToWorkspace: (workspaceId: string) => void;
  onWorkspaceSettings: (workspaceId: string) => void;
}

const WorkspaceSection = ({
  workspaces,
  onCreateWorkspace,
  onCreateSession,
  onSelectWorkspace,
  onToggleWorkspace,
  onRenameWorkspace,
  onRenameSession,
  onDeleteWorkspace,
  onDeleteSession,
  onInviteUsers,
  onInviteToWorkspace,
  onWorkspaceSettings
}: WorkspaceSectionProps) => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [inviteDialog, setInviteDialog] = useState<{
    open: boolean;
    workspaceId: string;
    sessionId: string;
    workspaceName: string;
    sessionName: string;
  }>({
    open: false,
    workspaceId: '',
    sessionId: '',
    workspaceName: '',
    sessionName: ''
  });
  const [inviteEmail, setInviteEmail] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: 'workspace' | 'session';
    workspaceId: string;
    sessionId?: string;
    name: string;
  }>({
    open: false,
    type: 'workspace',
    workspaceId: '',
    name: ''
  });

  const truncateTitle = (title: string, maxLength: number = 20) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  const handleRenameClick = (e: React.MouseEvent, id: string, currentName: string) => {
    e.stopPropagation();
    setEditingItem(id);
    setEditTitle(currentName);
  };

  const handleRenameConfirm = (id: string, type: 'workspace' | 'session') => {
    if (editTitle.trim()) {
      if (type === 'workspace') {
        onRenameWorkspace(id, editTitle.trim());
      } else {
        const [workspaceId, sessionId] = id.split('__');
        onRenameSession(workspaceId, sessionId, editTitle.trim());
      }
    }
    setEditingItem(null);
    setEditTitle('');
  };

  const handleRenameCancel = () => {
    setEditingItem(null);
    setEditTitle('');
  };

  const handleDeleteClick = (
    e: React.MouseEvent, 
    type: 'workspace' | 'session', 
    workspaceId: string, 
    name: string,
    sessionId?: string
  ) => {
    e.stopPropagation();
    setDeleteDialog({
      open: true,
      type,
      workspaceId,
      sessionId,
      name
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.type === 'workspace') {
      onDeleteWorkspace(deleteDialog.workspaceId);
    } else if (deleteDialog.sessionId) {
      onDeleteSession(deleteDialog.workspaceId, deleteDialog.sessionId);
    }
    setDeleteDialog({ ...deleteDialog, open: false });
  };

  const handleInviteClick = (
    e: React.MouseEvent, 
    workspaceId: string, 
    sessionId: string, 
    workspaceName: string,
    sessionName: string
  ) => {
    e.stopPropagation();
    setInviteDialog({
      open: true,
      workspaceId,
      sessionId,
      workspaceName,
      sessionName
    });
    setInviteEmail('');
  };

  const handleInviteSend = () => {
    if (inviteEmail.trim()) {
      onInviteUsers(inviteDialog.workspaceId, inviteDialog.sessionId);
      setInviteDialog({ ...inviteDialog, open: false });
      setInviteEmail('');
    }
  };

  // Separate personal and shared workspaces
  const personalWorkspaces = workspaces.filter(w => !w.isShared);
  const sharedWorkspaces = workspaces.filter(w => w.isShared);

  const renderWorkspace = (workspace: Workspace) => {
    return (
      <div key={workspace.id} className="mb-1">
        {/* Main Workspace */}
        <div
          className={`w-full text-left px-2 py-1.5 rounded-md transition-all duration-150 hover:bg-gray-50 cursor-pointer group ${
            workspace.isActive ? 'bg-[#F1F1F9]' : ''
          }`}
          onMouseEnter={() => setHoveredItem(workspace.id)}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => onSelectWorkspace(workspace.id)}
        >
          <div className="flex items-center gap-1.5">
            {/* Expand/Collapse */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWorkspace(workspace.id);
              }}
              className="h-4 w-4 p-0 flex-shrink-0 hover:bg-transparent"
            >
              {workspace.isExpanded ? (
                <ChevronDown size={12} className="text-gray-500" />
              ) : (
                <ChevronRight size={12} className="text-gray-500" />
              )}
            </Button>

            {/* Title or Edit */}
            {editingItem === workspace.id ? (
              <div className="flex items-center gap-1 flex-1">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRenameConfirm(workspace.id, 'workspace');
                    } else if (e.key === 'Escape') {
                      handleRenameCancel();
                    }
                  }}
                  className="text-xs font-medium flex-1 bg-white border border-gray-300 rounded px-1 py-0.5 outline-none focus:border-[#4E50A8]"
                  autoFocus
                  onFocus={(e) => e.target.select()}
                  onBlur={() => handleRenameConfirm(workspace.id, 'workspace')}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 p-0"
                  onClick={() => handleRenameConfirm(workspace.id, 'workspace')}
                >
                  <Check size={10} className="text-green-600" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 p-0"
                  onClick={handleRenameCancel}
                >
                  <X size={10} className="text-gray-400" />
                </Button>
              </div>
            ) : (
              <>
                <span className="text-xs font-medium text-gray-800 truncate flex-1" title={workspace.name}>
                  {truncateTitle(workspace.name)}
                </span>
                
                {workspace.isShared && workspace.memberCount !== undefined && (
                  <div className="flex items-center gap-0.5 text-gray-400 mr-1">
                    <Users size={10} />
                    <span className="text-[10px]">{workspace.memberCount}</span>
                  </div>
                )}
                
                <div className="flex gap-0.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCreateSession(workspace.id);
                        }}
                      >
                        <Plus size={10} className="text-gray-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Add session</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal size={10} className="text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32 bg-white">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onWorkspaceSettings(workspace.id);
                        }}
                      >
                        <Settings size={10} className="mr-2" />
                        Settings
                      </DropdownMenuItem>
                      {workspace.isShared && (
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            onInviteToWorkspace(workspace.id);
                          }}
                        >
                          <UserPlus size={10} className="mr-2" />
                          Invite
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRenameClick(e, workspace.id, workspace.name);
                        }}
                      >
                        <Edit size={10} className="mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(e, 'workspace', workspace.id, workspace.name);
                        }}
                        className="text-red-600"
                      >
                        <Trash size={10} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sessions */}
        {workspace.isExpanded && workspace.sessions.length > 0 && (
          <div className="ml-5 mt-0.5 space-y-0.5">
            {workspace.sessions.map((session) => {
              const sessionId = `${workspace.id}__${session.id}`;
              return (
                <div
                  key={sessionId}
                  className={`w-full text-left px-2 py-1 rounded-md transition-all duration-150 hover:bg-gray-50 cursor-pointer group ${
                    session.isActive ? 'bg-[#F1F1F9]' : ''
                  }`}
                  onMouseEnter={() => setHoveredItem(sessionId)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => onSelectWorkspace(workspace.id, session.id)}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 flex-shrink-0"></div>
                    
                    {editingItem === sessionId ? (
                      <div className="flex items-center gap-1 flex-1">
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleRenameConfirm(sessionId, 'session');
                            } else if (e.key === 'Escape') {
                              handleRenameCancel();
                            }
                          }}
                          className="text-xs flex-1 bg-white border border-gray-300 rounded px-1 py-0.5 outline-none focus:border-[#4E50A8]"
                          autoFocus
                          onFocus={(e) => e.target.select()}
                          onBlur={() => handleRenameConfirm(sessionId, 'session')}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-4 w-4 p-0"
                          onClick={() => handleRenameConfirm(sessionId, 'session')}
                        >
                          <Check size={9} className="text-green-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-4 w-4 p-0"
                          onClick={handleRenameCancel}
                        >
                          <X size={9} className="text-gray-400" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs text-gray-700 truncate flex-1" title={session.name}>
                          {truncateTitle(session.name, 22)}
                        </span>
                        
                        {hoveredItem === sessionId && (
                          <div className={`flex gap-0.5 transition-opacity opacity-100`}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-4 w-4 p-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal size={9} className="text-gray-400" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRenameClick(e, sessionId, session.name);
                                  }}
                                >
                                  <Edit size={9} className="mr-2" />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(e, 'session', workspace.id, session.name, session.id);
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash size={9} className="mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div>
        {workspaces.length > 0 ? (
          <>
            {/* My Workspaces Section */}
            {personalWorkspaces.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">My Workspaces</h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => navigate('/settings')}
                    className="h-5 w-5 p-0"
                  >
                        <Plus size={12} className="text-gray-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>New workspace</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="space-y-0.5">
                  {personalWorkspaces.map(renderWorkspace)}
                </div>
              </div>
            )}

            {/* Shared Workspaces Section */}
            {sharedWorkspaces.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Shared Workspaces</h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => navigate('/settings')}
                    className="h-5 w-5 p-0"
                  >
                    <Plus size={12} className="text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>New shared workspace</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="space-y-0.5">
                  {sharedWorkspaces.map(renderWorkspace)}
                </div>
              </div>
            )}
          </>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Workspaces</h3>
              <Tooltip>
                <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/settings')}
                className="h-5 w-5 p-0"
              >
                <Plus size={12} className="text-gray-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>New workspace</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="text-center py-4">
          <p className="text-[11px] text-gray-500 mb-2">No workspaces yet</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/settings')}
            className="h-7 text-[11px]"
          >
                <Plus size={11} className="mr-1" />
                Create workspace
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Invite Dialog */}
      <Dialog open={inviteDialog.open} onOpenChange={(open) => setInviteDialog({ ...inviteDialog, open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite to Session</DialogTitle>
            <DialogDescription>
              Invite users to collaborate on <strong>{inviteDialog.sessionName}</strong> in <strong>{inviteDialog.workspaceName}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="invite-email">Email address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleInviteSend();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setInviteDialog({ ...inviteDialog, open: false })}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleInviteSend}
              disabled={!inviteEmail.trim()}
            >
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteDialog.type === 'workspace' ? 'Workspace' : 'Session'}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteDialog.name}</strong>? 
              {deleteDialog.type === 'workspace' 
                ? ' This will also delete all sessions and cannot be undone.' 
                : ' This action cannot be undone.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WorkspaceSection;