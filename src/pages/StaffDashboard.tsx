
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Checkbox } from '../components/ui/checkbox';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User,
  LogOut,
  GraduationCap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lock
} from 'lucide-react';
import { toast } from '../hooks/use-toast';

interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  type: 'core' | 'elective' | 'lab';
  semester: number;
  description: string;
  prerequisites?: string[];
}

interface TimetableSlot {
  day: string;
  time: string;
  subject: string;
  classroom: string;
  type: string;
}

const StaffDashboard = () => {
  const { user, logout } = useAuth();
  
  // Mock user data - in real app, fetch from API
  const [staffInfo] = useState({
    name: user?.name || 'Dr. John Smith',
    email: user?.email || 'john.smith@srmist.edu.in',
    role: user?.staff_role || 'assistant_professor',
    department: 'Computer Science Engineering',
    employee_id: 'SRM2024001',
    joined_date: '2023-08-15',
    subjects_selected: user?.subjects_selected || [],
    subjects_locked: user?.subjects_locked || false,
  });

  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([
    {
      id: '1',
      name: 'Data Structures and Algorithms',
      code: 'CS301',
      credits: 4,
      type: 'core',
      semester: 3,
      description: 'Fundamental data structures and algorithms for efficient programming',
      prerequisites: ['Programming Fundamentals', 'Mathematics']
    },
    {
      id: '2',
      name: 'Database Management Systems',
      code: 'CS302',
      credits: 3,
      type: 'core',
      semester: 3,
      description: 'Design and implementation of database systems',
      prerequisites: ['Data Structures']
    },
    {
      id: '3',
      name: 'Web Development',
      code: 'CS401',
      credits: 3,
      type: 'elective',
      semester: 4,
      description: 'Modern web development technologies and frameworks',
      prerequisites: ['Programming Fundamentals']
    },
    {
      id: '4',
      name: 'Machine Learning',
      code: 'CS501',
      credits: 4,
      type: 'elective',
      semester: 5,
      description: 'Introduction to machine learning algorithms and applications',
      prerequisites: ['Statistics', 'Programming']
    },
    {
      id: '5', 
      name: 'Computer Networks',
      code: 'CS303',
      credits: 3,
      type: 'core',
      semester: 3,
      description: 'Network protocols, architecture, and security',
      prerequisites: ['Operating Systems']
    },
  ]);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    staffInfo.subjects_selected || []
  );

  const [myTimetable] = useState<TimetableSlot[]>([
    { day: 'Monday', time: '09:00-10:00', subject: 'Data Structures', classroom: 'CS-101', type: 'Lecture' },
    { day: 'Monday', time: '14:00-15:00', subject: 'Web Development', classroom: 'CS-Lab-1', type: 'Lab' },
    { day: 'Tuesday', time: '10:00-11:00', subject: 'Data Structures', classroom: 'CS-102', type: 'Tutorial' },
    { day: 'Wednesday', time: '11:00-12:00', subject: 'Web Development', classroom: 'CS-103', type: 'Lecture' },
    { day: 'Thursday', time: '09:00-10:00', subject: 'Data Structures', classroom: 'CS-101', type: 'Lecture' },
    { day: 'Friday', time: '15:00-16:00', subject: 'Web Development', classroom: 'CS-Lab-2', type: 'Lab' },
  ]);

  const getMaxSubjects = (role: string) => {
    switch (role) {
      case 'assistant_professor': return 2;
      case 'professor': return 1;
      case 'hod': return 1;
      default: return 0;
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'assistant_professor': return 'Assistant Professor';
      case 'professor': return 'Professor';
      case 'hod': return 'Head of Department';
      default: return role;
    }
  };

  const handleSubjectSelection = (subjectId: string, checked: boolean) => {
    if (staffInfo.subjects_locked) {
      toast({
        title: "Subjects Locked",
        description: "Your subject selections have been locked by the department admin.",
        variant: "destructive",
      });
      return;
    }

    const maxSubjects = getMaxSubjects(staffInfo.role);
    
    if (checked) {
      if (selectedSubjects.length >= maxSubjects) {
        toast({
          title: "Selection Limit Reached",
          description: `You can only select ${maxSubjects} subject(s) based on your role.`,
          variant: "destructive",
        });
        return;
      }
      setSelectedSubjects([...selectedSubjects, subjectId]);
    } else {
      setSelectedSubjects(selectedSubjects.filter(id => id !== subjectId));
    }
  };

  const handleSaveSelections = () => {
    // TODO: Save to backend
    toast({
      title: "Success",
      description: "Subject selections saved successfully!",
    });
  };

  const getSubjectById = (id: string) => {
    return availableSubjects.find(subject => subject.id === id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
              <p className="text-sm text-gray-600">{staffInfo.department}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">{getRoleDisplayName(staffInfo.role)}</Badge>
            <span className="text-sm text-gray-600">{staffInfo.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-lg">{staffInfo.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Employee ID</p>
                <p className="text-lg">{staffInfo.employee_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Role</p>
                <p className="text-lg">{getRoleDisplayName(staffInfo.role)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Department</p>
                <p className="text-lg">{staffInfo.department}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="subjects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="subjects">Subject Selection</TabsTrigger>
            <TabsTrigger value="timetable">My Timetable</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          {/* Subject Selection Tab */}
          <TabsContent value="subjects">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Subject Selection
                    </CardTitle>
                    <CardDescription>
                      Select subjects to teach based on your role permissions
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {staffInfo.subjects_locked ? (
                      <Badge variant="destructive" className="flex items-center">
                        <Lock className="h-3 w-3 mr-1" />
                        Locked
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        {selectedSubjects.length}/{getMaxSubjects(staffInfo.role)} Selected
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {staffInfo.subjects_locked && (
                  <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your subject selections have been locked by the department admin. 
                      Contact your department admin if you need to make changes.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  {availableSubjects.map((subject) => (
                    <div key={subject.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id={subject.id}
                            checked={selectedSubjects.includes(subject.id)}
                            onCheckedChange={(checked) => 
                              handleSubjectSelection(subject.id, checked as boolean)
                            }
                            disabled={staffInfo.subjects_locked}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium">{subject.name}</h4>
                              <Badge variant="outline">{subject.code}</Badge>
                              <Badge variant={subject.type === 'core' ? 'default' : 'secondary'}>
                                {subject.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{subject.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Credits: {subject.credits}</span>
                              <span>Semester: {subject.semester}</span>
                              {subject.prerequisites && (
                                <span>Prerequisites: {subject.prerequisites.join(', ')}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        {selectedSubjects.includes(subject.id) && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {!staffInfo.subjects_locked && (
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleSaveSelections}>
                      Save Subject Selections
                    </Button>
                  </div>
                )}

                {/* Selected Subjects Summary */}
                {selectedSubjects.length > 0 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-3">Selected Subjects:</h4>
                    <div className="space-y-2">
                      {selectedSubjects.map(subjectId => {
                        const subject = getSubjectById(subjectId);
                        return subject ? (
                          <div key={subjectId} className="flex items-center justify-between">
                            <span className="text-sm">{subject.name} ({subject.code})</span>
                            <Badge variant="outline">{subject.credits} credits</Badge>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Timetable Tab */}
          <TabsContent value="timetable">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  My Teaching Schedule
                </CardTitle>
                <CardDescription>
                  Your current teaching timetable and class assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {myTimetable.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Classroom</TableHead>
                        <TableHead>Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myTimetable.map((slot, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{slot.day}</TableCell>
                          <TableCell>{slot.time}</TableCell>
                          <TableCell>{slot.subject}</TableCell>
                          <TableCell>{slot.classroom}</TableCell>
                          <TableCell>
                            <Badge variant={slot.type === 'Lab' ? 'secondary' : 'outline'}>
                              {slot.type}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Timetable Available
                    </h3>
                    <p className="text-gray-600">
                      Your teaching schedule will appear here once the timetable is generated.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Weekly Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                      const daySchedule = myTimetable.filter(slot => slot.day === day);
                      return (
                        <div key={day} className="flex items-center justify-between p-3 border rounded">
                          <span className="font-medium">{day}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {daySchedule.length} classes
                            </span>
                            {daySchedule.length > 0 && (
                              <Badge variant="outline">
                                {daySchedule[0].time.split('-')[0]} - {daySchedule[daySchedule.length - 1].time.split('-')[1]}
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Teaching Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Classes per Week</span>
                      <Badge variant="outline">{myTimetable.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Subjects Teaching</span>
                      <Badge variant="outline">{selectedSubjects.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Lab Sessions</span>
                      <Badge variant="outline">
                        {myTimetable.filter(slot => slot.type === 'Lab').length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Lecture Sessions</span>
                      <Badge variant="outline">
                        {myTimetable.filter(slot => slot.type === 'Lecture').length}
                      </Badge>
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

export default StaffDashboard;
