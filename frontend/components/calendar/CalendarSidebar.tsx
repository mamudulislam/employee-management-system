"use client"

import React, { useState } from 'react';
import { format, startOfWeek, endOfWeek, isToday, isThisWeek } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ChevronRight,
  Filter
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';

import { CalendarEvent, EventType, CalendarPermissions } from '../../types/calendar';
import { getEventConfig } from '../../constants/calendar';

interface CalendarSidebarProps {
  selectedTypes: EventType[];
  onTypesChange: (types: EventType[]) => void;
  events: CalendarEvent[];
  userPermissions: CalendarPermissions;
  onEventApprove: (eventId: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function CalendarSidebar({
  selectedTypes,
  onTypesChange,
  events,
  userPermissions,
  onEventApprove,
  onEventClick
}: CalendarSidebarProps) {
  const [activeSection, setActiveSection] = useState<'filters' | 'pending' | 'today'>('filters');

  // Get events that need approval
  const pendingEvents = events.filter(event => 
    event.status === 'pending' && 
    userPermissions.canApproveLeave &&
    ['sick_leave', 'casual_leave', 'vacation', 'training'].includes(event.type)
  );

  // Get today's events
  const todayEvents = events.filter(event => 
    isToday(new Date(event.start))
  );

  const handleTypeToggle = (type: EventType) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    onTypesChange(newTypes);
  };

  const EventItem = ({ event }: { event: CalendarEvent }) => {
    const config = getEventConfig(event.type);
    
    return (
      <div
        className="p-3 rounded-lg border hover:bg-slate-50 cursor-pointer transition-colors"
        style={{ 
          borderColor: config.borderColor,
          backgroundColor: config.bgColor + '20'
        }}
        onClick={() => onEventClick(event)}
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-sm font-medium text-slate-900 truncate flex-1">
            {event.title}
          </h4>
          <Badge
            variant="outline"
            className="text-xs"
            style={{ 
              borderColor: config.color,
              color: config.color 
            }}
          >
            {config.label}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Clock className="h-3 w-3" />
          <span>
            {format(new Date(event.start), 'HH:mm')} - {format(new Date(event.end), 'HH:mm')}
          </span>
        </div>

        {event.status === 'pending' && userPermissions.canApproveLeave && (
          <div className="flex gap-1 mt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-7 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onEventApprove(event.id);
              }}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-7 text-xs text-red-600 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                // Handle reject logic
              }}
            >
              <XCircle className="h-3 w-3 mr-1" />
              Reject
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
      {/* Event Type Filters */}
      <Card className="border-0 rounded-none shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Event Types
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onTypesChange([])}
            >
              <Filter className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {Object.entries(getEventConfig).map(([type, config]) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={selectedTypes.includes(type as EventType)}
                  onCheckedChange={() => handleTypeToggle(type as EventType)}
                />
                <label
                  htmlFor={type}
                  className="flex items-center space-x-2 text-sm font-medium text-slate-700 cursor-pointer flex-1"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <span>{config.label}</span>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          className={`flex-1 py-2 px-4 text-xs font-medium transition-colors ${
            activeSection === 'filters' 
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setActiveSection('filters')}
        >
          Filters
        </button>
        <button
          className={`flex-1 py-2 px-4 text-xs font-medium transition-colors ${
            activeSection === 'pending' 
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setActiveSection('pending')}
        >
          Pending
          {pendingEvents.length > 0 && (
            <Badge variant="destructive" className="ml-2 h-4 w-4 p-0 text-xs">
              {pendingEvents.length}
            </Badge>
          )}
        </button>
        <button
          className={`flex-1 py-2 px-4 text-xs font-medium transition-colors ${
            activeSection === 'today' 
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setActiveSection('today')}
        >
          Today
        </button>
      </div>

      {/* Content Area */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {activeSection === 'filters' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-slate-900 mb-3">
                  Quick Stats
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium">Total Events</p>
                    <p className="text-lg font-bold text-blue-900">{events.length}</p>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <p className="text-xs text-emerald-600 font-medium">This Week</p>
                    <p className="text-lg font-bold text-emerald-900">
                      {events.filter(e => isThisWeek(new Date(e.start))).length}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-900 mb-3">
                  Event Status
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-slate-700">Approved</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      {events.filter(e => e.status === 'approved').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <span className="text-sm text-slate-700">Pending</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      {events.filter(e => e.status === 'pending').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-slate-700">Rejected</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      {events.filter(e => e.status === 'rejected').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'pending' && (
            <div className="space-y-3">
              {pendingEvents.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No pending requests</p>
                </div>
              ) : (
                pendingEvents.map(event => (
                  <EventItem key={event.id} event={event} />
                ))
              )}
            </div>
          )}

          {activeSection === 'today' && (
            <div className="space-y-3">
              {todayEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No events today</p>
                </div>
              ) : (
                todayEvents.map(event => (
                  <EventItem key={event.id} event={event} />
                ))
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}