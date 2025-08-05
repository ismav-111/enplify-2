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

interface SidebarProps {
  conversations: Array<{ id: string; title: string; preview: string }>;
  activeConversation: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onClearAll: () => void;
  onRenameConversation?: (id: string, newTitle: string) => void;
  onDeleteConversation?: (id: string) => void;
}

const Sidebar = ({ 
  conversations, 
  activeConversation, 
  onNewChat, 
  onSelectConversation, 
  onClearAll,
  onRenameConversation,
  onDeleteConversation
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
    <>
      {/* Toggle Button - Visible when sidebar is closed */}
      {!isOpen && (
        <div className="fixed top-4 left-4 z-30 flex items-center gap-3">
          <div className="bg-white px-6 py-3 rounded-full">
            <span className="text-3xl font-bold text-[#4E50A8] font-comfortaa">
              enplify.ai
            </span>
          </div>
          <Button 
            onClick={() => setIsOpen(true)} 
            variant="secondary" 
            size="icon"
            className="h-10 w-10 rounded-full shadow-md"
          >
            <PanelLeft size={20} />
          </Button>
        </div>
      )}

      {/* Sidebar */}
      <div 
        className={`${isOpen ? 'w-80' : 'w-0 overflow-hidden'} bg-white border-r border-gray-100 flex flex-col h-screen transition-all duration-300 ease-in-out`}
      >
        {/* Header with close button - matching chat header height */}
        <div className="h-20 p-6 border-b border-gray-100 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#4E50A8] font-comfortaa">
            enplify.ai
          </h1>
          <Button 
            onClick={() => setIsOpen(false)}
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-gray-700"
          >
            <PanelLeft size={18} />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button 
            onClick={onNewChat}
            className="w-full bg-[#595fb7] hover:bg-[#4e50a8] active:bg-[#373995] text-white rounded-lg py-3 flex items-center justify-center gap-2 transition-all duration-200"
          >
            <Plus size={18} />
            New chat
          </Button>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto px-2">
          <div className="px-2 mb-2">
            <div className="flex items-center justify-between my-4">
              <h3 className="text-sm font-medium text-gray-500">Your conversations</h3>
              {conversations.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClearAll}
                  className="text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-1"
                  title="Clear all conversations"
                >
                  <Trash size={16} />
                </Button>
              )}
            </div>
            
            <div className="space-y-1">
              {conversations.map((conv) => (
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
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-50 p-1"
                          onClick={handleRenameConfirm}
                          title="Save"
                        >
                          <Check size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1"
                          onClick={handleRenameCancel}
                          title="Cancel"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-gray-800 flex-1 pr-2 whitespace-nowrap overflow-hidden" title={conv.title}>
                          {truncateTitle(conv.title)}
                        </p>
                        {hoveredConversation === conv.id && (
                          <div className="flex gap-1 flex-shrink-0">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1"
                              onClick={(e) => handleRenameClick(e, conv.id)}
                              title="Rename conversation"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-gray-400 hover:text-red-600 hover:bg-red-50 p-1"
                              onClick={(e) => handleDeleteClick(e, conv.id)}
                              title="Delete conversation"
                            >
                              <Trash size={14} />
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
    </>
  );
};

export default Sidebar;
