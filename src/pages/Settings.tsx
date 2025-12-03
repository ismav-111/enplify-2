import { useState, useEffect } from 'react';
import ProfileSettings, { AccountType } from '@/components/settings/ProfileSettings';
import WorkspacesSettings from '@/components/settings/WorkspacesSettings';
import GeneralSection from '@/components/settings/GeneralSection';
import { ArrowLeft, Briefcase, ChevronDown, ChevronRight, Grid, Users as UsersIcon, Database, Settings as SettingsIcon, User, Trash2, Sparkles, PanelLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarInset, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PeoplePicker, Person } from '@/components/PeoplePicker';

// Empty workspaces - user needs to create them
const mockWorkspaces: Array<{
  id: string;
  name: string;
  memberCount: number;
  description: string;
  created: string;
  dataSources: string[];
  avatarUrl?: string;
}> = [];
type WorkspaceSection = 'general' | 'members' | 'configuration';
interface ActiveView {
  type: 'workspace' | 'profile';
  workspaceId?: string;
  section?: WorkspaceSection;
}
interface SettingsSidebarProps {
  workspaces: typeof mockWorkspaces;
  expandedWorkspaces: Set<string>;
  workspacesExpanded: boolean;
  setWorkspacesExpanded: (expanded: boolean) => void;
  activeView: ActiveView;
  navigate: ReturnType<typeof useNavigate>;
  toggleWorkspace: (id: string) => void;
  handleSectionClick: (workspaceId: string, section: WorkspaceSection) => void;
  setActiveView: (view: ActiveView) => void;
  accountType: AccountType;
}
const SettingsSidebar = ({
  workspaces,
  expandedWorkspaces,
  workspacesExpanded,
  setWorkspacesExpanded,
  activeView,
  navigate,
  toggleWorkspace,
  handleSectionClick,
  setActiveView,
  accountType
}: SettingsSidebarProps) => {
  const {
    setOpenMobile
  } = useSidebar();
  return <Sidebar className="border-r border-gray-100">
      {/* Header with branding and toggle button */}
      <SidebarHeader className="h-16 px-6 border-b border-gray-100 flex flex-row justify-between items-center">
        <h1 className="text-5xl font-bold text-[#4E50A8] font-comfortaa">
          enplify.ai
        </h1>
        <Tooltip>
          <TooltipTrigger asChild>
            
          </TooltipTrigger>
          <TooltipContent>
            <p>Close sidebar</p>
          </TooltipContent>
        </Tooltip>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {/* Back to Conversation Button */}
              <SidebarMenuItem className="mb-4">
                <SidebarMenuButton onClick={() => navigate('/')} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Conversation
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* Workspaces Section - B2B only */}
              {accountType === 'b2b' && (
                <SidebarMenuItem className="mb-2">
                  <SidebarMenuButton 
                    onClick={() => {
                      setActiveView({ type: 'workspace', workspaceId: undefined, section: undefined });
                      setOpenMobile(false);
                      setWorkspacesExpanded(!workspacesExpanded);
                    }}
                    isActive={activeView.type === 'workspace' && !activeView.workspaceId}
                    className={`
                      px-3 py-2 text-sm font-medium transition-colors rounded-md
                      ${activeView.type === 'workspace' && !activeView.workspaceId 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-foreground hover:text-foreground hover:bg-muted/50'}
                    `}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Workspaces
                    {workspaces.length > 0 && (
                      <span className="ml-auto">
                        {workspacesExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Individual Workspaces List - B2B only */}
              {accountType === 'b2b' && workspacesExpanded && workspaces.length > 0 && (
                <div className="ml-6 space-y-1 mb-2">
                  {workspaces.map(workspace => (
                    <div key={workspace.id} className="space-y-0.5">
                      <Collapsible
                        open={expandedWorkspaces.has(workspace.id)}
                        onOpenChange={() => toggleWorkspace(workspace.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton 
                            className={`
                              px-3 py-2 text-sm transition-colors rounded-md w-full justify-start
                              ${activeView.type === 'workspace' && activeView.workspaceId === workspace.id 
                                ? 'text-primary font-medium' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                            `}
                          >
                            <Briefcase className="h-3.5 w-3.5 mr-2" />
                            {workspace.name}
                            <span className="ml-auto">
                              {expandedWorkspaces.has(workspace.id) ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                            </span>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="ml-6 space-y-0.5 mt-1">
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                onClick={() => {
                                  handleSectionClick(workspace.id, 'general');
                                  setOpenMobile(false);
                                }}
                                isActive={activeView.workspaceId === workspace.id && activeView.section === 'general'}
                                className={`
                                  px-3 py-1.5 text-xs transition-colors rounded-md
                                  ${activeView.workspaceId === workspace.id && activeView.section === 'general'
                                    ? 'bg-primary text-primary-foreground font-medium'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                                `}
                              >
                                <SettingsIcon className="h-3 w-3 mr-2" />
                                General
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                onClick={() => {
                                  handleSectionClick(workspace.id, 'members');
                                  setOpenMobile(false);
                                }}
                                isActive={activeView.workspaceId === workspace.id && activeView.section === 'members'}
                                className={`
                                  px-3 py-1.5 text-xs transition-colors rounded-md
                                  ${activeView.workspaceId === workspace.id && activeView.section === 'members'
                                    ? 'bg-primary text-primary-foreground font-medium'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                                `}
                              >
                                <UsersIcon className="h-3 w-3 mr-2" />
                                Members
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                onClick={() => {
                                  handleSectionClick(workspace.id, 'configuration');
                                  setOpenMobile(false);
                                }}
                                isActive={activeView.workspaceId === workspace.id && activeView.section === 'configuration'}
                                className={`
                                  px-3 py-1.5 text-xs transition-colors rounded-md
                                  ${activeView.workspaceId === workspace.id && activeView.section === 'configuration'
                                    ? 'bg-primary text-primary-foreground font-medium'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                                `}
                              >
                                <Database className="h-3 w-3 mr-2" />
                                Configuration
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  ))}
                </div>
              )}

              {/* Profile Section */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveView({
                type: 'profile'
              })} isActive={activeView.type === 'profile'} className={`
                    px-3 py-2 text-sm transition-colors rounded-md
                    ${activeView.type === 'profile' ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                  `}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
};
const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [workspaces, setWorkspaces] = useState(mockWorkspaces);
  const [activeView, setActiveView] = useState<ActiveView>(() => {
    // Check if we should open create workspace dialog from URL state
    return location.state?.openCreateWorkspace 
      ? { type: 'workspace' as const, workspaceId: undefined, section: undefined }
      : { type: 'profile' as const };
  });
  const [showCreateDialog, setShowCreateDialog] = useState(location.state?.openCreateWorkspace || false);
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(new Set());
  const [workspacesExpanded, setWorkspacesExpanded] = useState(true);
  
  // Add Member dialog state
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<Person[]>([]);
  const [memberRole, setMemberRole] = useState<string>('member');
  const [accountType, setAccountType] = useState<AccountType>('b2b');
  
  // Mock available people - replace with actual data from your backend
  const availablePeople: Person[] = [
    { id: '1', name: 'Ninja Saboteur', email: 'ninja@company.com', role: 'UX/UI Designer' },
    { id: '2', name: 'Niall Mackinnon', email: 'niall@company.com', role: 'Sr. Software Engineer' },
    { id: '3', name: 'Nicholas Cetera', email: 'nicholas.c@company.com', role: 'Sr. Software Engineer' },
    { id: '4', name: 'Anita Simon', email: 'anita.simon@company.com', role: 'Sr. Software Engineer' },
    { id: '5', name: 'Nicholas Grubb', email: 'nigrubb@company.com', role: 'Principal GPM' },
    { id: '6', name: 'Nicholas Arguell', email: 'niarquel@company.com', role: 'Software Engineer 2' },
    { id: '7', name: 'Nick Golovkin', email: 'nick.g@company.com', role: 'Product Manager' },
  ];

  // Clear location state after dialog is opened to prevent reopening on refresh
  useEffect(() => {
    if (location.state?.openCreateWorkspace) {
      // Replace the state without the openCreateWorkspace flag
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Redirect B2C users to profile view if they're viewing workspaces
  useEffect(() => {
    if (accountType === 'b2c' && activeView.type === 'workspace') {
      setActiveView({ type: 'profile' });
    }
  }, [accountType]);

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
    setActiveView({
      type: 'workspace',
      workspaceId,
      section
    });
    if (!expandedWorkspaces.has(workspaceId)) {
      toggleWorkspace(workspaceId);
    }
  };
  const handleCreateWorkspace = (name: string, description?: string) => {
    const newWorkspace = {
      id: `ws-${Date.now()}`,
      name,
      memberCount: 1,
      description: description || '',
      created: new Date().toISOString().split('T')[0],
      dataSources: [],
      avatarUrl: undefined
    };
    setWorkspaces(prev => [...prev, newWorkspace]);
    // Stay on all workspaces view after creation
    setActiveView({
      type: 'workspace',
      workspaceId: undefined,
      section: undefined
    });
    setShowCreateDialog(false);
    toast.success('Workspace created successfully');
  };
  const handleDeleteWorkspace = (workspaceId: string) => {
    setWorkspaces(prev => prev.filter(w => w.id !== workspaceId));
    // Always go back to all workspaces view after deletion
    setActiveView({
      type: 'workspace',
      workspaceId: undefined,
      section: undefined
    });
    toast.success('Workspace deleted successfully');
  };
  const handleRenameWorkspace = (workspaceId: string, newName: string) => {
    setWorkspaces(prev => prev.map(w => w.id === workspaceId ? {
      ...w,
      name: newName
    } : w));
    toast.success('Workspace renamed successfully');
  };
  const handleUpdateAvatar = (workspaceId: string, avatarUrl: string) => {
    setWorkspaces(prev => prev.map(w => w.id === workspaceId ? {
      ...w,
      avatarUrl
    } : w));
  };

  const handleAddMember = () => {
    if (selectedPeople.length === 0) {
      toast.error('Please select at least one person');
      return;
    }
    
    // Here you would typically make an API call to add the members
    const memberNames = selectedPeople.map(p => p.name).join(', ');
    toast.success(`Added ${selectedPeople.length} member${selectedPeople.length > 1 ? 's' : ''} with ${memberRole} role`);
    
    // Reset form and close dialog
    setSelectedPeople([]);
    setMemberRole('member');
    setShowAddMemberDialog(false);
  };
  const renderWorkspaceContent = () => {
    if (activeView.type === 'profile') {
      return <ProfileSettings className="my-0 py-0" accountType={accountType} onAccountTypeChange={setAccountType} />;
    }

    // If showing all workspaces view
    if (!activeView.workspaceId) {
      return <WorkspacesSettings 
        workspaces={workspaces} 
        showCreateDialog={showCreateDialog}
        onCreateWorkspace={handleCreateWorkspace} 
        onDeleteWorkspace={handleDeleteWorkspace} 
        onRenameWorkspace={handleRenameWorkspace} 
        onUpdateAvatar={handleUpdateAvatar} 
        onSelectWorkspace={id => setActiveView({
          type: 'workspace',
          workspaceId: id,
          section: 'general'
        })}
        onCloseCreateDialog={() => setShowCreateDialog(false)}
      />;
    }
    const workspace = workspaces.find(w => w.id === activeView.workspaceId);
    if (!workspace) return null;
    switch (activeView.section) {
      case 'general':
        return (
          <GeneralSection 
            workspace={workspace}
            onBack={() => setActiveView({ type: 'workspace', workspaceId: undefined, section: undefined })}
            onRename={handleRenameWorkspace}
            onUpdateAvatar={handleUpdateAvatar}
            onDelete={handleDeleteWorkspace}
          />
        );
      case 'members':
        return <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-foreground tracking-tight">Team Members</h1>
                <p className="text-base text-muted-foreground">Manage workspace members and their permissions</p>
              </div>
              <Button onClick={() => setShowAddMemberDialog(true)} className="btn-primary shadow-md">
                <UsersIcon className="h-4 w-4 mr-2" />
                Add Member
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
          </div>;
      case 'configuration':
        return <div className="space-y-8">
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
                {workspace.dataSources.length > 0 ? workspace.dataSources.map(source => <div key={source} className="flex items-center justify-between p-5 border border-border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
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
                    </div>) : <p className="text-sm text-muted-foreground p-4 text-center">No data sources connected</p>}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Available Data Sources</CardTitle>
                <CardDescription>Connect new data sources to enhance your workspace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {['OneDrive', 'SharePoint', 'Snowflake', 'Salesforce', 'Confluence', 'Slack'].map(source => <div key={source} className="flex items-center justify-between p-5 border border-border rounded-lg bg-background hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Database className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span className="text-base font-semibold text-foreground">{source}</span>
                    </div>
                    <Button className="btn-primary shadow-md" size="sm">
                      Connect
                    </Button>
                  </div>)}
              </CardContent>
            </Card>
          </div>;
      default:
        return null;
    }
  };
  return <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full bg-background">
          <SettingsSidebar 
            workspaces={workspaces} 
            expandedWorkspaces={expandedWorkspaces}
            workspacesExpanded={workspacesExpanded}
            setWorkspacesExpanded={setWorkspacesExpanded}
            activeView={activeView} 
            navigate={navigate} 
            toggleWorkspace={toggleWorkspace} 
            handleSectionClick={handleSectionClick} 
            setActiveView={setActiveView}
            accountType={accountType}
          />
          <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-6 bg-background">
            
          </header>

          <main className="p-8 animate-fade-in flex justify-center">
            <div className="w-full max-w-5xl mx-auto">
              {renderWorkspaceContent()}
            </div>
          </main>
        </SidebarInset>
      </div>
      
      {/* Add Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
            <DialogDescription>
              Select people to add to this workspace and assign their role.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Select People</Label>
              <PeoplePicker
                availablePeople={availablePeople}
                selectedPeople={selectedPeople}
                onSelectionChange={setSelectedPeople}
                maxSelection={10}
                placeholder="Search and select people..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="member-role">Role</Label>
              <Select value={memberRole} onValueChange={setMemberRole}>
                <SelectTrigger id="member-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddMemberDialog(false);
              setSelectedPeople([]);
              setMemberRole('member');
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddMember}>
              Add {selectedPeople.length > 0 ? `${selectedPeople.length} ` : ''}Member{selectedPeople.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  </TooltipProvider>;
};
export default Settings;