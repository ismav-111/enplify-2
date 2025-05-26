
import { useState } from 'react';
import { Plus, Menu, PanelLeft, Trash, Edit, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [editingTitle, setEditingTitle] = useState('');

  const handleRenameClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const conversation = conversations.find(conv => conv.id === id);
    if (conversation) {
      setEditingConversation(id);
      setEditingTitle(conversation.title);
    }
  };

  const handleRenameSubmit = (id: string) => {
    if (onRenameConversation && editingTitle.trim()) {
      onRenameConversation(id, editingTitle.trim());
    }
    setEditingConversation(null);
    setEditingTitle('');
  };

  const handleRenameCancel = () => {
    setEditingConversation(null);
    setEditingTitle('');
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onDeleteConversation && window.confirm('Are you sure you want to delete this conversation?')) {
      onDeleteConversation(id);
    }
  };

  return (
    <>
      {/* Toggle Button - Visible when sidebar is closed */}
      {!isOpen && (
        <div className="fixed top-4 left-4 z-30">
          <Button 
            onClick={() => setIsOpen(true)} 
            variant="secondary" 
            size="icon"
            className="h-10 w-10 rounded-full shadow-lg bg-white hover:bg-gray-50 border border-gray-200"
          >
            <Menu size={20} />
          </Button>
        </div>
      )}

      {/* Sidebar */}
      <div 
        className={`${isOpen ? 'w-80' : 'w-0 overflow-hidden'} bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-300 ease-in-out shadow-sm`}
      >
        {/* Header with close button */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-[#4E50A8] to-[#5A5BC0] text-white">
          <h1 className="text-2xl font-bold font-comfortaa">
            enplify.ai
          </h1>
          <Button 
            onClick={() => setIsOpen(false)}
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
          >
            <PanelLeft size={18} />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button 
            onClick={onNewChat}
            className="w-full bg-[#4E50A8] hover:bg-[#3e3f86] text-white rounded-xl py-3 flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus size={18} />
            New chat
          </Button>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto px-2">
          <div className="px-2 mb-2">
            <div className="flex items-center justify-between my-4">
              <h3 className="text-sm font-semibold text-gray-600">Your conversations</h3>
              {conversations.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClearAll}
                  className="text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-full"
                  title="Clear all conversations"
                >
                  <Trash size={16} />
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onMouseEnter={() => setHoveredConversation(conv.id)}
                  onMouseLeave={() => setHoveredConversation(null)}
                  className={`relative rounded-xl transition-all duration-200 ${
                    activeConversation === conv.id 
                      ? 'bg-[#F1F1F9] border-l-4 border-[#4E50A8] shadow-sm' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {editingConversation === conv.id ? (
                    <div className="p-3">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRenameSubmit(conv.id);
                          if (e.key === 'Escape') handleRenameCancel();
                        }}
                        onBlur={() => handleRenameSubmit(conv.id)}
                        className="w-full text-sm font-medium text-gray-800 bg-transparent border-none outline-none"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => onSelectConversation(conv.id)}
                      className="w-full text-left p-3 rounded-xl transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate group-hover:text-[#4E50A8]">
                            {conv.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-1 max-w-[200px]">
                            {conv.preview}
                          </p>
                        </div>
                        
                        {hoveredConversation === conv.id && editingConversation !== conv.id && (
                          <div className="flex gap-1 ml-2 flex-shrink-0">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full"
                              onClick={(e) => handleRenameClick(e, conv.id)}
                              title="Rename conversation"
                            >
                              <Edit size={12} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                              onClick={(e) => handleDeleteClick(e, conv.id)}
                              title="Delete conversation"
                            >
                              <X size={12} />
                            </Button>
                          </div>
                        )}
                      </div>
                    </button>
                  )}
                </div>
              ))}
              
              {conversations.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400">No conversations yet</p>
                  <p className="text-xs text-gray-400 mt-1">Start a new chat to begin</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/50">
          <div className="text-xs text-gray-500 text-center">
            enplify.ai v1.0
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
