export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: EventType;
  description?: string;
  location?: string;
  attendees?: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  reminder?: {
    enabled: boolean;
    time: number; // minutes before
  };
  recurring?: {
    enabled: boolean;
    pattern: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
  };
  metadata?: {
    employeeId?: string;
    managerId?: string;
    department?: string;
    priority?: 'low' | 'medium' | 'high';
  };
}

export type EventType = 
  | 'work_shift'
  | 'sick_leave'
  | 'casual_leave'
  | 'vacation'
  | 'holiday'
  | 'meeting'
  | 'deadline'
  | 'company_event'
  | 'training'
  | 'interview';

export type ViewMode = 'day' | 'week' | 'month';

export type UserRole = 'employee' | 'manager' | 'hr';

export interface CalendarPermissions {
  canCreateEvents: boolean;
  canEditOwnEvents: boolean;
  canEditAllEvents: boolean;
  canDeleteEvents: boolean;
  canApproveLeave: boolean;
  canAssignShifts: boolean;
  canViewAllCalendars: boolean;
}

export interface EventFilter {
  types: EventType[];
  status: ('pending' | 'approved' | 'rejected')[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  employees?: string[];
  departments?: string[];
}

export interface CalendarState {
  currentDate: Date;
  viewMode: ViewMode;
  selectedEvent?: CalendarEvent;
  filters: EventFilter;
  isLoading: boolean;
  events: CalendarEvent[];
}

export interface EventTypeConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  requiresApproval: boolean;
  allowRecurring: boolean;
}