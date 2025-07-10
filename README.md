
# SRM Timetable AI - Comprehensive Timetable Management System

A complete, full-stack, AI-powered Timetable Management Web Application for SRM College Ramapuram featuring intelligent scheduling, multi-role authentication, and department-based workspaces.

## 🚀 Features

### 🤖 AI-Powered Timetable Generation
- **Intelligent Scheduling**: Advanced algorithms for optimal timetable generation
- **Conflict Resolution**: Automatic detection and resolution of scheduling conflicts
- **Resource Optimization**: Smart allocation of classrooms, staff, and time slots
- **Real-time Alerts**: Instant notifications for violations and conflicts

### 👥 Multi-Role Authentication System
- **Main Admin**: System-wide control, department creation, and rule management
- **Department Admin**: Department-specific management and staff oversight
- **Staff Members**: Subject selection and personal schedule management
- **Secure Access**: JWT-based authentication with @srmist.edu.in validation

### 🏢 Department-Based Workspaces
- **Isolated Environments**: Each department operates independently
- **Resource Management**: Department-specific staff, subjects, and classrooms
- **Role-Based Permissions**: Granular access control based on user roles
- **Scalable Architecture**: Support for multiple departments simultaneously

### 📊 Advanced Management Features
- **Subject Selection**: Role-based subject allocation (Assistant Prof: 2, Prof/HOD: 1)
- **Subject Locking**: Prevent changes once selections are finalized
- **Excel Export**: Download generated timetables in Excel format
- **Real-time Updates**: Live synchronization across all users

## 🛠 Technology Stack

### Frontend (Current Implementation)
- **React 18** with TypeScript
- **Tailwind CSS** for responsive design
- **shadcn/ui** component library
- **React Router** for navigation
- **TanStack Query** for state management
- **Modern UI/UX** with animations and transitions

### Backend (Planned Integration)
- **Flask (Python)** REST API
- **SQLite** database with proper relationships
- **JWT Authentication** with CSRF protection
- **AI Engine** for timetable optimization
- **Excel Export** using openpyxl/xlsxwriter

### AI & Optimization
- **Custom Python Algorithms** for schedule generation
- **Conflict Detection** and automatic resolution
- **Resource Optimization** for maximum efficiency
- **GROQ API Integration** for advanced AI capabilities
- **Google API Integration** for enhanced features

## 📁 Project Structure

```
srm-timetable-ai/
├── frontend/                 # React/TypeScript Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Route-based page components
│   │   ├── contexts/       # React contexts (Auth, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Dependencies
├── backend/                 # Flask API (To be implemented)
│   ├── app/
│   │   ├── routes/         # API endpoints
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   ├── migrations/         # Database migrations
│   └── requirements.txt    # Python dependencies
├── ai/                     # AI Engine (To be implemented)
│   ├── timetable_generator.py
│   ├── conflict_resolver.py
│   └── optimization.py
├── database/               # Database files
│   ├── init_db.py         # Database initialization
│   ├── seed_data.py       # Sample data
│   └── schema.sql         # Database schema
└── README.md              # This file
```

## 🚀 Getting Started in VS Code

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Python** 3.8+ (for backend)
- **VS Code** with recommended extensions
- **Git** for version control

### Step-by-Step Setup Guide

#### 1. Clone the Repository
```bash
# Clone the repository
git clone <your-repository-url>
cd srm-timetable-ai

# Create a new Git repository if starting fresh
git init
git add .
git commit -m "Initial commit: SRM Timetable AI setup"
```

#### 2. Frontend Setup (Current Implementation)
```bash
# Navigate to the project root (frontend is in root)
cd srm-timetable-ai

# Install frontend dependencies
npm install

# Start the development server
npm run dev

# The application will be available at http://localhost:8080
```

#### 3. Environment Configuration
Create a `.env` file in the root directory:
```bash
# API Keys (Replace with your actual keys)
VITE_GROQ_API_KEY=gsk_dLi47OvXzQoHkQQGj...
VITE_GOOGLE_API_KEY=AIzaSyBnP-dX3dSf5...

# Backend Configuration (When implemented)
VITE_API_URL=http://localhost:5000/api
VITE_JWT_SECRET=your-secret-key-here

# Database Configuration
DATABASE_URL=sqlite:///timetable.db
```

#### 4. VS Code Configuration
Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

Create `.vscode/launch.json` for debugging:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Frontend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/vite/bin/vite.js",
      "args": ["dev"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    }
  ]
}
```

#### 5. Recommended VS Code Extensions
Install the following extensions for optimal development experience:
```bash
# Install via VS Code Extension Marketplace or command palette:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens
- Prettier - Code formatter
- ESLint
- Thunder Client (for API testing)
```

### 🔧 Development Workflow

#### Running the Application
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

#### Database Setup (Future Implementation)
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python database/init_db.py

# Seed sample data
python database/seed_data.py

# Start Flask server
flask run
```

