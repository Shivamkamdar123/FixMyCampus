export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  rollNo?: string;
  department?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  studentId: string;
  studentName: string;
  studentRollNo: string;
  studentDepartment: string;
  assignedTo?: string;
  adminRemarks?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface AppState {
  auth: AuthState;
  issues: Issue[];
}