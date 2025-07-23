
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ChevronLeft, LogOut, User, Database } from 'lucide-react';
import ProfileSettings from '@/components/settings/ProfileSettings';
import DataSourceSettings from '@/components/settings/DataSourceSettings';

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab === 'data-sources') {
      setActiveTab('data-sources');
    }
  }, [location.search]);

  const handleLogout = () => {
    toast.success('Logged out successfully');
    navigate('/signin');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'data-sources', label: 'Data Sources', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50">
        <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-medium">Settings</h1>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 p-1 bg-muted rounded-lg w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="max-w-4xl">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'data-sources' && <DataSourceSettings />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
