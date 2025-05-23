
import { useState } from 'react';
import { Plus, MessageSquare, Menu, PanelLeft, Trash, Edit } from 'lucide-react';
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
        className={`${isOpen ? 'w-80' : 'w-0 overflow-hidden'} bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-300 ease-in-out`}
      >
        {/* Header with close button */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            CHAT A.I+
          </h1>
          <Button 
            onClick={() => setIsOpen(false)}
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
          >
            <PanelLeft size={18} />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button 
            onClick={onNewChat}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white rounded-lg py-3 flex items-center justify-center gap-2 transition-all duration-200"
          >
            <Plus size={18} />
            New chat
          </Button>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Your conversations</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearAll}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Clear All
              </Button>
            </div>
            
            <div className="space-y-1">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`w-full text-left p-2 rounded-lg transition-all duration-200 hover:bg-gray-50 group ${
                    activeConversation === conv.id ? 'bg-gray-100 border-l-4 border-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">{conv.title}</p>
                    <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                      <Edit size={14} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                      <Trash size={14} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
