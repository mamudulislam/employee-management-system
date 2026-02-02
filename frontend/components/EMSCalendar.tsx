"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfDay,
  endOfDay
} from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Grid3X3,
  List,
  CalendarDays,
  Clock,
  Filter,
  Plus,
  Bell,
  Search
} from 'lucide-react';

import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  CalendarEvent, 
  ViewMode, 
  EventType, 
  UserRole,
  CalendarPermissions 
} from '../types/calendar';
import { getEventConfig } from '../constants/calendar';
import { EventModal } from './calendar/EventModal';
import { CalendarSidebar } from './calendar/CalendarSidebar';
import { DayView } from './calendar/DayView';
import { WeekView } from './calendar/WeekView';
import { MonthView } from './calendar/MonthView';

interface EMSCalendarProps {
  userRole: UserRole;
  userId: string;
  initialEvents?: CalendarEvent[];
  onEventCreate?: (event: Partial<CalendarEvent>) => Promise<void>;
  onEventUpdate?: (event: CalendarEvent) => Promise<void>;
  onEventDelete?: (eventId: string) => Promise<void>;
  onEventApprove?: (eventId: string) => Promise<void>;
}

export function EMSCalendar({ 
  userRole, 
  userId, 
  initialEvents = [],
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  onEventApprove
}: EMSCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isLoading, setIsLoading] = useState(false);

  // Role-based permissions
  const permissions: Record<UserRole, CalendarPermissions> = {
    employee: {
      canCreateEvents: true,
      canEditOwnEvents: true,
      canEditAllEvents: false,
      canDeleteEvents: true,
      canApproveLeave: false,
      canAssignShifts: false,
      canViewAllCalendars: false,
    },
    manager: {
      canCreateEvents: true,
      canEditOwnEvents: true,
      canEditAllEvents: true,
      canDeleteEvents: true,
      canApproveLeave: true,
      canAssignShifts: true,
      canViewAllCalendars: true,
    },
    hr: {
      canCreateEvents: true,
      canEditOwnEvents: true,
      canEditAllEvents: true,
      canDeleteEvents: true,
      canApproveLeave: true,
      canAssignShifts: true,
      canViewAllCalendars: true,
    },
  };

  const userPermissions = permissions[userRole];

  // Filter events based on search and filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(event.type);
      
      const canView = userPermissions.canViewAllCalendars || 
                      event.createdBy === userId ||
                      event.type === 'work_shift' ||
                      event.type === 'holiday';

      return matchesSearch && matchesType && canView;
    });
  }, [events, searchQuery, selectedTypes, userPermissions.canViewAllCalendars, userId]);

  // Navigation functions
  const navigatePrevious = () => {
    switch (viewMode) {
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(subDays(currentDate, 1));
        break;
    }
  };

  const navigateNext = () => {
    switch (viewMode) {
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
    }
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleCreateEvent = () => {
    setSelectedEvent(undefined);
    setIsEventModalOpen(true);
  };

  const handleEventSave = async (eventData: Partial<CalendarEvent>) => {
    setIsLoading(true);
    try {
      if (selectedEvent) {
        const updatedEvent = { ...selectedEvent, ...eventData, updatedAt: new Date() };
        if (onEventUpdate) await onEventUpdate(updatedEvent);
        setEvents(prev => prev.map(e => e.id === selectedEvent.id ? updatedEvent : e));
      } else {
        const newEvent: CalendarEvent = {
          id: Date.now().toString(),
          title: eventData.title || '',
          start: eventData.start || new Date(),
          end: eventData.end || new Date(),
          type: eventData.type || 'work_shift',
          status: 'pending',
          createdBy: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...eventData,
        };
        if (onEventCreate) await onEventCreate(newEvent);
        setEvents(prev => [...prev, newEvent]);
      }
      setIsEventModalOpen(false);
      setSelectedEvent(undefined);
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventDelete = async (eventId: string) => {
    setIsLoading(true);
    try {
      if (onEventDelete) await onEventDelete(eventId);
      setEvents(prev => prev.filter(e => e.id !== eventId));
      setIsEventModalOpen(false);
      setSelectedEvent(undefined);
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventApprove = async (eventId: string) => {
    setIsLoading(true);
    try {
      if (onEventApprove) await onEventApprove(eventId);
      setEvents(prev => prev.map(e => 
        e.id === eventId ? { ...e, status: 'approved', updatedAt: new Date() } : e
      ));
    } catch (error) {
      console.error('Error approving event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-slate-900">Company Calendar</h1>
            <Badge variant="outline" className="text-xs">
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedTypes([])}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
            
            {userPermissions.canCreateEvents && (
              <Button onClick={handleCreateEvent}>
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </Button>
            )}
            
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation and View Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={navigatePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" onClick={navigateToday}>
              Today
            </Button>
            <Button variant="ghost" onClick={navigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-slate-900">
                {format(currentDate, viewMode === 'month' ? 'MMMM yyyy' : 'MMM dd, yyyy')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'day' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('day')}
            >
              <List className="h-4 w-4 mr-1" />
              Day
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('week')}
            >
              <CalendarDays className="h-4 w-4 mr-1" />
              Week
            </Button>
            <Button
              variant={viewMode === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('month')}
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              Month
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Calendar Sidebar */}
        <CalendarSidebar
          selectedTypes={selectedTypes}
          onTypesChange={setSelectedTypes}
          events={filteredEvents}
          userPermissions={userPermissions}
          onEventApprove={handleEventApprove}
          onEventClick={handleEventClick}
        />

        {/* Calendar View */}
        <div className="flex-1 p-6">
          {viewMode === 'day' && (
            <DayView
              date={currentDate}
              events={filteredEvents}
              onEventClick={handleEventClick}
              onCreateEvent={handleCreateEvent}
            />
          )}
          
          {viewMode === 'week' && (
            <WeekView
              date={currentDate}
              events={filteredEvents}
              onEventClick={handleEventClick}
              onCreateEvent={handleCreateEvent}
            />
          )}
          
          {viewMode === 'month' && (
            <MonthView
              date={currentDate}
              events={filteredEvents}
              onEventClick={handleEventClick}
              onCreateEvent={handleCreateEvent}
            />
          )}
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        event={selectedEvent}
        onSave={handleEventSave}
        onDelete={handleEventDelete}
        userPermissions={userPermissions}
        userRole={userRole}
        userId={userId}
        isLoading={isLoading}
      />
    </div>
  );
}