"use client"

import React, { useState } from 'react';
import { FlexCalendar } from './FlexCalendar';

export default function FlexCalendarPage() {
  const [events, setEvents] = useState([
    { id: '1', title: 'Team Meeting', date: new Date() },
    { id: '2', title: 'Project Review', date: new Date(new Date().setDate(new Date().getDate() + 5)) },
    { id: '3', title: 'Holiday', date: new Date(new Date().setDate(new Date().getDate() + 10)) },
  ]);

  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date);
    // Add event creation logic here
  };

  const handleEventClick = (event: any) => {
    console.log('Event clicked:', event);
    // Add event editing logic here
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Flexible Calendar</h1>
          <p className="text-slate-600">Simple grid layout calendar with Su, Mo, Tu, We, Th, Fr, Sa format</p>
        </div>

        <FlexCalendar
          events={events}
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
        />
      </div>
    </div>
  );
}