
import { useState } from 'react';
import ProfileSettings from '@/components/settings/ProfileSettings';
import { ArrowLeft, Briefcase, ChevronDown, ChevronRight, Grid, Users as UsersIcon, Database, Settings as SettingsIcon, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  SidebarHeader,
} from "@/components/ui/sidebar";

// Mock workspaces data
const mockWorkspaces = [
  { id: '1', name: 'Marketing Team', memberCount: 12, description: 'Marketing and content team workspace', created: '2024-01-15', dataSources: ['Google Drive', 'YouTube'] },
  { id: '2', name: 'Engineering', memberCount: 25, description: 'Engineering team workspace', created: '2024-01-10', dataSources: ['GitHub', 'Jira'] },
  { id: '3', name: 'Sales', memberCount: 8, description: 'Sales team workspace', created: '2024-02-01', dataSources: ['Salesforce'] },
  { id: '4', name: 'Analytics', memberCount: 5, description: 'Analytics team workspace', created: '2024-02-15', dataSources: [] }
];

type WorkspaceSection = 'overview' | 'members' | 'data-sources' | 'settings';

interface ActiveView {
  type: 'workspace' | 'profile';
  workspaceId?: string;
  section?: WorkspaceSection;
}

const Settings = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ActiveView>({ 
    type: 'workspace', 
    workspaceId: '1', 
    section: 'overview' 
  });
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(new Set(['1']));

  const toggleWorkspace = (workspaceId: string) => {
    setExpandedWorkspaces(prev => {
      const newSet = new Set(prev);
      if (newSet.has(workspaceId)) {
        newSet.delete(workspaceId);
      } else {
        newSet.add(workspaceId);
      }
      return newSet;
    });
  };

  const handleSectionClick = (workspaceId: string, section: WorkspaceSection) => {
    setActiveView({ type: 'workspace', workspaceId, section });
    if (!expandedWorkspaces.has(workspaceId)) {
      toggleWorkspace(workspaceId);
    }
  };

  const renderWorkspaceContent = () => {
    if (activeView.type === 'profile') {
      return <ProfileSettings />;
    }

    const workspace = mockWorkspaces.find(w => w.id === activeView.workspaceId);
    if (!workspace) return null;

    switch (activeView.section) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{workspace.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">{workspace.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Workspace Name</p>
                <p className="text-base text-foreground">{workspace.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Created</p>
                <p className="text-base text-foreground">{workspace.created}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                <p className="text-base text-foreground">{workspace.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Members</p>
                <p className="text-base text-foreground">{workspace.memberCount}</p>
              </div>
            </div>

            {workspace.dataSources.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Connected Data Sources</p>
                <div className="flex gap-2">
                  {workspace.dataSources.map((source) => (
                    <Badge key={source} variant="secondary" className="px-3 py-1">
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 'members':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage members and their roles in {workspace.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Members management coming soon...</p>
            </CardContent>
          </Card>
        );
      case 'data-sources':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>Configure data connections for {workspace.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workspace.dataSources.length > 0 ? (
                  workspace.dataSources.map((source) => (
                    <div key={source} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{source}</span>
                      </div>
                      <Badge variant="outline">Connected</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No data sources connected</p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      case 'settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Workspace Settings</CardTitle>
              <CardDescription>Configure settings for {workspace.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Workspace settings coming soon...</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r border-border w-64">
          <SidebarHeader className="border-b border-border p-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="w-full justify-start text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </SidebarHeader>

          <SidebarContent className="px-3 py-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {/* Workspaces Section */}
                  <div className="mb-2">
                    <Collapsible open={true}>
                      <CollapsibleTrigger className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground w-full hover:bg-muted/50 rounded-md transition-colors">
                        <Briefcase className="h-4 w-4" />
                        <span className="flex-1 text-left">Workspaces</span>
                        <ChevronDown className="h-4 w-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-1 space-y-0.5">
                        {mockWorkspaces.map((workspace) => (
                          <Collapsible
                            key={workspace.id}
                            open={expandedWorkspaces.has(workspace.id)}
                            onOpenChange={() => toggleWorkspace(workspace.id)}
                          >
                            <CollapsibleTrigger className="flex items-center gap-2 pl-6 pr-3 py-2 text-sm text-foreground w-full hover:bg-muted/50 rounded-md transition-colors">
                              <span className="flex-1 text-left">{workspace.name}</span>
                              {expandedWorkspaces.has(workspace.id) ? (
                                <ChevronDown className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronRight className="h-3.5 w-3.5" />
                              )}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-0.5 space-y-0.5">
                              <SidebarMenuItem>
                                <SidebarMenuButton
                                  onClick={() => handleSectionClick(workspace.id, 'overview')}
                                  isActive={activeView.type === 'workspace' && activeView.workspaceId === workspace.id && activeView.section === 'overview'}
                                  className={`
                                    pl-12 pr-3 py-2 text-sm transition-colors rounded-md
                                    ${activeView.type === 'workspace' && activeView.workspaceId === workspace.id && activeView.section === 'overview'
                                      ? 'bg-primary text-primary-foreground font-medium' 
                                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }
                                  `}
                                >
                                  <Grid className="h-3.5 w-3.5 mr-2" />
                                  Overview
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton
                                  onClick={() => handleSectionClick(workspace.id, 'members')}
                                  isActive={activeView.type === 'workspace' && activeView.workspaceId === workspace.id && activeView.section === 'members'}
                                  className={`
                                    pl-12 pr-3 py-2 text-sm transition-colors rounded-md
                                    ${activeView.type === 'workspace' && activeView.workspaceId === workspace.id && activeView.section === 'members'
                                      ? 'bg-primary text-primary-foreground font-medium' 
                                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }
                                  `}
                                >
                                  <UsersIcon className="h-3.5 w-3.5 mr-2" />
                                  Members
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton
                                  onClick={() => handleSectionClick(workspace.id, 'data-sources')}
                                  isActive={activeView.type === 'workspace' && activeView.workspaceId === workspace.id && activeView.section === 'data-sources'}
                                  className={`
                                    pl-12 pr-3 py-2 text-sm transition-colors rounded-md
                                    ${activeView.type === 'workspace' && activeView.workspaceId === workspace.id && activeView.section === 'data-sources'
                                      ? 'bg-primary text-primary-foreground font-medium' 
                                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }
                                  `}
                                >
                                  <Database className="h-3.5 w-3.5 mr-2" />
                                  Data Sources
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton
                                  onClick={() => handleSectionClick(workspace.id, 'settings')}
                                  isActive={activeView.type === 'workspace' && activeView.workspaceId === workspace.id && activeView.section === 'settings'}
                                  className={`
                                    pl-12 pr-3 py-2 text-sm transition-colors rounded-md
                                    ${activeView.type === 'workspace' && activeView.workspaceId === workspace.id && activeView.section === 'settings'
                                      ? 'bg-primary text-primary-foreground font-medium' 
                                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }
                                  `}
                                >
                                  <SettingsIcon className="h-3.5 w-3.5 mr-2" />
                                  Settings
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>

                  {/* Profile Section */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveView({ type: 'profile' })}
                      isActive={activeView.type === 'profile'}
                      className={`
                        px-3 py-2 text-sm transition-colors rounded-md
                        ${activeView.type === 'profile'
                          ? 'bg-primary text-primary-foreground font-medium' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }
                      `}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <SidebarTrigger className="h-7 w-7" />
          </header>

          <main className="p-8 animate-fade-in">
            <div className="max-w-4xl">
              {renderWorkspaceContent()}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
