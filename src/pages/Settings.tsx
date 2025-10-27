
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from '@/components/settings/ProfileSettings';
import DataSourceSettings from '@/components/settings/DataSourceSettings';
import WorkspacesSettings from '@/components/settings/WorkspacesSettings';
import { ChevronLeft, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("workspaces");

  // Check URL parameters for tab selection
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab === 'data-sources') {
      setActiveTab('data-sources');
    } else if (tab === 'workspaces') {
      setActiveTab('workspaces');
    }
  }, [location.search]);

  const handleLogout = () => {
    toast.success('Logged out successfully');
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Modern Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="h-10 w-10 rounded-full hover:bg-primary/10 transition-all hover:scale-105"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-muted-foreground mt-1.5">Manage your account, preferences, and workspaces</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2 hover:border-destructive hover:text-destructive transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        
        {/* Modern Tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-card/50 backdrop-blur-sm border border-border/50 h-14 rounded-xl p-1 shadow-sm">
            <TabsTrigger 
              value="workspaces" 
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md h-11 text-base font-medium rounded-lg transition-all"
            >
              Workspaces
            </TabsTrigger>
            <TabsTrigger 
              value="data-sources" 
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md h-11 text-base font-medium rounded-lg transition-all"
            >
              Data Sources
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md h-11 text-base font-medium rounded-lg transition-all"
            >
              Profile
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="workspaces" className="mt-0">
            <WorkspacesSettings />
          </TabsContent>
          
          <TabsContent value="data-sources" className="mt-0">
            <DataSourceSettings />
          </TabsContent>
          
          <TabsContent value="profile" className="mt-0">
            <ProfileSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
