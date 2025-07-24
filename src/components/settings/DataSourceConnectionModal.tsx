
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ConfigField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface DataSourceConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: {
    id: string;
    name: string;
    icon: any;
    configFields: ConfigField[];
  };
  onConnect: (sourceId: string, sourceName: string) => void;
}

const DataSourceConnectionModal: React.FC<DataSourceConnectionModalProps> = ({
  isOpen,
  onClose,
  source,
  onConnect
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate random success/failure for demo
    const success = Math.random() > 0.3;
    if (success) {
      setConnectionStatus('success');
      toast.success('Connection test successful!');
    } else {
      setConnectionStatus('error');
      toast.error('Connection test failed. Please check your credentials.');
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    onConnect(source.id, source.name);
    setIsConnecting(false);
    onClose();
  };

  const SourceIcon = source.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <SourceIcon className="w-5 h-5 text-primary" />
            </div>
            Connect to {source.name}
          </DialogTitle>
          <DialogDescription>
            Enter your {source.name} credentials to establish a connection.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Configuration Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {source.configFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.type === 'textarea' ? (
                  <textarea 
                    className="w-full p-3 border border-input rounded-md bg-background text-foreground resize-none"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    rows={3}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                  />
                ) : field.type === 'select' ? (
                  <select 
                    className="w-full p-3 border border-input rounded-md bg-background text-foreground"
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                  >
                    <option value="">Select {field.label.toLowerCase()}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    type={field.type}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="h-11"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Connection Status */}
          {connectionStatus !== 'idle' && (
            <div className={`p-4 rounded-lg flex items-center gap-3 ${
              connectionStatus === 'testing' ? 'bg-blue-500/10 border border-blue-500/20' :
              connectionStatus === 'success' ? 'bg-green-500/10 border border-green-500/20' :
              'bg-red-500/10 border border-red-500/20'
            }`}>
              {connectionStatus === 'testing' && (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  <span className="text-blue-600">Testing connection...</span>
                </>
              )}
              {connectionStatus === 'success' && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-600">Connection successful!</span>
                </>
              )}
              {connectionStatus === 'error' && (
                <>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-600">Connection failed. Please check your credentials.</span>
                </>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={connectionStatus === 'testing' || isConnecting}
            >
              {connectionStatus === 'testing' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} disabled={isConnecting}>
                Cancel
              </Button>
              <Button 
                onClick={handleConnect}
                disabled={connectionStatus !== 'success' || isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataSourceConnectionModal;
