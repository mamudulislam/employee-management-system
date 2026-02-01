import { apiGet, apiPost, apiPut, apiDelete } from '../utils/apiIntegration';
import { AuthService } from './authService';
import { Employee, Department } from '../types';

export interface EmployeeFormData {
  employeeId: string;
  name: string;
  email: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  address: string;
  department: Department;
  designation: string;
  role: 'Admin' | 'Manager' | 'HR' | 'Employee';
  dateOfJoining: string;
  status: 'Active' | 'On Leave' | 'Resigned' | 'Retired';
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  salary: number;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };
}

export interface EmployeeResponse {
  data: Employee[];
  total: number;
  page: number;
  limit: number;
}

export class EmployeeService {
  static async getEmployees(params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
  }): Promise<EmployeeResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.department) queryParams.append('department', params.department);
      
      const url = `/employees${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiGet<EmployeeResponse>(url, AuthService.getToken() || undefined);
      
      if (response.success && response.data) {
        // Transform backend employee data to frontend format
        const transformedEmployees = response.data.data.map((emp: any) => ({
          id: emp._id,
          name: emp.name,
          email: emp.email,
          role: emp.role,
          department: emp.department as Department,
          joinDate: emp.dateOfJoining,
          salary: emp.salary,
          status: emp.status,
          avatar: emp.profilePicture || ''
        }));
        
        return {
          data: transformedEmployees,
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit
        };
      }
      
      throw new Error(response.error || 'Failed to fetch employees');
    } catch (error) {
      console.error('Get employees failed:', error);
      throw error;
    }
  }

  static async getEmployee(id: string): Promise<Employee> {
    try {
      const response = await apiGet(`/employees/${id}`, AuthService.getToken() || undefined);
      
      if (response.success && response.data) {
        const emp = response.data;
        return {
          id: emp._id,
          name: emp.name,
          email: emp.email,
          role: emp.role,
          department: emp.department as Department,
          joinDate: emp.dateOfJoining,
          salary: emp.salary,
          status: emp.status,
          avatar: emp.profilePicture || ''
        };
      }
      
      throw new Error(response.error || 'Failed to fetch employee');
    } catch (error) {
      console.error('Get employee failed:', error);
      throw error;
    }
  }

  static async createEmployee(employeeData: EmployeeFormData): Promise<Employee> {
    try {
      const response = await apiPost('/employees', employeeData, AuthService.getToken() || undefined);
      
      if (response.success && response.data) {
        const emp = response.data;
        return {
          id: emp._id,
          name: emp.name,
          email: emp.email,
          role: emp.role,
          department: emp.department as Department,
          joinDate: emp.dateOfJoining,
          salary: emp.salary,
          status: emp.status,
          avatar: emp.profilePicture || ''
        };
      }
      
      throw new Error(response.error || 'Failed to create employee');
    } catch (error) {
      console.error('Create employee failed:', error);
      throw error;
    }
  }

  static async updateEmployee(id: string, employeeData: Partial<EmployeeFormData>): Promise<Employee> {
    try {
      const response = await apiPut(`/employees/${id}`, employeeData, AuthService.getToken() || undefined);
      
      if (response.success && response.data) {
        const emp = response.data;
        return {
          id: emp._id,
          name: emp.name,
          email: emp.email,
          role: emp.role,
          department: emp.department as Department,
          joinDate: emp.dateOfJoining,
          salary: emp.salary,
          status: emp.status,
          avatar: emp.profilePicture || ''
        };
      }
      
      throw new Error(response.error || 'Failed to update employee');
    } catch (error) {
      console.error('Update employee failed:', error);
      throw error;
    }
  }

  static async deleteEmployee(id: string): Promise<void> {
    try {
      const response = await apiDelete(`/employees/${id}`, AuthService.getToken() || undefined);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete employee');
      }
    } catch (error) {
      console.error('Delete employee failed:', error);
      throw error;
    }
  }
}