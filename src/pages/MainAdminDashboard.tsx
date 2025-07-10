
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { 
  Building2, 
  Users, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Shield, 
  BarChart3,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { toast } from '../hooks/use-toast';

interface Department {
  id: string;
  name: string;
  admin_email?: string;
  staff_count: number;
  subjects_count: number;
  status: 'active' | 'inactive';
  created_at: string;
}

interface SystemRule {
  id: string;
  name: string;
  value: number;
  description: string;
}

const MainAdminDashboard = () => {
  const { user, logout } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 'cse',
      name: 'Computer Science Engineering',
      admin_email: 'cse.admin@srmist.edu.in',
      staff_count: 25,
      subjects_count: 18,
      status: 'active',
      created_at: '2024-01-15'
    },
    {
      id: 'ece',
      name: 'Electronics & Communication Engineering',
      staff_count: 20,
      subjects_count: 15,
      status: 'active',
      created_at: '2024-01-15'
    },
  ]);

  const [systemRules, setSystemRules] = useState<SystemRule[]>([
    { id: '1', name: 'Max Subjects for Assistant Professor', value: 2, description: 'Maximum subjects an Assistant Professor can select' },
    { id: '2', name: 'Max Subjects for Professor', value: 1, description: 'Maximum subjects a Professor can select' },
    { id: '3', name: 'Max Subjects for HOD', value: 1, description: 'Maximum subjects a Head of Department can select' },
    { id: '4', name: 'Max Classes per Day', value: 6, description: 'Maximum classes per day in timetable' },
    { id: '5', name: 'Working Days per Week', value: 5, description: 'Number of working days per week' },
  ]);

  const [newDepartment, setNewDepartment] = useState({ name: '', admin_email: '' });
  const [editingRule, setEditingRule] = useState<SystemRule | null>(null);
  const [isCreateDeptOpen, setIsCreateDeptOpen] = useState(false);
  const [isEditRuleOpen, setIsEditRuleOpen] = useState(false);

  const handleCreateDepartment = () => {
    if (!newDepartment.name.trim()) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive",
      });
      return;
    }

    const department: Department = {
      id: newDepartment.name.toLowerCase().replace(/\s+/g, '-'),
      name: newDepartment.name,
      admin_email: newDepartment.admin_email || undefined,
      staff_count: 0,
      subjects_count: 0,
      status: 'active',
      created_at: new Date().toISOString().split('T')[0],
    };

    setDepartments([...departments, department]);
    setNewDepartment({ name: '', admin_email: '' });
    setIsCreateDeptOpen(false);
    
    toast({
      title: "Success",
      description: "Department created successfully",
    });
  };

  const handleUpdateRule = () => {
    if (!editingRule) return;

    setSystemRules(rules => 
      rules.map(rule => 
        rule.id === editingRule.id ? editingRule : rule
      )
    );

    setIsEditRuleOpen(false);
    setEditingRule(null);
    
    toast({
      title: "Success",
      description: "System rule updated successfully",
    });
  };

  const handleDeleteDepartment = (deptId: string) => {
    setDepartments(departments.filter(dept => dept.id !== deptId));
    toast({
      title: "Success",
      description: "Department deleted successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Main Admin Dashboard</h1>
              <p className="text-sm text-gray-600">System Administration</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">Main Admin</Badge>
            <span className="text-sm text-gray-600">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {departments.reduce((sum, dept) => sum + dept.staff_count, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Departments</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {departments.filter(dept => dept.status === 'active').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Rules</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemRules.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="departments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="system-rules">System Rules</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Departments Tab */}
          <TabsContent value="departments">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Department Management</CardTitle>
                    <CardDescription>
                      Create and manage departments, assign department admins
                    </CardDescription>
                  </div>
                  <Dialog open={isCreateDeptOpen} onOpenChange={setIsCreateDeptOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Department
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Department</DialogTitle>
                        <DialogDescription>
                          Add a new department to the system
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="dept-name">Department Name</Label>
                          <Input
                            id="dept-name"
                            placeholder="e.g., Computer Science Engineering"
                            value={newDepartment.name}
                            onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="admin-email">Department Admin Email (Optional)</Label>
                          <Input
                            id="admin-email"
                            type="email"
                            placeholder="admin@srmist.edu.in"
                            value={newDepartment.admin_email}
                            onChange={(e) => setNewDepartment({...newDepartment, admin_email: e.target.value})}
                          />
                        </div>
                        <Button onClick={handleCreateDepartment} className="w-full">
                          Create Department
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Staff Count</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments.map((dept) => (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell>
                          {dept.admin_email ? (
                            <span className="text-sm text-gray-600">{dept.admin_email}</span>
                          ) : (
                            <Badge variant="outline">Not Assigned</Badge>
                          )}
                        </TableCell>
                        <TableCell>{dept.staff_count}</TableCell>
                        <TableCell>{dept.subjects_count}</TableCell>
                        <TableCell>
                          <Badge variant={dept.status === 'active' ? 'default' : 'secondary'}>
                            {dept.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{dept.created_at}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeleteDepartment(dept.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Rules Tab */}
          <TabsContent value="system-rules">
            <Card>
              <CardHeader>
                <CardTitle>System Rules & Configuration</CardTitle>
                <CardDescription>
                  Configure system-wide rules and constraints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemRules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{rule.name}</h4>
                        <p className="text-sm text-gray-600">{rule.description}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{rule.value}</Badge>
                        <Dialog open={isEditRuleOpen} onOpenChange={setIsEditRuleOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingRule(rule)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit System Rule</DialogTitle>
                              <DialogDescription>
                                Modify the system rule value
                              </DialogDescription>
                            </DialogHeader>
                            {editingRule && (
                              <div className="space-y-4">
                                <div>
                                  <Label>{editingRule.name}</Label>
                                  <p className="text-sm text-gray-600">{editingRule.description}</p>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="rule-value">Value</Label>
                                  <Input
                                    id="rule-value"
                                    type="number"
                                    value={editingRule.value}
                                    onChange={(e) => setEditingRule({
                                      ...editingRule,
                                      value: parseInt(e.target.value) || 0
                                    })}
                                  />
                                </div>
                                <Button onClick={handleUpdateRule} className="w-full">
                                  Update Rule
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Department Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.map((dept) => (
                      <div key={dept.id} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{dept.name}</span>
                        <div className="flex space-x-4 text-sm text-gray-600">
                          <span>{dept.staff_count} Staff</span>
                          <span>{dept.subjects_count} Subjects</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database Status</span>
                      <Badge variant="default">Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">AI Engine</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Authentication</span>
                      <Badge variant="default">Secure</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Backup</span>
                      <span className="text-sm text-gray-600">2 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MainAdminDashboard;
