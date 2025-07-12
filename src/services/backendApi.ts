
// Backend API service for Python Flask/FastAPI integration
const API_BASE_URL = 'http://localhost:5000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  employee_id: string;
  department: string;
  programme: string;
  type: string;
  role: 'main_admin' | 'dept_admin' | 'staff';
  contact_number: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  employee_id: string;
  role: 'main_admin' | 'dept_admin' | 'staff';
  department_id?: string;
  department_name?: string;
  staff_role?: string;
  username: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  admin_id?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  department_id: string;
  credits: number;
}

export interface Timetable {
  id: string;
  department_id: string;
  day: string;
  time_slot: string;
  subject_id: string;
  staff_id: string;
  classroom_id: string;
  subject_name?: string;
  staff_name?: string;
  classroom_name?: string;
}

class BackendApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = localStorage.getItem('auth_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    const result = await this.makeRequest('/auth/logout', {
      method: 'POST',
    });
    localStorage.removeItem('auth_token');
    return result;
  }

  // User Management (Main Admin only)
  async registerUser(userData: RegisterData): Promise<ApiResponse<User>> {
    return this.makeRequest('/admin/register-user', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.makeRequest('/admin/users');
  }

  // Department Management
  async getDepartments(): Promise<ApiResponse<Department[]>> {
    return this.makeRequest('/departments');
  }

  async createDepartment(department: { name: string; code: string; admin_id?: string }): Promise<ApiResponse<Department>> {
    return this.makeRequest('/admin/departments', {
      method: 'POST',
      body: JSON.stringify(department),
    });
  }

  async assignDepartmentAdmin(departmentId: string, adminId: string): Promise<ApiResponse<void>> {
    return this.makeRequest(`/admin/departments/${departmentId}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ admin_id: adminId }),
    });
  }

  // Subject Management
  async getSubjects(departmentId?: string): Promise<ApiResponse<Subject[]>> {
    const endpoint = departmentId ? `/subjects?department_id=${departmentId}` : '/subjects';
    return this.makeRequest(endpoint);
  }

  async createSubject(subject: { name: string; code: string; department_id: string; credits: number }): Promise<ApiResponse<Subject>> {
    return this.makeRequest('/subjects', {
      method: 'POST',
      body: JSON.stringify(subject),
    });
  }

  // Staff Subject Selection
  async selectSubjects(subjectIds: string[]): Promise<ApiResponse<void>> {
    return this.makeRequest('/staff/select-subjects', {
      method: 'POST',
      body: JSON.stringify({ subject_ids: subjectIds }),
    });
  }

  async getStaffSubjects(): Promise<ApiResponse<Subject[]>> {
    return this.makeRequest('/staff/subjects');
  }

  // Timetable Management
  async generateTimetable(departmentId: string): Promise<ApiResponse<Timetable[]>> {
    return this.makeRequest('/timetable/generate', {
      method: 'POST',
      body: JSON.stringify({ department_id: departmentId }),
    });
  }

  async getTimetable(departmentId: string, type?: 'class' | 'staff' | 'classroom'): Promise<ApiResponse<Timetable[]>> {
    const endpoint = `/timetable/${departmentId}${type ? `?type=${type}` : ''}`;
    return this.makeRequest(endpoint);
  }

  // AI Configuration (Main Admin only)
  async updateApiKeys(keys: { groq_key?: string; gemini_key?: string }): Promise<ApiResponse<void>> {
    return this.makeRequest('/admin/api-keys', {
      method: 'PUT',
      body: JSON.stringify(keys),
    });
  }

  async getApiKeysStatus(): Promise<ApiResponse<{ groq_configured: boolean; gemini_configured: boolean }>> {
    return this.makeRequest('/admin/api-keys/status');
  }
}

export const backendApi = new BackendApiService();
