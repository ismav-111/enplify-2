import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, FileSpreadsheet, Database, Globe, ArrowRight, Settings } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const Welcome = () => {
  const navigate = useNavigate();
  const [connectedSources, setConnectedSources] = useState<Record<string, boolean>>({});
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connectionProgress, setConnectionProgress] = useState(0);

  const quickConnectSources = [
    {
      id: 'sql',
      name: 'SQL Database',
      description: 'Connect your primary database',
      icon: Database,
      popular: true
    },
    {
      id: 'sharepoint',
      name: 'SharePoint',
      description: 'Access your documents',
      icon: FileSpreadsheet,
      popular: true
    },
    {
      id: 'website',
      name: 'Website',
      description: 'Connect to web content',
      icon: Globe,
      popular: false
    }
  ];

  const handleQuickConnect = async (sourceId: string) => {
    setConnecting(sourceId);
    setConnectionProgress(0);
    
    // Simulate connection progress
    const progressInterval = setInterval(() => {
      setConnectionProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate connection time
    setTimeout(() => {
      clearInterval(progressInterval);
      setConnectedSources(prev => ({...prev, [sourceId]: true}));
      const sourceName = quickConnectSources.find(s => s.id === sourceId)?.name;
      toast.success(`Connected to ${sourceName}`);
      setConnecting(null);
      setConnectionProgress(0);
    }, 2000);
  };

  const handleSkipForNow = () => {
    navigate('/');
  };

  const handleConfigureAll = () => {
    navigate('/settings?tab=data-sources');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Your AI Assistant!</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            To get the most out of your AI assistant, let's connect your data sources. 
            This will allow the AI to provide more accurate and relevant responses.
          </p>
        </div>

        {/* Quick Connect Section */}
        <Card className="p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Quick Setup</h2>
              <p className="text-gray-600">Connect your most important data sources to get started</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickConnectSources.map((source) => (
                <Card key={source.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <source.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      {source.popular && (
                        <Badge variant="secondary" className="text-xs">Popular</Badge>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{source.name}</h3>
                      <p className="text-sm text-gray-600">{source.description}</p>
                    </div>

                    {connectedSources[source.id] ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Connected</span>
                      </div>
                    ) : connecting === source.id ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-600">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm">Connecting...</span>
                        </div>
                        <Progress value={connectionProgress} className="h-2" />
                      </div>
                    ) : (
                      <Button 
                        onClick={() => handleQuickConnect(source.id)}
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                      >
                        Quick Connect
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>

        {/* Progress Indicator */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Setup Progress</h3>
              <p className="text-sm text-gray-600">
                {Object.values(connectedSources).filter(Boolean).length} of {quickConnectSources.length} data sources connected
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((Object.values(connectedSources).filter(Boolean).length / quickConnectSources.length) * 100)}%
              </div>
              <div className="text-xs text-gray-500">Complete</div>
            </div>
          </div>
          <Progress 
            value={(Object.values(connectedSources).filter(Boolean).length / quickConnectSources.length) * 100} 
            className="mt-4 h-3"
          />
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleConfigureAll}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            <Settings className="w-5 h-5 mr-2" />
            Configure All Data Sources
          </Button>
          
          <Button 
            onClick={handleSkipForNow}
            variant="outline"
            className="px-8 py-3 text-lg"
          >
            Skip for Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-center text-sm text-gray-500">
          <p>You can always configure data sources later from the Settings page.</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;