import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Eye, EyeOff, Brain, Database, FileSearch, Lightbulb, Cpu, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ThinkingLayer {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed';
  icon: React.ReactNode;
  details?: string;
  subLayers?: ThinkingLayer[];
}

interface MultiLevelThinkingProps {
  isActive: boolean;
}

const MultiLevelThinking = ({ isActive }: MultiLevelThinkingProps) => {
  const [showAll, setShowAll] = useState(false);
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set(['understanding']));
  const [currentLayerIndex, setCurrentLayerIndex] = useState(0);
  const [layers, setLayers] = useState<ThinkingLayer[]>([
    {
      id: 'understanding',
      name: 'Understanding Query',
      status: 'pending',
      icon: <Brain size={14} />,
      details: 'Parsing user intent and extracting key concepts...',
      subLayers: [
        { id: 'intent', name: 'Intent Classification', status: 'pending', icon: <Lightbulb size={12} /> },
        { id: 'entities', name: 'Entity Extraction', status: 'pending', icon: <FileSearch size={12} /> },
      ]
    },
    {
      id: 'retrieval',
      name: 'Data Retrieval',
      status: 'pending',
      icon: <Database size={14} />,
      details: 'Searching enterprise knowledge base and connected sources...',
      subLayers: [
        { id: 'vector', name: 'Vector Search', status: 'pending', icon: <Network size={12} /> },
        { id: 'context', name: 'Context Assembly', status: 'pending', icon: <FileSearch size={12} /> },
      ]
    },
    {
      id: 'reasoning',
      name: 'Reasoning Engine',
      status: 'pending',
      icon: <Cpu size={14} />,
      details: 'Applying business logic and generating insights...',
      subLayers: [
        { id: 'analysis', name: 'Pattern Analysis', status: 'pending', icon: <Lightbulb size={12} /> },
        { id: 'synthesis', name: 'Response Synthesis', status: 'pending', icon: <Brain size={12} /> },
      ]
    },
    {
      id: 'formatting',
      name: 'Response Formatting',
      status: 'pending',
      icon: <FileSearch size={14} />,
      details: 'Structuring output for optimal presentation...',
    },
  ]);

  // Simulate progression through layers
  useEffect(() => {
    if (!isActive) {
      setCurrentLayerIndex(0);
      setLayers(prev => prev.map(layer => ({
        ...layer,
        status: 'pending',
        subLayers: layer.subLayers?.map(sub => ({ ...sub, status: 'pending' }))
      })));
      return;
    }

    const progressInterval = setInterval(() => {
      setLayers(prev => {
        const newLayers = [...prev];
        
        // Find current active layer
        let activeFound = false;
        for (let i = 0; i < newLayers.length; i++) {
          const layer = newLayers[i];
          
          if (layer.status === 'active') {
            // Check if all sublayers are done
            if (layer.subLayers) {
              const pendingSubLayer = layer.subLayers.find(sub => sub.status !== 'completed');
              if (pendingSubLayer) {
                const activeSubLayer = layer.subLayers.find(sub => sub.status === 'active');
                if (activeSubLayer) {
                  activeSubLayer.status = 'completed';
                } else {
                  pendingSubLayer.status = 'active';
                }
                activeFound = true;
                break;
              }
            }
            // Complete this layer and move to next
            layer.status = 'completed';
            if (i + 1 < newLayers.length) {
              newLayers[i + 1].status = 'active';
              setExpandedLayers(prev => new Set([...prev, newLayers[i + 1].id]));
            }
            activeFound = true;
            break;
          } else if (layer.status === 'pending' && i === 0) {
            layer.status = 'active';
            if (layer.subLayers && layer.subLayers.length > 0) {
              layer.subLayers[0].status = 'active';
            }
            activeFound = true;
            break;
          }
        }
        
        return newLayers;
      });
    }, 800);

    return () => clearInterval(progressInterval);
  }, [isActive]);

  const toggleLayer = (layerId: string) => {
    setExpandedLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: ThinkingLayer['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'active': return 'text-primary';
      case 'pending': return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status: ThinkingLayer['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-50 border-green-200';
      case 'active': return 'bg-primary/5 border-primary/20';
      case 'pending': return 'bg-muted/30 border-muted';
    }
  };

  const renderLayer = (layer: ThinkingLayer, depth: number = 0) => {
    const isExpanded = expandedLayers.has(layer.id);
    const hasSubLayers = layer.subLayers && layer.subLayers.length > 0;

    return (
      <div key={layer.id} className={cn("transition-all duration-200", depth > 0 && "ml-4")}>
        <div
          className={cn(
            "flex items-center gap-2 py-1.5 px-2 rounded-md transition-all duration-200 cursor-pointer",
            layer.status === 'active' && "bg-primary/5",
            layer.status === 'completed' && "opacity-70"
          )}
          onClick={() => hasSubLayers && toggleLayer(layer.id)}
        >
          {/* Expand/Collapse Icon */}
          {hasSubLayers ? (
            <span className="text-muted-foreground">
              {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </span>
          ) : (
            <span className="w-3" />
          )}

          {/* Status Indicator */}
          <div className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            layer.status === 'completed' && "bg-green-500",
            layer.status === 'active' && "bg-primary animate-pulse",
            layer.status === 'pending' && "bg-muted-foreground/30"
          )} />

          {/* Icon */}
          <span className={cn("transition-colors duration-200", getStatusColor(layer.status))}>
            {layer.icon}
          </span>

          {/* Layer Name */}
          <span className={cn(
            "text-xs font-medium transition-colors duration-200",
            getStatusColor(layer.status)
          )}>
            {layer.name}
          </span>

          {/* Active Indicator */}
          {layer.status === 'active' && (
            <span className="text-primary text-xs">
              <span className="animate-pulse">.</span>
              <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
            </span>
          )}
        </div>

        {/* Sub-layers */}
        {hasSubLayers && isExpanded && showAll && (
          <div className="mt-1 space-y-0.5 border-l-2 border-muted ml-3 pl-2">
            {layer.subLayers!.map(subLayer => (
              <div
                key={subLayer.id}
                className={cn(
                  "flex items-center gap-2 py-1 px-2 rounded text-xs transition-all duration-200",
                  subLayer.status === 'active' && "bg-primary/5"
                )}
              >
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  subLayer.status === 'completed' && "bg-green-500",
                  subLayer.status === 'active' && "bg-primary animate-pulse",
                  subLayer.status === 'pending' && "bg-muted-foreground/20"
                )} />
                <span className={getStatusColor(subLayer.status)}>{subLayer.icon}</span>
                <span className={cn("transition-colors duration-200", getStatusColor(subLayer.status))}>
                  {subLayer.name}
                </span>
                {subLayer.status === 'active' && (
                  <span className="text-primary">
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Details (only when expanded and showAll) */}
        {layer.details && isExpanded && showAll && layer.status === 'active' && (
          <p className="text-[10px] text-muted-foreground ml-7 mt-1 italic">
            {layer.details}
          </p>
        )}
      </div>
    );
  };

  const activeLayer = layers.find(l => l.status === 'active');
  const completedCount = layers.filter(l => l.status === 'completed').length;

  return (
    <div className="flex mb-8">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 mt-1 border border-border">
        <span className="text-foreground font-bold text-sm font-comfortaa">e</span>
      </div>
      <div className="ml-3 flex-1">
        <div className="bg-card border border-border rounded-lg p-3 shadow-sm max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold bg-gradient-to-r from-[#595fb7] to-[#4e50a8] bg-clip-text text-transparent">
                Thinking
              </span>
              <span className="text-xs text-muted-foreground">
                ({completedCount}/{layers.length} layers)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs gap-1"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? (
                <>
                  <EyeOff size={12} />
                  Hide
                </>
              ) : (
                <>
                  <Eye size={12} />
                  Show All
                </>
              )}
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-muted rounded-full mb-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#595fb7] to-[#4e50a8] transition-all duration-500"
              style={{ width: `${((completedCount + 0.5) / layers.length) * 100}%` }}
            />
          </div>

          {/* Layers */}
          <div className="space-y-0.5">
            {showAll ? (
              layers.map(layer => renderLayer(layer))
            ) : (
              // Compact view - only show active layer
              activeLayer && (
                <div className="flex items-center gap-2 py-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-primary">{activeLayer.icon}</span>
                  <span className="text-xs font-medium text-primary">
                    {activeLayer.name}
                  </span>
                  <span className="text-primary text-xs">
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                    <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
                  </span>
                </div>
              )
            )}
          </div>

          {/* Current activity hint */}
          {activeLayer && !showAll && (
            <p className="text-[10px] text-muted-foreground mt-2 italic">
              {activeLayer.details}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiLevelThinking;
