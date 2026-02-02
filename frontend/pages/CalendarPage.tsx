"use client"

import React, { useState } from 'react';
import { SimpleEvent } from './SimpleCalendar';
import { SimpleCalendar } from './SimpleCalendar';
import { SimpleEventModal } from './SimpleEventModal';

export default function CalendarPage() {
  const [events, setEvents] = useState<SimpleEvent[]>([
    {
      id: '1',
      title: 'Team Meeting',
      date: new Date(),
      time: '10:00 AM',
      location: 'Conference Room',
      type: 'meeting',
      color: '#3b82f6',
    },
    {
      id: '2',
      title: 'Project Deadline',
      date: new Date(new Date().setDate(new Date().getDate() + 3)),
      type: 'work',
      color: '#10b981',
    },
    {
      id: '3',
      title: 'Annual Holiday',
      date: new Date(new Date().setDate(new Date().getDate() + 10)),
      type: 'holiday',
      color: '#8b5cf6',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SimpleEvent | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const handleEventClick = (event: SimpleEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDateClick = (date: Date) => {
    setSelectedEvent(undefined);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (eventData: Partial<SimpleEvent>) => {
    if (selectedEvent) {
      // Update existing event
      setEvents(prev => prev.map(e => 
        e.id === selectedEvent.id ? { ...e, ...eventData } : e
      ));
    } else {
      // Create new event
      const newEvent: SimpleEvent = {
        id: Date.now().toString(),
        ...eventData as SimpleEvent,
      };
      setEvents(prev => [...prev, newEvent]);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Calendar</h1>
          <p className="text-slate-600">Manage your schedule and events</p>
        </div>

        <SimpleCalendar
          events={events}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
        />

        <SimpleEventModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(undefined);
            setSelectedDate(undefined);
          }}
          event={selectedEvent}
          selectedDate={selectedDate}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      </div>
    </div>
  );
}