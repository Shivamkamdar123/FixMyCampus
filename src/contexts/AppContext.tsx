import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Issue, AppState } from '../types';

interface AppContextType {
  state: AppState;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (userData: any) => Promise<User>;
  createIssue: (issueData: any) => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  getStudentIssues: (studentId: string) => Issue[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction = 
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_ISSUES'; payload: Issue[] }
  | { type: 'ADD_ISSUE'; payload: Issue }
  | { type: 'UPDATE_ISSUE'; payload: { id: string; updates: Partial<Issue> } };

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        auth: { user: action.payload, isAuthenticated: true }
      };
    case 'LOGOUT':
      return {
        ...state,
        auth: { user: null, isAuthenticated: false }
      };
    case 'SET_ISSUES':
      return {
        ...state,
        issues: action.payload
      };
    case 'ADD_ISSUE':
      return {
        ...state,
        issues: [...state.issues, action.payload]
      };
    case 'UPDATE_ISSUE':
      return {
        ...state,
        issues: state.issues.map(issue => 
          issue.id === action.payload.id 
            ? { ...issue, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : issue
        )
      };
    default:
      return state;
  }
};

const initialState: AppState = {
  auth: { user: null, isAuthenticated: false },
  issues: []
};

// Mock data for demo
const mockUsers = [
  { 
    id: '1', 
    email: 'student@college.edu', 
    password: 'student123',
    name: 'John Doe', 
    role: 'student' as const, 
    rollNo: 'CS21001', 
    department: 'Computer Science' 
  },
  { 
    id: '2', 
    email: 'admin@college.edu', 
    password: 'admin123',
    name: 'Dr. Sarah Smith', 
    role: 'admin' as const 
  }
];

const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Broken WiFi in Library',
    description: 'The WiFi connection in the main library is extremely slow and keeps disconnecting. This is affecting students\' ability to research and complete assignments.',
    category: 'Infrastructure',
    location: 'Main Library - 2nd Floor',
    status: 'pending',
    priority: 'high',
    studentId: '1',
    studentName: 'John Doe',
    studentRollNo: 'CS21001',
    studentDepartment: 'Computer Science',
    createdAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-01-15T09:30:00Z'
  },
  {
    id: '2',
    title: 'Leaking Ceiling in Classroom',
    description: 'There is water leaking from the ceiling in Room 201. It started yesterday after the rain and is getting worse.',
    category: 'Maintenance',
    location: 'Academic Block A - Room 201',
    status: 'in-progress',
    priority: 'medium',
    studentId: '1',
    studentName: 'John Doe',
    studentRollNo: 'CS21001',
    studentDepartment: 'Computer Science',
    assignedTo: 'Maintenance Team',
    adminRemarks: 'Maintenance team has been notified. Repair scheduled for tomorrow.',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-15T10:15:00Z'
  },
  {
    id: '3',
    title: 'Parking Space Shortage',
    description: 'There are insufficient parking spaces for students. Many students have to park far away from campus.',
    category: 'Infrastructure',
    location: 'Main Parking Area',
    status: 'resolved',
    priority: 'low',
    studentId: '1',
    studentName: 'John Doe',
    studentRollNo: 'CS21001',
    studentDepartment: 'Computer Science',
    assignedTo: 'Campus Administration',
    adminRemarks: 'Additional parking spaces have been allocated in the north campus.',
    createdAt: '2024-01-10T11:00:00Z',
    updatedAt: '2024-01-13T16:30:00Z'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Initialize with mock data
    const storedAuth = localStorage.getItem('fixmycampus-auth');
    const storedIssues = localStorage.getItem('fixmycampus-issues');
    
    if (storedAuth) {
      const user = JSON.parse(storedAuth);
      dispatch({ type: 'LOGIN', payload: user });
    }
    
    if (storedIssues) {
      dispatch({ type: 'SET_ISSUES', payload: JSON.parse(storedIssues) });
    } else {
      dispatch({ type: 'SET_ISSUES', payload: mockIssues });
      localStorage.setItem('fixmycampus-issues', JSON.stringify(mockIssues));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fixmycampus-issues', JSON.stringify(state.issues));
  }, [state.issues]);

  const login = async (email: string, password: string): Promise<User> => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    dispatch({ type: 'LOGIN', payload: userWithoutPassword });
    localStorage.setItem('fixmycampus-auth', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('fixmycampus-auth');
  };

  const register = async (userData: any): Promise<User> => {
    const newUser = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      role: 'student' as const,
      rollNo: userData.rollNo,
      department: userData.department
    };
    
    mockUsers.push({ ...newUser, password: userData.password });
    dispatch({ type: 'LOGIN', payload: newUser });
    localStorage.setItem('fixmycampus-auth', JSON.stringify(newUser));
    return newUser;
  };

  const createIssue = (issueData: any) => {
    const newIssue: Issue = {
      id: Date.now().toString(),
      ...issueData,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_ISSUE', payload: newIssue });
  };

  const updateIssue = (id: string, updates: Partial<Issue>) => {
    dispatch({ type: 'UPDATE_ISSUE', payload: { id, updates } });
  };

  const getStudentIssues = (studentId: string) => {
    return state.issues.filter(issue => issue.studentId === studentId);
  };

  return (
    <AppContext.Provider value={{
      state,
      login,
      logout,
      register,
      createIssue,
      updateIssue,
      getStudentIssues
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};