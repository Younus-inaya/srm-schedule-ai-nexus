
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { GraduationCap, Users, Calendar, Zap, Shield, Database } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect authenticated users to their appropriate dashboard
  if (isAuthenticated && user) {
    switch (user.role) {
      case 'main_admin':
        return <Navigate to="/main-admin" replace />;
      case 'dept_admin':
        return <Navigate to="/dept-admin" replace />;
      case 'staff':
        return <Navigate to="/staff" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SRM Timetable AI</h1>
              <p className="text-sm text-gray-600">SRM College Ramapuram</p>
            </div>
          </div>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => window.location.href = '/login'}>
              Login
            </Button>
            <Button onClick={() => window.location.href = '/register'}>
              Register
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Timetable Management
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Revolutionize academic scheduling with intelligent automation, 
            conflict resolution, and seamless department management for SRM College Ramapuram.
          </p>
          <div className="space-x-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = '/register'}>
              Get Started
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>AI-Powered Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced algorithms automatically generate optimized timetables with conflict resolution
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Multi-Role Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Separate dashboards for Main Admins, Department Admins, and Staff with role-based permissions
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Database className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Department Workspaces</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Isolated department environments with dedicated staff, subjects, and classroom management
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Smart Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Intelligent conflict detection, availability checking, and automated timetable optimization
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Secure Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  JWT-based security with @srmist.edu.in email validation and CSRF protection
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <GraduationCap className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <CardTitle>Export & Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Export timetables to Excel, integrate with existing systems, and real-time updates
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            System Architecture
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Technology Stack</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                  <span><strong>Frontend:</strong> React/Next.js with TypeScript</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                  <span><strong>Backend:</strong> Flask (Python) REST API</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-purple-600 rounded-full mr-3"></div>
                  <span><strong>Database:</strong> SQLite with proper relationships</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-orange-600 rounded-full mr-3"></div>
                  <span><strong>AI Engine:</strong> Custom Python algorithms</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-red-600 rounded-full mr-3"></div>
                  <span><strong>Security:</strong> JWT + CSRF protection</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Key Benefits</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✅ Automated conflict resolution</li>
                <li>✅ Real-time timetable generation</li>
                <li>✅ Multi-department isolation</li>
                <li>✅ Role-based access control</li>
                <li>✅ Excel export capabilities</li>
                <li>✅ Scalable architecture</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <GraduationCap className="h-6 w-6" />
            <span className="font-semibold">SRM Timetable AI</span>
          </div>
          <p className="text-gray-400">
            © 2024 SRM College Ramapuram. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
