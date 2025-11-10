
import { useState, useEffect } from 'react';
import ProfileSettings from '@/components/settings/ProfileSettings';
import DataSourceSettings from '@/components/settings/DataSourceSettings';
import WorkspacesSettings from '@/components/settings/WorkspacesSettings';
import { ChevronLeft, LogOut, Briefcase, Database, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Workspaces",
    icon: Briefcase,
    value: "workspaces"
  },
  {
    title: "Data Sources",
    icon: Database,
    value: "data-sources"
  },
  {
    title: "Profile",
    icon: User,
    value: "profile"
  }
];

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("workspaces");

  // Check URL parameters for section selection
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab === 'data-sources') {
      setActiveSection('data-sources');
    } else if (tab === 'workspaces') {
      setActiveSection('workspaces');
    } else if (tab === 'profile') {
      setActiveSection('profile');
    }
  }, [location.search]);

  const handleLogout = () => {
    toast.success('Logged out successfully');
    navigate('/signin');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'workspaces':
        return <WorkspacesSettings />;
      case 'data-sources':
        return <DataSourceSettings />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return <WorkspacesSettings />;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-muted/20">
        <Sidebar className="border-r border-border/50">
          <SidebarContent>
            <SidebarGroup className="px-0 py-4">
              <div className="px-4 mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Settings
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Manage your preferences</p>
              </div>
              
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.value}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.value)}
                        isActive={activeSection === item.value}
                        className="w-full justify-start px-4 py-3 text-base"
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>

              <div className="px-4 mt-auto pt-6">
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="w-full justify-start hover:border-destructive hover:text-destructive transition-all"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border/50 bg-background/50 backdrop-blur-sm px-6">
            <SidebarTrigger className="h-8 w-8" />
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
                <h1 className="text-2xl font-bold">
                  {menuItems.find(item => item.value === activeSection)?.title}
                </h1>
                <p className="text-sm text-muted-foreground">Manage your {activeSection}</p>
              </div>
            </div>
          </header>

          <div className="flex-1 p-6 overflow-auto">
            {renderContent()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
