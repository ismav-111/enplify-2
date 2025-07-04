
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, Users, Shield, Plus, Search, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@company.com', role: 'Manager', status: 'Active', permissions: ['encore', 'endocs', 'cohort'] },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', role: 'User', status: 'Active', permissions: ['encore', 'endocs'] },
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', role: 'Admin', status: 'Active', permissions: ['encore', 'endocs', 'ensights', 'cohort'] },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@company.com', role: 'User', status: 'Inactive', permissions: ['encore'] },
  ]);

  const features = [
    { id: 'encore', name: 'Encore', description: 'Advanced analytics and reporting' },
    { id: 'endocs', name: 'Endocs', description: 'Document management system' },
    { id: 'ensights', name: 'Ensights', description: 'Business intelligence dashboard' },
    { id: 'cohort', name: 'Cohort Analysis', description: 'User behavior and retention analytics' },
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="h-10 w-10 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage users and feature permissions</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white p-1 rounded-lg border">
          <Button
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('users')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            User Management
          </Button>
          <Button
            variant={activeTab === 'permissions' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('permissions')}
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Feature Permissions
          </Button>
        </div>

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Enter full name" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter email" />
                    </div>
                    <div>
                      <Label>Feature Access</Label>
                      <div className="space-y-2 mt-2">
                        {features.map((feature) => (
                          <div key={feature.id} className="flex items-center space-x-2">
                            <Checkbox id={feature.id} />
                            <Label htmlFor={feature.id} className="text-sm font-normal">
                              {feature.name} - {feature.description}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full">Add User</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Users ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {user.permissions.map((perm) => (
                              <span key={perm} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {perm}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Feature Permissions Tab */}
        {activeTab === 'permissions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature) => (
                <Card key={feature.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {feature.name}
                      <Button variant="outline" size="sm">Manage Access</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Active Users:</span>
                        <span className="font-medium">
                          {users.filter(u => u.permissions.includes(feature.id)).length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Users:</span>
                        <span className="font-medium">{users.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
