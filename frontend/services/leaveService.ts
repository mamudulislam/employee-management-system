import { apiGet, apiPost, apiPatch } from '../utils/apiIntegration';

export interface LeaveRequest {
  employee: string;
  employeeName: string;
  leaveType: 'Casual' | 'Sick' | 'Paid' | 'Unpaid' | 'Maternity' | 'Paternity';
  startDate: string;
  endDate: string;
  reason: string;
}

export interface Leave {
  _id: string;
  employee: {
    _id: string;
    name: string;
    department: string;
    designation: string;
    employeeId: string;
  } | string | null;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  appliedDate: string;
  approvedBy?: string;
  remarks?: string;
}

export class LeaveService {
  static async getAllLeaves(token?: string): Promise<Leave[]> {
    try {
      const response = await apiGet<Leave[]>('/leaves', token);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch leaves');
      }
      return response.data || [];
    } catch (error) {
      console.error('Get leaves failed:', error);
      throw error;
    }
  }

  static async requestLeave(leaveData: LeaveRequest, token?: string): Promise<Leave> {
    try {
      const response = await apiPost<Leave>('/leaves', leaveData, token);
      if (!response.success) {
        throw new Error(response.error || 'Failed to request leave');
      }
      return response.data!;
    } catch (error) {
      console.error('Leave request failed:', error);
      throw error;
    }
  }

  static async updateLeaveStatus(
    leaveId: string, 
    status: 'Approved' | 'Rejected' | 'Cancelled', 
    remarks?: string,
    token?: string
  ): Promise<Leave> {
    try {
      const response = await apiPatch<Leave>(`/leaves/${leaveId}/status`, {
        status,
        remarks
      }, token);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update leave status');
      }
      return response.data!;
    } catch (error) {
      console.error('Update leave status failed:', error);
      throw error;
    }
  }

  static async getEmployeeLeaves(employeeId: string, token?: string): Promise<Leave[]> {
    try {
      const response = await apiGet<Leave[]>(`/leaves/employee/${employeeId}`, token);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch employee leaves');
      }
      return response.data || [];
    } catch (error) {
      console.error('Get employee leaves failed:', error);
      throw error;
    }
  }
}