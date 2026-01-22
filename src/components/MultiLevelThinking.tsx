import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThinkingAction {
  id: string;
  action: string;
  status: 'pending' | 'active' | 'completed';
}

interface MultiLevelThinkingProps {
  isActive: boolean;
}

const MultiLevelThinking = ({ isActive }: MultiLevelThinkingProps) => {
  const [showAll, setShowAll] = useState(false);
  const [actions, setActions] = useState<ThinkingAction[]>([
    { id: '1', action: 'Understanding your query...', status: 'pending' },
    { id: '2', action: 'Searching knowledge base', status: 'pending' },
    { id: '3', action: 'Retrieving relevant context', status: 'pending' },
    { id: '4', action: 'Analyzing information', status: 'pending' },
    { id: '5', action: 'Formulating response', status: 'pending' },
  ]);

  // Simulate progression through actions
  useEffect(() => {
    if (!isActive) {
      setActions(prev => prev.map(action => ({ ...action, status: 'pending' })));
      return;
    }

    // Start first action
    setActions(prev => {
      const newActions = [...prev];
      if (newActions[0]) newActions[0].status = 'active';
      return newActions;
    });

    const progressInterval = setInterval(() => {
      setActions(prev => {
        const newActions = [...prev];
        const activeIndex = newActions.findIndex(a => a.status === 'active');
        
        if (activeIndex >= 0) {
          newActions[activeIndex].status = 'completed';
          if (activeIndex + 1 < newActions.length) {
            newActions[activeIndex + 1].status = 'active';
          }
        }
        
        return newActions;
      });
    }, 400);

    return () => clearInterval(progressInterval);
  }, [isActive]);

  const activeAction = actions.find(a => a.status === 'active');
  const completedCount = actions.filter(a => a.status === 'completed').length;

  return (
    <div className="flex mb-8">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 mt-1 border border-border">
        <span className="text-foreground font-bold text-sm font-comfortaa">e</span>
      </div>
      <div className="ml-3 flex-1">
        <div className="mb-3">
          {/* Compact collapsed view */}
          <div 
            className="inline-flex items-center gap-2 cursor-pointer group"
            onClick={() => setShowAll(!showAll)}
          >
            <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronDown 
                size={14} 
                className={cn(
                  "transition-transform duration-200",
                  showAll && "rotate-180"
                )}
              />
              <span className="text-xs">
                {activeAction ? activeAction.action : `Thinking...`}
              </span>
              <span className="text-xs text-primary">
                <span className="animate-pulse">.</span>
                <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
              </span>
            </div>
          </div>

          {/* Expanded thinking details */}
          {showAll && (
            <div className="mt-2 ml-1 pl-3 border-l border-border/60 space-y-1">
              {actions.map((action) => (
                <div key={action.id} className="flex items-center gap-2 py-0.5">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors",
                    action.status === 'completed' && "bg-green-500",
                    action.status === 'active' && "bg-primary animate-pulse",
                    action.status === 'pending' && "bg-muted-foreground/30"
                  )} />
                  <span className={cn(
                    "text-xs transition-colors",
                    action.status === 'completed' && "text-muted-foreground",
                    action.status === 'active' && "text-foreground",
                    action.status === 'pending' && "text-muted-foreground/50"
                  )}>
                    {action.action}
                  </span>
                  {action.status === 'active' && (
                    <span className="text-xs text-primary">
                      <span className="animate-pulse">.</span>
                      <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiLevelThinking;
