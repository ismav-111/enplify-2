
import { useState } from 'react';
import { Plus, PanelLeft, Trash, Edit, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import WorkspaceSection, { Workspace } from './WorkspaceSection';

interface SidebarProps {
  conversations: Array<{ id: string; title: string; preview: string }>;
  activeConversation: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onClearAll: () => void;
  onRenameConversation?: (id: string, newTitle: string) => void;
  onDeleteConversation?: (id: string) => void;
  workspaces?: Workspace[];
  onWorkspaceAction?: {
    onCreateWorkspace: () => void;
    onCreateSession: (workspaceId: string) => void;
    onSelectWorkspace: (workspaceId: string, sessionId?: string) => void;
    onToggleWorkspace: (workspaceId: string) => void;
    onRenameWorkspace: (workspaceId: string, newName: string) => void;
    onRenameSession: (workspaceId: string, sessionId: string, newName: string) => void;
    onDeleteWorkspace: (workspaceId: string) => void;
    onDeleteSession: (workspaceId: string, sessionId: string) => void;
    onInviteUsers: (workspaceId: string, sessionId: string) => void;
  };
}

const Sidebar = ({ 
  conversations, 
  activeConversation, 
  onNewChat, 
  onSelectConversation, 
  onClearAll,
  onRenameConversation,
  onDeleteConversation,
  workspaces = [],
  onWorkspaceAction
}: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [hoveredConversation, setHoveredConversation] = useState<string | null>(null);
  const [editingConversation, setEditingConversation] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Function to truncate title with ellipsis
  const truncateTitle = (title: string, maxLength: number = 20) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  const handleRenameClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const conversation = conversations.find(conv => conv.id === id);
    if (conversation) {
      setEditingConversation(id);
      setEditTitle(conversation.title);
    }
  };

  const handleRenameConfirm = () => {
    if (onRenameConversation && editingConversation && editTitle.trim()) {
      onRenameConversation(editingConversation, editTitle.trim());
    }
    setEditingConversation(null);
    setEditTitle('');
  };

  const handleRenameCancel = () => {
    setEditingConversation(null);
    setEditTitle('');
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedConversationId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (onDeleteConversation && selectedConversationId) {
      onDeleteConversation(selectedConversationId);
    }
    setDeleteDialogOpen(false);
    setSelectedConversationId(null);
  };

  return (
    <TooltipProvider>
      {/* Toggle Button - Visible when sidebar is closed */}
      {!isOpen && (
        <div className="fixed z-20 flex items-center gap-3">
          <div className="h-16 px-6 border-b border-gray-100 flex justify-between items-center">
            <h1 className="text-5xl font-bold text-[#4E50A8] font-comfortaa">
              enplify.ai
            </h1>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={() => setIsOpen(true)} 
                variant="secondary" 
                size="icon"
                className="h-10 w-10 rounded-full shadow-md"
              >
                <PanelLeft size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open sidebar</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Sidebar */}
      <div 
        className={`${isOpen ? 'w-80' : 'w-0 overflow-hidden'} bg-white border-r border-gray-100 flex flex-col h-screen transition-all duration-300 ease-in-out`}
      >
        {/* Header with close button - Match chat header height (h-16) */}
        <div className="h-16 px-6 border-b border-gray-100 flex justify-between items-center">
          <h1 className="text-5xl font-bold text-[#4E50A8] font-comfortaa">
            enplify.ai
          </h1>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={() => setIsOpen(false)}
                variant="ghost" 
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-gray-700"
              >
                <PanelLeft size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Close sidebar</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onNewChat}
                className="w-full bg-[#595fb7] hover:bg-[#4e50a8] active:bg-[#373995] text-white rounded-lg py-3 flex items-center justify-center gap-2 transition-all duration-200"
              >
                <Plus size={18} />
                New chat
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start a new conversation</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Conversations - Limited to 5 recent */}
        <div className="flex-1 overflow-y-auto px-2">
          <div className="px-2 mb-2">
            <div className="flex items-center justify-between my-4">
              <h3 className="text-sm font-medium text-gray-500">Recent conversations</h3>
              {conversations.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={onClearAll}
                      className="text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-1"
                    >
                      <Trash size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear all conversations</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            
            <div className="space-y-1 mb-6">
              {conversations.slice(0, 5).map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => editingConversation !== conv.id && onSelectConversation(conv.id)}
                  onMouseEnter={() => setHoveredConversation(conv.id)}
                  onMouseLeave={() => setHoveredConversation(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50 relative cursor-pointer ${
                    activeConversation === conv.id ? 'bg-[#F1F1F9]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {editingConversation === conv.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleRenameConfirm();
                            } else if (e.key === 'Escape') {
                              handleRenameCancel();
                            }
                          }}
                          className="text-sm font-medium flex-1 bg-transparent border-none outline-none focus:outline-none p-0 m-0"
                          autoFocus
                          onFocus={(e) => e.target.select()}
                          onBlur={handleRenameConfirm}
                        />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-50 p-1"
                              onClick={handleRenameConfirm}
                            >
                              <Check size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Save changes</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1"
                              onClick={handleRenameCancel}
                            >
                              <X size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cancel editing</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-gray-800 flex-1 pr-2 whitespace-nowrap overflow-hidden" title={conv.title}>
                          {truncateTitle(conv.title)}
                        </p>
                        {hoveredConversation === conv.id && (
                          <div className="flex gap-1 flex-shrink-0">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1"
                                  onClick={(e) => handleRenameClick(e, conv.id)}
                                >
                                  <Edit size={14} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Rename conversation</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-gray-400 hover:text-red-600 hover:bg-red-50 p-1"
                                  onClick={(e) => handleDeleteClick(e, conv.id)}
                                >
                                  <Trash size={14} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete conversation</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Workspaces Section */}
            {onWorkspaceAction && (
              <WorkspaceSection 
                workspaces={workspaces}
                onCreateWorkspace={onWorkspaceAction.onCreateWorkspace}
                onCreateSession={onWorkspaceAction.onCreateSession}
                onSelectWorkspace={onWorkspaceAction.onSelectWorkspace}
                onToggleWorkspace={onWorkspaceAction.onToggleWorkspace}
                onRenameWorkspace={onWorkspaceAction.onRenameWorkspace}
                onRenameSession={onWorkspaceAction.onRenameSession}
                onDeleteWorkspace={onWorkspaceAction.onDeleteWorkspace}
                onDeleteSession={onWorkspaceAction.onDeleteSession}
                onInviteUsers={onWorkspaceAction.onInviteUsers}
              />
            )}
          </div>
        </div>

        {/* Bottom padding */}
        <div className="p-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 text-center font-comfortaa">
            enplify 2.0
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the conversation 
              and all its messages.
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
    </TooltipProvider>
  );
};

export default Sidebar;