### 📝 Usage Guide

#### For Main Admins
1. **System Setup**: Create departments and assign department admins
2. **Rule Management**: Configure system-wide rules and constraints
3. **Department Oversight**: Monitor all departments and their activities
4. **Analytics**: View system-wide analytics and reports

#### For Department Admins
1. **Staff Management**: Register and manage department staff
2. **Subject Management**: Define and assign subjects
3. **Classroom Management**: Manage department classrooms and resources
4. **Timetable Generation**: Use AI to generate optimized schedules

#### For Staff Members
1. **Profile Management**: Update personal information
2. **Subject Selection**: Choose subjects based on role permissions
3. **Schedule Viewing**: Access personal teaching schedule
4. **Availability Management**: Set availability preferences

### 🎯 Current Implementation Status

#### ✅ Completed Features
- **Frontend Architecture**: Complete React/TypeScript setup
- **Authentication System**: Login/Register with email validation
- **Multi-Role Dashboards**: Separate interfaces for all user types
- **Subject Selection**: Role-based subject allocation system
- **AI Timetable Interface**: Complete UI for timetable generation
- **Department Management**: Full department admin capabilities
- **Responsive Design**: Mobile-friendly interface
- **Component Library**: Comprehensive UI component system

#### 🚧 Planned Implementations
- **Flask Backend**: Complete REST API implementation
- **Database Integration**: SQLite with proper relationships
- **JWT Authentication**: Secure token-based authentication
- **AI Engine**: Python-based timetable generation algorithms
- **Excel Export**: Automated timetable export functionality
- **Real-time Updates**: WebSocket integration for live updates
- **Email Notifications**: Automated alerts and notifications

### 🔧 API Endpoints (Planned)

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

#### Departments
- `GET /api/departments` - List all departments
- `POST /api/departments` - Create new department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

#### Staff Management
- `GET /api/staff` - List department staff
- `POST /api/staff` - Add new staff member
- `PUT /api/staff/:id` - Update staff information
- `DELETE /api/staff/:id` - Remove staff member

#### Timetable Generation
- `POST /api/timetable/generate` - Generate AI timetable
- `GET /api/timetable/:deptId` - Get department timetable
- `POST /api/timetable/export` - Export to Excel

### 🐛 Troubleshooting

#### Common Issues and Solutions

**1. Port Already in Use**
```bash
# Kill process on port 8080
npx kill-port 8080

# Or use different port
npm run dev -- --port 3000
```

**2. Module Resolution Errors**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**3. TypeScript Errors**
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Restart TypeScript server in VS Code
Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

**4. Tailwind CSS Not Working**
```bash
# Rebuild Tailwind
npm run build:css

# Check tailwind.config.ts for correct paths
```

### 🔒 Security Features

- **Email Validation**: Only @srmist.edu.in emails allowed
- **JWT Authentication**: Secure token-based authentication
- **CSRF Protection**: Cross-site request forgery prevention
- **Role-Based Access**: Granular permission system
- **Input Validation**: Comprehensive data validation
- **SQL Injection Prevention**: Parameterized queries

### 📊 Database Schema (Planned)

```sql
-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('main_admin', 'dept_admin', 'staff') NOT NULL,
    department_id INTEGER,
    staff_role ENUM('assistant_professor', 'professor', 'hod'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    admin_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects table
CREATE TABLE subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    credits INTEGER NOT NULL,
    type ENUM('core', 'elective', 'lab') NOT NULL,
    semester INTEGER NOT NULL,
    department_id INTEGER NOT NULL
);

-- And more tables for classrooms, timetables, etc.
```

### 🚀 Deployment

#### Development Deployment
```bash
# Build the application
npm run build

# Deploy to your preferred hosting service
# (Vercel, Netlify, etc.)
```

#### Production Deployment
1. **Frontend**: Deploy to Vercel/Netlify
2. **Backend**: Deploy Flask API to Heroku/Railway
3. **Database**: Use PostgreSQL for production
4. **Environment**: Configure production environment variables

### 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 📞 Support

For support and questions:
- **Email**: admin@srmist.edu.in
- **Issues**: Create an issue on GitHub
- **Documentation**: Check the inline code documentation

---

**Built with ❤️ for SRM College Ramapuram**

*This comprehensive timetable management system revolutionizes academic scheduling with AI-powered optimization, ensuring efficient resource utilization and conflict-free schedules for all departments.*
