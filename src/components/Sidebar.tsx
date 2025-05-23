
import { useState } from 'react';
import { Plus, MessageSquare, Menu, PanelLeft, Trash, Edit, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  conversations: Array<{ id: string; title: string; preview: string }>;
  activeConversation: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onClearAll: () => void;
}

const Sidebar = ({ 
  conversations, 
  activeConversation, 
  onNewChat, 
  onSelectConversation, 
  onClearAll 
}: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [hoveredConversation, setHoveredConversation] = useState<string | null>(null);

  return (
    <>
      {/* Toggle Button - Visible when sidebar is closed */}
      {!isOpen && (
        <div className="fixed top-4 left-4 z-30">
          <Button 
            onClick={() => setIsOpen(true)} 
            variant="secondary" 
            size="icon"
            className="h-10 w-10 rounded-full shadow-md"
          >
            <Menu size={20} />
          </Button>
        </div>
      )}

      {/* Sidebar */}
      <div 
        className={`${isOpen ? 'w-80' : 'w-0 overflow-hidden'} bg-white border-r border-gray-100 flex flex-col h-screen transition-all duration-300 ease-in-out`}
      >
        {/* Header with close button */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#4E50A8] font-comfortaa">
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
            className="w-full bg-[#4E50A8] hover:bg-[#3e3f86] text-white rounded-lg py-3 flex items-center justify-center gap-2 transition-all duration-200"
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
                  size="sm" 
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
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  onMouseEnter={() => setHoveredConversation(conv.id)}
                  onMouseLeave={() => setHoveredConversation(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50 relative ${
                    activeConversation === conv.id ? 'bg-[#F1F1F9] border-l-4 border-[#4E50A8]' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <MessageSquare size={16} className="text-gray-400 mr-2" />
                    <p className="text-sm font-medium text-gray-800 truncate">{conv.title}</p>
                  </div>
                  
                  {hoveredConversation === conv.id && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Rename functionality would be added here
                        }}
                        title="Rename conversation"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Delete functionality would be added here
                        }}
                        title="Remove conversation"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom padding */}
        <div className="p-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 text-center">
            enplify.ai v1.0
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
