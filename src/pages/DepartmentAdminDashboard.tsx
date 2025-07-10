
import { useState } from 'react';
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
  Users, 
  BookOpen, 
  Building, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar,
  LogOut,
  GraduationCap,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from '../hooks/use-toast';

interface Staff {
  id: string;
  name: string;
  email: string;
  role: 'assistant_professor' | 'professor' | 'hod';
  subjects_selected: string[];
  subjects_locked: boolean;
  status: 'active' | 'inactive';
  joined_date: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  type: 'core' | 'elective' | 'lab';
  semester: number;
  assigned_staff?: string;
}

interface Classroom {
  id: string;
  name: string;
  capacity: number;
  type: 'lecture_hall' | 'lab' | 'seminar_room';
  equipment: string[];
  status: 'available' | 'maintenance' | 'occupied';
}

const DepartmentAdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('staff');
  
  // Mock data
  const [staff, setStaff] = useState<Staff[]>([
    {
      id: '1',
      name: 'Dr. John Smith',
      email: 'john.smith@srmist.edu.in',
      role: 'professor',
      subjects_selected: ['Data Structures'],
      subjects_locked: true,
      status: 'active',
      joined_date: '2023-08-15'
    },
    {
      id: '2',
      name: 'Ms. Sarah Johnson',
      email: 'sarah.johnson@srmist.edu.in',
      role: 'assistant_professor',
      subjects_selected: ['Web Development', 'Database Systems'],
      subjects_locked: false,
      status: 'active',
      joined_date: '2023-09-01'
    },
  ]);

  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: '1',
      name: 'Data Structures and Algorithms',
      code: 'CS301',
      credits: 4,
      type: 'core',
      semester: 3,
      assigned_staff: 'Dr. John Smith'
    },
    {
      id: '2',
      name: 'Database Management Systems',
      code: 'CS302',
      credits: 3,
      type: 'core',
      semester: 3,
      assigned_staff: 'Ms. Sarah Johnson'
    },
    {
      id: '3',
      name: 'Web Development',
      code: 'CS401',
      credits: 3,
      type: 'elective',
      semester: 4,
      assigned_staff: 'Ms. Sarah Johnson'
    },
  ]);

  const [classrooms, setClassrooms] = useState<Classroom[]>([
    {
      id: '1',
      name: 'CS-101',
      capacity: 60,
      type: 'lecture_hall',
      equipment: ['Projector', 'Whiteboard', 'Audio System'],
      status: 'available'
    },
    {
      id: '2',
      name: 'CS-Lab-1',
      capacity: 30,
      type: 'lab',
      equipment: ['Computers', 'Projector', 'Network'],
      status: 'available'
    },
  ]);

  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: '',
  });

  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    credits: 0,
    type: '',
    semester: 0,
  });

  const [newClassroom, setNewClassroom] = useState({
    name: '',
    capacity: 0,
    type: '',
    equipment: '',
  });

  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [isClassroomDialogOpen, setIsClassroomDialogOpen] = useState(false);

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.email || !newStaff.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!newStaff.email.endsWith('@srmist.edu.in')) {
      toast({
        title: "Error",
        description: "Only @srmist.edu.in emails are allowed",
        variant: "destructive",
      });
      return;
    }

    const staffMember: Staff = {
      id: Date.now().toString(),
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role as any,
      subjects_selected: [],
      subjects_locked: false,
      status: 'active',
      joined_date: new Date().toISOString().split('T')[0],
    };

    setStaff([...staff, staffMember]);
    setNewStaff({ name: '', email: '', role: '' });
    setIsStaffDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Staff member added successfully",
    });
  };

  const handleAddSubject = () => {
    if (!newSubject.name || !newSubject.code || !newSubject.credits || !newSubject.type || !newSubject.semester) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const subject: Subject = {
      id: Date.now().toString(),
      name: newSubject.name,
      code: newSubject.code,
      credits: newSubject.credits,
      type: newSubject.type as any,
      semester: newSubject.semester,
    };

    setSubjects([...subjects, subject]);
    setNewSubject({ name: '', code: '', credits: 0, type: '', semester: 0 });
    setIsSubjectDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Subject added successfully",
    });
  };

  const handleAddClassroom = () => {
    if (!newClassroom.name || !newClassroom.capacity || !newClassroom.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const classroom: Classroom = {
      id: Date.now().toString(),
      name: newClassroom.name,
      capacity: newClassroom.capacity,
      type: newClassroom.type as any,
      equipment: newClassroom.equipment.split(',').map(item => item.trim()),
      status: 'available',
    };

    setClassrooms([...classrooms, classroom]);
    setNewClassroom({ name: '', capacity: 0, type: '', equipment: '' });
    setIsClassroomDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Classroom added successfully",
    });
  };

  const handleDeleteStaff = (staffId: string) => {
    setStaff(staff.filter(s => s.id !== staffId));
    toast({
      title: "Success",
      description: "Staff member removed successfully",
    });
  };

  const handleLockSubjects = (staffId: string) => {
    setStaff(staff.map(s => 
      s.id === staffId ? { ...s, subjects_locked: true } : s
    ));
    toast({
      title: "Success",
      description: "Subject selections locked successfully",
    });
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'assistant_professor': return 'Assistant Professor';
      case 'professor': return 'Professor';
      case 'hod': return 'Head of Department';
      default: return role;
    }
  };

  const getSubjectAllowance = (role: string) => {
    switch (role) {
      case 'assistant_professor': return 2;
      case 'professor': return 1;
      case 'hod': return 1;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Department Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Computer Science Engineering</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">Department Admin</Badge>
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
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff.length}</div>
              <p className="text-xs text-muted-foreground">
                {staff.filter(s => s.status === 'active').length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjects.length}</div>
              <p className="text-xs text-muted-foreground">
                {subjects.filter(s => s.assigned_staff).length} assigned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classrooms</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classrooms.length}</div>
              <p className="text-xs text-muted-foreground">
                {classrooms.filter(c => c.status === 'available').length} available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Capacity</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {classrooms.reduce((sum, room) => sum + room.capacity, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total seats</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="staff">Staff Management</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
            <TabsTrigger value="timetable">Timetable</TabsTrigger>
          </TabsList>

          {/* Staff Management Tab */}
          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Staff Management</CardTitle>
                    <CardDescription>
                      Register, update, and manage department staff members
                    </CardDescription>
                  </div>
                  <Dialog open={isStaffDialogOpen} onOpenChange={setIsStaffDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Staff
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Staff Member</DialogTitle>
                        <DialogDescription>
                          Register a new staff member in your department
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="staff-name">Full Name</Label>
                          <Input
                            id="staff-name"
                            placeholder="Dr. John Smith"
                            value={newStaff.name}
                            onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="staff-email">Email</Label>
                          <Input
                            id="staff-email"
                            type="email"
                            placeholder="john.smith@srmist.edu.in"
                            value={newStaff.email}
                            onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="staff-role">Role</Label>
                          <Select onValueChange={(value) => setNewStaff({...newStaff, role: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="assistant_professor">Assistant Professor</SelectItem>
                              <SelectItem value="professor">Professor</SelectItem>
                              <SelectItem value="hod">Head of Department</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleAddStaff} className="w-full">
                          Add Staff Member
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
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{getRoleDisplayName(member.role)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">
                              {member.subjects_selected.length}/{getSubjectAllowance(member.role)}
                            </span>
                            {member.subjects_locked ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-orange-600" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                            {member.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            {!member.subjects_locked && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleLockSubjects(member.id)}
                              >
                                Lock
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeleteStaff(member.id)}
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

          {/* Subjects Tab */}
          <TabsContent value="subjects">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Subject Management</CardTitle>
                    <CardDescription>
                      Define and manage department subjects
                    </CardDescription>
                  </div>
                  <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Subject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Subject</DialogTitle>
                        <DialogDescription>
                          Create a new subject for your department
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="subject-name">Subject Name</Label>
                          <Input
                            id="subject-name"
                            placeholder="Data Structures and Algorithms"
                            value={newSubject.name}
                            onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject-code">Subject Code</Label>
                          <Input
                            id="subject-code"
                            placeholder="CS301"
                            value={newSubject.code}
                            onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="subject-credits">Credits</Label>
                            <Input
                              id="subject-credits"
                              type="number"
                              placeholder="4"
                              value={newSubject.credits || ''}
                              onChange={(e) => setNewSubject({...newSubject, credits: parseInt(e.target.value) || 0})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="subject-semester">Semester</Label>
                            <Input
                              id="subject-semester"
                              type="number"
                              placeholder="3"
                              value={newSubject.semester || ''}
                              onChange={(e) => setNewSubject({...newSubject, semester: parseInt(e.target.value) || 0})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject-type">Type</Label>
                          <Select onValueChange={(value) => setNewSubject({...newSubject, type: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="core">Core</SelectItem>
                              <SelectItem value="elective">Elective</SelectItem>
                              <SelectItem value="lab">Lab</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleAddSubject} className="w-full">
                          Add Subject
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
                      <TableHead>Subject</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Assigned Staff</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell className="font-medium">{subject.name}</TableCell>
                        <TableCell>{subject.code}</TableCell>
                        <TableCell>{subject.credits}</TableCell>
                        <TableCell>
                          <Badge variant={subject.type === 'core' ? 'default' : 'secondary'}>
                            {subject.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{subject.semester}</TableCell>
                        <TableCell>
                          {subject.assigned_staff ? (
                            <span className="text-sm">{subject.assigned_staff}</span>
                          ) : (
                            <Badge variant="outline">Unassigned</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
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

          {/* Classrooms Tab */}
          <TabsContent value="classrooms">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Classroom Management</CardTitle>
                    <CardDescription>
                      Manage department classrooms and facilities
                    </CardDescription>
                  </div>
                  <Dialog open={isClassroomDialogOpen} onOpenChange={setIsClassroomDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Classroom
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Classroom</DialogTitle>
                        <DialogDescription>
                          Add a new classroom to your department
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="room-name">Classroom Name</Label>
                          <Input
                            id="room-name"
                            placeholder="CS-101"
                            value={newClassroom.name}
                            onChange={(e) => setNewClassroom({...newClassroom, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="room-capacity">Capacity</Label>
                          <Input
                            id="room-capacity"
                            type="number"
                            placeholder="60"
                            value={newClassroom.capacity || ''}
                            onChange={(e) => setNewClassroom({...newClassroom, capacity: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="room-type">Type</Label>
                          <Select onValueChange={(value) => setNewClassroom({...newClassroom, type: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lecture_hall">Lecture Hall</SelectItem>
                              <SelectItem value="lab">Laboratory</SelectItem>
                              <SelectItem value="seminar_room">Seminar Room</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="room-equipment">Equipment (comma-separated)</Label>
                          <Input
                            id="room-equipment"
                            placeholder="Projector, Whiteboard, Audio System"
                            value={newClassroom.equipment}
                            onChange={(e) => setNewClassroom({...newClassroom, equipment: e.target.value})}
                          />
                        </div>
                        <Button onClick={handleAddClassroom} className="w-full">
                          Add Classroom
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
                      <TableHead>Classroom</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classrooms.map((classroom) => (
                      <TableRow key={classroom.id}>
                        <TableCell className="font-medium">{classroom.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {classroom.type.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{classroom.capacity}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {classroom.equipment.slice(0, 2).map((item, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                            {classroom.equipment.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{classroom.equipment.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={classroom.status === 'available' ? 'default' : 'secondary'}>
                            {classroom.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
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

          {/* Timetable Tab */}
          <TabsContent value="timetable">
            <Card>
              <CardHeader>
                <CardTitle>Department Timetable</CardTitle>
                <CardDescription>
                  Generate and manage your department's timetable
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Timetable Generation
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Use the AI-powered timetable generator to create optimized schedules
                  </p>
                  <Button onClick={() => window.location.href = '/timetable-generator'}>
                    Open Timetable Generator
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DepartmentAdminDashboard;
