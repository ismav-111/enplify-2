
import { useState } from 'react';
import ProfileSettings from '@/components/settings/ProfileSettings';
import { ArrowLeft, Briefcase, ChevronDown, ChevronRight, Grid, Users as UsersIcon, Database, Settings as SettingsIcon, User, Trash2, Sparkles } from 'lucide-react';
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
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-foreground tracking-tight">{workspace.name}</h1>
              <p className="text-base text-muted-foreground">{workspace.description}</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Workspace Information</CardTitle>
                <CardDescription>Key details about this workspace</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Workspace Name</p>
                    <p className="text-base font-medium text-foreground">{workspace.name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Created Date</p>
                    <p className="text-base font-medium text-foreground">{workspace.created}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p className="text-base font-medium text-foreground">{workspace.description}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                    <p className="text-base font-medium text-foreground">{workspace.memberCount} members</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {workspace.dataSources.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Connected Data Sources</CardTitle>
                  <CardDescription>Active integrations for this workspace</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {workspace.dataSources.map((source) => (
                      <Badge key={source} variant="secondary" className="px-4 py-2 text-sm font-medium">
                        <Database className="h-3.5 w-3.5 mr-2" />
                        {source}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
      case 'members':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-foreground tracking-tight">Team Members</h1>
                <p className="text-base text-muted-foreground">Manage workspace members and their permissions</p>
              </div>
              <Button className="btn-primary shadow-md">
                <UsersIcon className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </div>

            <Card className="shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="border-b border-border">
                        <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Name</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Email</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Role</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Data Source Access</th>
                        <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">SJ</span>
                            </div>
                            <span className="text-sm font-medium text-foreground">Sarah Johnson</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-muted-foreground">sarah.j@company.com</td>
                        <td className="py-4 px-6">
                          <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">Admin</Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">Google Drive</Badge>
                            <Badge variant="outline" className="text-xs">Snowflake</Badge>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted">
                              <SettingsIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-accent">MC</span>
                            </div>
                            <span className="text-sm font-medium text-foreground">Mike Chen</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-muted-foreground">mike.c@company.com</td>
                        <td className="py-4 px-6">
                          <Badge variant="secondary" className="shadow-sm">Member</Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">Google Drive</Badge>
                            <Badge variant="outline" className="text-xs">OneDrive</Badge>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted">
                              <SettingsIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-secondary">ED</span>
                            </div>
                            <span className="text-sm font-medium text-foreground">Emily Davis</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-muted-foreground">emily.d@company.com</td>
                        <td className="py-4 px-6">
                          <Badge variant="secondary" className="shadow-sm">Member</Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">SharePoint</Badge>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted">
                              <SettingsIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'data-sources':
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-foreground tracking-tight">Data Sources</h1>
              <p className="text-base text-muted-foreground">Manage data source integrations for this workspace</p>
            </div>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Connected Data Sources</CardTitle>
                <CardDescription>Active integrations in this workspace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {workspace.dataSources.length > 0 ? (
                  workspace.dataSources.map((source) => (
                    <div key={source} className="flex items-center justify-between p-5 border border-border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Database className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-base font-semibold text-foreground">{source}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                              Connected
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50">
                        Disconnect
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground p-4 text-center">No data sources connected</p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Available Data Sources</CardTitle>
                <CardDescription>Connect new data sources to enhance your workspace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {['OneDrive', 'SharePoint', 'Snowflake', 'Salesforce', 'Confluence', 'Slack'].map((source) => (
                  <div key={source} className="flex items-center justify-between p-5 border border-border rounded-lg bg-background hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Database className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span className="text-base font-semibold text-foreground">{source}</span>
                    </div>
                    <Button className="btn-primary shadow-md" size="sm">
                      Connect
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-foreground tracking-tight">Workspace Settings</h1>
              <p className="text-base text-muted-foreground">Manage workspace configuration and preferences</p>
            </div>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">General Settings</CardTitle>
                <CardDescription>Update workspace details and configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Workspace Name</p>
                    <p className="text-base text-muted-foreground">{workspace.name}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Created Date</p>
                    <p className="text-base text-muted-foreground">{workspace.created}</p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <p className="text-sm font-semibold text-foreground">Description</p>
                    <p className="text-base text-muted-foreground">{workspace.description}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">Workspace ID</p>
                    <p className="text-sm text-muted-foreground font-mono">{workspace.id}</p>
                  </div>
                  <Button className="btn-primary shadow-md">
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Edit Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-destructive flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>Irreversible actions that affect this workspace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-foreground font-medium mb-2">Delete Workspace</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    This action cannot be undone. Deleting this workspace will:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-4">
                    <li>Remove all members from the workspace</li>
                    <li>Disconnect all data sources</li>
                    <li>Delete all workspace data and settings</li>
                  </ul>
                </div>
                <Button variant="destructive" className="shadow-md">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Workspace Permanently
                </Button>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r border-border w-72">
          <SidebarHeader className="h-16 px-6 border-b border-border flex items-center">
            <h1 className="text-5xl font-bold text-[#4E50A8] font-comfortaa">
              enplify.ai
            </h1>
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
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-6 bg-background">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold text-foreground">Settings</h2>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-sm font-medium hover:bg-accent"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chat
            </Button>
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
