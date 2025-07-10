
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Calendar, 
  Zap, 
  Download, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Users,
  BookOpen,
  GraduationCap,
  LogOut
} from 'lucide-react';
import { toast } from '../hooks/use-toast';

interface TimetableSlot {
  day: string;
  time: string;
  subject: string;
  staff: string;
  classroom: string;
  duration: number;
}

interface ConflictAlert {
  type: 'overlap' | 'overload' | 'availability' | 'room_conflict';
  message: string;
  severity: 'high' | 'medium' | 'low';
  affected_items: string[];
}

const TimetableGenerator = () => {
  const { user, logout } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentTimetable, setCurrentTimetable] = useState<TimetableSlot[]>([]);
  const [conflicts, setConflicts] = useState<ConflictAlert[]>([]);
  const [generationParams, setGenerationParams] = useState({
    department: '',
    startDate: '',
    endDate: '',
    workingDays: 5,
    maxClassesPerDay: 6,
    preferredStartTime: '09:00',
    preferredEndTime: '17:00',
    breakDuration: 60,
    lunchBreakStart: '12:00',
  });

  // Mock data for demonstration
  const sampleTimetable: TimetableSlot[] = [
    { day: 'Monday', time: '09:00-10:00', subject: 'Data Structures', staff: 'Dr. Smith', classroom: 'CS-101', duration: 60 },
    { day: 'Monday', time: '10:00-11:00', subject: 'Database Systems', staff: 'Prof. Johnson', classroom: 'CS-102', duration: 60 },
    { day: 'Monday', time: '11:15-12:15', subject: 'Machine Learning', staff: 'Dr. Brown', classroom: 'CS-103', duration: 60 },
    { day: 'Monday', time: '13:15-14:15', subject: 'Web Development', staff: 'Ms. Davis', classroom: 'CS-104', duration: 60 },
    { day: 'Tuesday', time: '09:00-10:00', subject: 'Algorithms', staff: 'Dr. Wilson', classroom: 'CS-101', duration: 60 },
    { day: 'Tuesday', time: '10:00-11:00', subject: 'Computer Networks', staff: 'Prof. Taylor', classroom: 'CS-105', duration: 60 },
  ];

  const sampleConflicts: ConflictAlert[] = [
    {
      type: 'overlap',
      message: 'Dr. Smith has overlapping classes on Monday 10:00-11:00',
      severity: 'high',
      affected_items: ['Data Structures', 'Programming Lab']
    },
    {
      type: 'room_conflict',
      message: 'Classroom CS-101 is double booked on Tuesday 14:00-15:00',
      severity: 'medium',
      affected_items: ['CS-101']
    },
    {
      type: 'overload',
      message: 'Prof. Johnson has 7 classes scheduled (exceeds limit of 6)',
      severity: 'medium',
      affected_items: ['Prof. Johnson']
    }
  ];

  const handleGenerateTimetable = async () => {
    if (!generationParams.department || !generationParams.startDate || !generationParams.endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setConflicts([]);

    // Simulate AI generation process
    const steps = [
      { message: "Initializing AI engine...", progress: 10 },
      { message: "Loading staff availability...", progress: 25 },
      { message: "Processing subject requirements...", progress: 40 },
      { message: "Checking classroom availability...", progress: 55 },
      { message: "Optimizing schedule conflicts...", progress: 70 },
      { message: "Applying constraints and rules...", progress: 85 },
      { message: "Finalizing timetable...", progress: 100 },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenerationProgress(step.progress);
      toast({
        title: "AI Generation",
        description: step.message,
      });
    }

    // Set results
    setCurrentTimetable(sampleTimetable);
    setConflicts(sampleConflicts);
    setIsGenerating(false);

    toast({
      title: "Success",
      description: "Timetable generated successfully with AI optimization!",
    });
  };

  const handleExportTimetable = () => {
    // TODO: Implement actual Excel export
    toast({
      title: "Export Started",
      description: "Timetable is being exported to Excel format...",
    });
    
    // Simulate download
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Timetable downloaded successfully!",
      });
    }, 2000);
  };

  const handleResolveConflict = (conflictIndex: number) => {
    const newConflicts = conflicts.filter((_, index) => index !== conflictIndex);
    setConflicts(newConflicts);
    toast({
      title: "Conflict Resolved",
      description: "The conflict has been automatically resolved by AI.",
    });
  };

  const getConflictColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Timetable Generator</h1>
              <p className="text-sm text-gray-600">Intelligent Schedule Optimization</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">{user?.role?.replace('_', ' ')}</Badge>
            <span className="text-sm text-gray-600">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Generation Parameters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-600" />
              AI Generation Parameters
            </CardTitle>
            <CardDescription>
              Configure parameters for intelligent timetable generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select onValueChange={(value) => setGenerationParams({...generationParams, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cse">Computer Science Engineering</SelectItem>
                    <SelectItem value="ece">Electronics & Communication</SelectItem>
                    <SelectItem value="mech">Mechanical Engineering</SelectItem>
                    <SelectItem value="civil">Civil Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={generationParams.startDate}
                  onChange={(e) => setGenerationParams({...generationParams, startDate: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={generationParams.endDate}
                  onChange={(e) => setGenerationParams({...generationParams, endDate: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workingDays">Working Days per Week</Label>
                <Select onValueChange={(value) => setGenerationParams({...generationParams, workingDays: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue placeholder={generationParams.workingDays.toString()} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Days</SelectItem>
                    <SelectItem value="6">6 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxClasses">Max Classes per Day</Label>
                <Input
                  id="maxClasses"
                  type="number"
                  value={generationParams.maxClassesPerDay}
                  onChange={(e) => setGenerationParams({...generationParams, maxClassesPerDay: parseInt(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Preferred Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={generationParams.preferredStartTime}
                  onChange={(e) => setGenerationParams({...generationParams, preferredStartTime: e.target.value})}
                />
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              <Button 
                onClick={handleGenerateTimetable}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate AI Timetable
                  </>
                )}
              </Button>

              {currentTimetable.length > 0 && (
                <Button variant="outline" onClick={handleExportTimetable}>
                  <Download className="h-4 w-4 mr-2" />
                  Export to Excel
                </Button>
              )}
            </div>

            {/* Generation Progress */}
            {isGenerating && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">AI Processing</span>
                  <span className="text-sm text-gray-600">{generationProgress}%</span>
                </div>
                <Progress value={generationProgress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conflict Alerts */}
        {conflicts.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Conflict Alerts
              </CardTitle>
              <CardDescription>
                AI has detected potential scheduling conflicts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conflicts.map((conflict, index) => (
                  <Alert key={index} className={getConflictColor(conflict.severity)}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{conflict.message}</p>
                        <p className="text-sm opacity-75">
                          Affected: {conflict.affected_items.join(', ')}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleResolveConflict(index)}
                      >
                        Auto-Resolve
                      </Button>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generated Timetable */}
        {currentTimetable.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                Generated Timetable
              </CardTitle>
              <CardDescription>
                AI-optimized schedule with conflict resolution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="weekly" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="weekly">Weekly View</TabsTrigger>
                  <TabsTrigger value="daily">Daily View</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="weekly">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Staff</TableHead>
                        <TableHead>Classroom</TableHead>
                        <TableHead>Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentTimetable.map((slot, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{slot.day}</TableCell>
                          <TableCell>{slot.time}</TableCell>
                          <TableCell>{slot.subject}</TableCell>
                          <TableCell>{slot.staff}</TableCell>
                          <TableCell>{slot.classroom}</TableCell>
                          <TableCell>{slot.duration} min</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="daily">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                      <Card key={day}>
                        <CardHeader>
                          <CardTitle className="text-lg">{day}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {currentTimetable
                              .filter(slot => slot.day === day)
                              .map((slot, index) => (
                                <div key={index} className="p-2 bg-gray-50 rounded">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{slot.time}</span>
                                    <Badge variant="outline">{slot.classroom}</Badge>
                                  </div>
                                  <p className="text-sm text-gray-600">{slot.subject}</p>
                                  <p className="text-xs text-gray-500">{slot.staff}</p>
                                </div>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="analytics">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Clock className="h-5 w-5 mr-2" />
                          Time Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Morning (9-12)</span>
                            <span className="text-sm font-medium">40%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Afternoon (1-5)</span>
                            <span className="text-sm font-medium">60%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Users className="h-5 w-5 mr-2" />
                          Staff Utilization
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Dr. Smith</span>
                            <Badge variant="outline">85%</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Prof. Johnson</span>
                            <Badge variant="outline">75%</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Dr. Brown</span>
                            <Badge variant="outline">80%</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <BookOpen className="h-5 w-5 mr-2" />
                          Subject Coverage
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Core Subjects</span>
                            <Badge variant="default">100%</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Electives</span>
                            <Badge variant="secondary">85%</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Labs</span>
                            <Badge variant="outline">90%</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TimetableGenerator;
