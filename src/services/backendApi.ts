
// Backend API service for SRM Timetable AI
const API_BASE_URL = 'http://localhost:5000/api';

export interface User {
  id: string;
  name: string;
  email: string;
  employee_id?: string;
  role: 'main_admin' | 'dept_admin' | 'staff';
  department_id?: string;
  department?: string;
  programme?: string;
  type?: string;
  contact_number?: string;
  username?: string;
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
  credits: number;
  department_id: string;
}

export interface Classroom {
  id: string;
  name: string;
  capacity: number;
  department_id: string;
}

export interface Constraint {
  id: string;
  department_id: string;
  constraint_type: string;
  constraint_value: any;
  created_by: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class BackendApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || `HTTP ${response.status}`,
        };
      }
      
      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Authentication
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      return this.handleResponse<{ user: User; token: string }>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
      
      const result = await this.handleResponse<any>(response);
      return {
        success: result.success,
        error: result.error,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async verifyToken(): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: this.getAuthHeaders(),
      });
      
      return this.handleResponse<{ user: User }>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // User Management
  async createUser(userData: Omit<User, 'id' | 'username'>): Promise<ApiResponse<{ user: User; credentials: { username: string; password: string } }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData),
      });
      
      return this.handleResponse<{ user: User; credentials: { username: string; password: string } }>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async getUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: this.getAuthHeaders(),
      });
      
      return this.handleResponse<User[]>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      
      return this.handleResponse<User>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Department Management
  async createDepartment(deptData: Omit<Department, 'id'>): Promise<ApiResponse<Department>> {
    try {
      const response = await fetch(`${API_BASE_URL}/departments`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(deptData),
      });
      
      return this.handleResponse<Department>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async getDepartments(): Promise<ApiResponse<Department[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/departments`, {
        headers: this.getAuthHeaders(),
      });
      
      return this.handleResponse<Department[]>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Subject Management
  async createSubject(subjectData: Omit<Subject, 'id'>): Promise<ApiResponse<Subject>> {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(subjectData),
      });
      
      return this.handleResponse<Subject>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async getSubjects(departmentId?: string): Promise<ApiResponse<Subject[]>> {
    try {
      const url = departmentId 
        ? `${API_BASE_URL}/subjects?department_id=${departmentId}`
        : `${API_BASE_URL}/subjects`;
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });
      
      return this.handleResponse<Subject[]>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Classroom Management
  async createClassroom(classroomData: Omit<Classroom, 'id'>): Promise<ApiResponse<Classroom>> {
    try {
      const response = await fetch(`${API_BASE_URL}/classrooms`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(classroomData),
      });
      
      return this.handleResponse<Classroom>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async getClassrooms(departmentId?: string): Promise<ApiResponse<Classroom[]>> {
    try {
      const url = departmentId 
        ? `${API_BASE_URL}/classrooms?department_id=${departmentId}`
        : `${API_BASE_URL}/classrooms`;
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });
      
      return this.handleResponse<Classroom[]>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Constraint Management
  async createConstraint(constraintData: Omit<Constraint, 'id'>): Promise<ApiResponse<Constraint>> {
    try {
      const response = await fetch(`${API_BASE_URL}/constraints`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(constraintData),
      });
      
      return this.handleResponse<Constraint>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async getConstraints(departmentId?: string): Promise<ApiResponse<Constraint[]>> {
    try {
      const url = departmentId 
        ? `${API_BASE_URL}/constraints?department_id=${departmentId}`
        : `${API_BASE_URL}/constraints`;
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });
      
      return this.handleResponse<Constraint[]>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // API Key Management
  async updateApiKeys(keys: { groq_api_key?: string; google_api_key?: string }): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/api-keys`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(keys),
      });
      
      const result = await this.handleResponse<any>(response);
      return {
        success: result.success,
        error: result.error,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async getApiKeys(): Promise<ApiResponse<{ groq_api_key?: string; google_api_key?: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/api-keys`, {
        headers: this.getAuthHeaders(),
      });
      
      return this.handleResponse<{ groq_api_key?: string; google_api_key?: string }>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Timetable Generation
  async generateTimetable(departmentId: string, constraints?: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/generate`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ department_id: departmentId, constraints }),
      });
      
      return this.handleResponse<any>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async getTimetable(departmentId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/${departmentId}`, {
        headers: this.getAuthHeaders(),
      });
      
      return this.handleResponse<any>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }
}

export const backendApi = new BackendApiService();
