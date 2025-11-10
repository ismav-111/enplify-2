
import { useState, useEffect } from 'react';
import ProfileSettings from '@/components/settings/ProfileSettings';
import DataSourceSettings from '@/components/settings/DataSourceSettings';
import WorkspacesSettings from '@/components/settings/WorkspacesSettings';
import { ArrowLeft, LogOut, Briefcase, Database, User, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Workspaces",
    icon: Briefcase,
    value: "workspaces",
    description: "Manage workspaces and teams"
  },
  {
    title: "Data Sources",
    icon: Database,
    value: "data-sources",
    description: "Configure data connections"
  },
  {
    title: "Profile",
    icon: User,
    value: "profile",
    description: "Personal information"
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
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="border-b border-border px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <SettingsIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Settings</h2>
                <p className="text-xs text-muted-foreground">Manage preferences</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-3 py-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="gap-2">
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.value}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.value)}
                        isActive={activeSection === item.value}
                        className={`
                          w-full justify-start px-3 py-3 text-sm font-medium
                          transition-all duration-200 rounded-lg h-auto min-h-[48px]
                          ${activeSection === item.value 
                            ? 'bg-primary text-primary-foreground shadow-sm' 
                            : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                          }
                        `}
                      >
                        <item.icon className="h-4 w-4 mr-3 shrink-0 mt-0.5" />
                        <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
                          <span className="leading-tight">{item.title}</span>
                          {activeSection !== item.value && (
                            <span className="text-xs opacity-70 font-normal leading-tight">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-border p-3">
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="w-full justify-start text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="bg-muted/30">
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <div className="flex items-center gap-3 flex-1">
              <SidebarTrigger className="h-7 w-7" />
              <Separator orientation="vertical" className="h-5" />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </header>

          <main className="flex-1 p-8 animate-fade-in">
            <div className="max-w-5xl">
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">
                  {menuItems.find(item => item.value === activeSection)?.title}
                </h1>
                <p className="text-muted-foreground mt-1.5">
                  {menuItems.find(item => item.value === activeSection)?.description}
                </p>
              </div>
              
              <div className="animate-fade-in">
                {renderContent()}
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
