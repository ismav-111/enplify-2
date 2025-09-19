import { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  Plus, 
  Users, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  MoreHorizontal,
  UserPlus,
  Edit,
  Trash,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export interface SubWorkspace {
  id: string;
  name: string;
  isActive: boolean;
  memberCount: number;
  isOwner: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  isExpanded: boolean;
  isActive: boolean;
  subWorkspaces: SubWorkspace[];
  isOwner: boolean;
}

interface WorkspaceSectionProps {
  workspaces: Workspace[];
  onCreateWorkspace: () => void;
  onCreateSubWorkspace: (workspaceId: string) => void;
  onSelectWorkspace: (workspaceId: string, subWorkspaceId?: string) => void;
  onToggleWorkspace: (workspaceId: string) => void;
  onRenameWorkspace: (workspaceId: string, newName: string) => void;
  onRenameSubWorkspace: (workspaceId: string, subWorkspaceId: string, newName: string) => void;
  onDeleteWorkspace: (workspaceId: string) => void;
  onDeleteSubWorkspace: (workspaceId: string, subWorkspaceId: string) => void;
  onInviteUsers: (workspaceId: string, subWorkspaceId: string) => void;
}

const WorkspaceSection = ({
  workspaces,
  onCreateWorkspace,
  onCreateSubWorkspace,
  onSelectWorkspace,
  onToggleWorkspace,
  onRenameWorkspace,
  onRenameSubWorkspace,
  onDeleteWorkspace,
  onDeleteSubWorkspace,
  onInviteUsers
}: WorkspaceSectionProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: 'workspace' | 'subworkspace';
    workspaceId: string;
    subWorkspaceId?: string;
    name: string;
  }>({
    open: false,
    type: 'workspace',
    workspaceId: '',
    name: ''
  });

  const truncateTitle = (title: string, maxLength: number = 18) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  const handleRenameClick = (e: React.MouseEvent, id: string, currentName: string) => {
    e.stopPropagation();
    setEditingItem(id);
    setEditTitle(currentName);
  };

  const handleRenameConfirm = (id: string, type: 'workspace' | 'subworkspace') => {
    if (editTitle.trim()) {
      if (type === 'workspace') {
        onRenameWorkspace(id, editTitle.trim());
      } else {
        const [workspaceId, subWorkspaceId] = id.split('-');
        onRenameSubWorkspace(workspaceId, subWorkspaceId, editTitle.trim());
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
    type: 'workspace' | 'subworkspace', 
    workspaceId: string, 
    name: string,
    subWorkspaceId?: string
  ) => {
    e.stopPropagation();
    setDeleteDialog({
      open: true,
      type,
      workspaceId,
      subWorkspaceId,
      name
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.type === 'workspace') {
      onDeleteWorkspace(deleteDialog.workspaceId);
    } else if (deleteDialog.subWorkspaceId) {
      onDeleteSubWorkspace(deleteDialog.workspaceId, deleteDialog.subWorkspaceId);
    }
    setDeleteDialog({ ...deleteDialog, open: false });
  };

  return (
    <>
      <div className="px-2 mb-2">
        <div className="flex items-center justify-between my-4">
          <h3 className="text-sm font-medium text-gray-500">Workspaces</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onCreateWorkspace}
                className="text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-1"
              >
                <Plus size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create workspace</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-1">
          {workspaces.map((workspace) => (
            <div key={workspace.id} className="space-y-1">
              {/* Main Workspace */}
              <div
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50 relative cursor-pointer ${
                  workspace.isActive ? 'bg-[#F1F1F9]' : ''
                }`}
                onMouseEnter={() => setHoveredItem(workspace.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => onSelectWorkspace(workspace.id)}
              >
                <div className="flex items-center justify-between">
                  {editingItem === workspace.id ? (
                    <div className="flex items-center gap-2 w-full">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleWorkspace(workspace.id)}
                        className="h-4 w-4 p-0 flex-shrink-0"
                      >
                        {workspace.isExpanded ? (
                          <ChevronDown size={12} />
                        ) : (
                          <ChevronRight size={12} />
                        )}
                      </Button>
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
                        className="text-sm font-medium flex-1 bg-transparent border-none outline-none focus:outline-none p-0 m-0"
                        autoFocus
                        onFocus={(e) => e.target.select()}
                        onBlur={() => handleRenameConfirm(workspace.id, 'workspace')}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-50 p-1"
                        onClick={() => handleRenameConfirm(workspace.id, 'workspace')}
                      >
                        <Check size={12} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1"
                        onClick={handleRenameCancel}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 flex-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWorkspace(workspace.id);
                          }}
                          className="h-4 w-4 p-0 flex-shrink-0"
                        >
                          {workspace.isExpanded ? (
                            <ChevronDown size={12} />
                          ) : (
                            <ChevronRight size={12} />
                          )}
                        </Button>
                        {workspace.isExpanded ? (
                          <FolderOpen size={14} className="text-[#4E50A8] flex-shrink-0" />
                        ) : (
                          <Folder size={14} className="text-gray-500 flex-shrink-0" />
                        )}
                        <span className="text-sm font-medium text-gray-800 truncate" title={workspace.name}>
                          {truncateTitle(workspace.name)}
                        </span>
                      </div>
                      
                      {hoveredItem === workspace.id && workspace.isOwner && (
                        <div className="flex gap-1 flex-shrink-0">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCreateSubWorkspace(workspace.id);
                                }}
                              >
                                <Plus size={12} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add subworkspace</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal size={12} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRenameClick(e, workspace.id, workspace.name);
                                }}
                              >
                                <Edit size={12} className="mr-2" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(e, 'workspace', workspace.id, workspace.name);
                                }}
                                className="text-red-600"
                              >
                                <Trash size={12} className="mr-2" />
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

              {/* Subworkspaces */}
              {workspace.isExpanded && (
                <div className="ml-6 space-y-1">
                  {workspace.subWorkspaces.map((subWorkspace) => {
                    const subId = `${workspace.id}-${subWorkspace.id}`;
                    return (
                      <div
                        key={subId}
                        className={`w-full text-left px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-gray-50 relative cursor-pointer ${
                          subWorkspace.isActive ? 'bg-[#F1F1F9]' : ''
                        }`}
                        onMouseEnter={() => setHoveredItem(subId)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={() => onSelectWorkspace(workspace.id, subWorkspace.id)}
                      >
                        <div className="flex items-center justify-between">
                          {editingItem === subId ? (
                            <div className="flex items-center gap-2 w-full">
                              <div className="w-4 flex-shrink-0"></div>
                              <input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleRenameConfirm(subId, 'subworkspace');
                                  } else if (e.key === 'Escape') {
                                    handleRenameCancel();
                                  }
                                }}
                                className="text-sm flex-1 bg-transparent border-none outline-none focus:outline-none p-0 m-0"
                                autoFocus
                                onFocus={(e) => e.target.select()}
                                onBlur={() => handleRenameConfirm(subId, 'subworkspace')}
                              />
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-5 w-5 text-green-600 hover:text-green-700 hover:bg-green-50 p-1"
                                onClick={() => handleRenameConfirm(subId, 'subworkspace')}
                              >
                                <Check size={10} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-5 w-5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1"
                                onClick={handleRenameCancel}
                              >
                                <X size={10} />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 flex-1">
                                <div className="w-4 flex-shrink-0"></div>
                                <span className="text-sm text-gray-700 truncate" title={subWorkspace.name}>
                                  {truncateTitle(subWorkspace.name)}
                                </span>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                  <Users size={10} />
                                  <span>{subWorkspace.memberCount}</span>
                                </div>
                              </div>
                              
                              {hoveredItem === subId && (
                                <div className="flex gap-1 flex-shrink-0">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-5 w-5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-1"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onInviteUsers(workspace.id, subWorkspace.id);
                                        }}
                                      >
                                        <UserPlus size={10} />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Invite users</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  
                                  {subWorkspace.isOwner && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-5 w-5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <MoreHorizontal size={10} />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="w-40">
                                        <DropdownMenuItem 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRenameClick(e, subId, subWorkspace.name);
                                          }}
                                        >
                                          <Edit size={10} className="mr-2" />
                                          Rename
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(e, 'subworkspace', workspace.id, subWorkspace.name, subWorkspace.id);
                                          }}
                                          className="text-red-600"
                                        >
                                          <Trash size={10} className="mr-2" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
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
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteDialog.type === 'workspace' ? 'Workspace' : 'Subworkspace'}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog.name}"? 
              {deleteDialog.type === 'workspace' 
                ? ' This will also delete all subworkspaces and their data.' 
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