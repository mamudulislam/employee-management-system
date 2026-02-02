"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { OptimizedCalendar, OptimizedCalendarEvent } from '../components/ui/optimized-calendar'
import { format, addDays, addWeeks } from 'date-fns'
import { Plus, Calendar, Filter, Search, Bell } from 'lucide-react'

// Demo data
const sampleEvents: OptimizedCalendarEvent[] = [
  {
    id: '1',
    title: 'Team Standup',
    date: new Date(),
    time: '09:00 AM',
    location: 'Conference Room A',
    type: 'meeting',
    color: '#3b82f6',
    attendees: 8,
    priority: 'medium'
  },
  {
    id: '2',
    title: 'Project Deadline',
    date: addDays(new Date(), 3),
    time: '11:59 PM',
    type: 'deadline',
    color: '#ef4444',
    priority: 'high'
  },
  {
    id: '3',
    title: 'Annual Holiday',
    date: addDays(new Date(), 7),
    type: 'holiday',
    color: '#10b981',
    priority: 'low'
  },
  {
    id: '4',
    title: 'React Workshop',
    date: addDays(new Date(), 5),
    time: '02:00 PM',
    location: 'Training Room',
    type: 'training',
    color: '#f97316',
    attendees: 15,
    priority: 'medium'
  },
  {
    id: '5',
    title: 'Team Building',
    date: addWeeks(new Date(), 1),
    time: '10:00 AM',
    location: 'Outdoor Venue',
    type: 'meeting',
    color: '#3b82f6',
    attendees: 25,
    priority: 'low'
  },
  {
    id: '6',
    title: 'Medical Leave',
    date: addDays(new Date(), 2),
    type: 'leave',
    color: '#8b5cf6',
    priority: 'medium'
  },
  {
    id: '7',
    title: 'Quarterly Review',
    date: addDays(new Date(), 10),
    time: '03:00 PM',
    type: 'meeting',
    color: '#3b82f6',
    attendees: 5,
    priority: 'high'
  },
  {
    id: '8',
    title: 'Birthday Reminder',
    date: addDays(new Date(), 1),
    type: 'reminder',
    color: '#eab308',
    priority: 'low'
  }
]

export default function OptimizedCalendarPage() {
  const [events, setEvents] = useState<OptimizedCalendarEvent[]>(sampleEvents)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Apply filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterType === 'all' || event.type === filterType
      return matchesSearch && matchesFilter
    })
  }, [events, searchTerm, filterType])

  const handleEventClick = (event: OptimizedCalendarEvent) => {
    alert(`Event clicked: ${event.title}`)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const handleAddEvent = () => {
    const newEvent: OptimizedCalendarEvent = {
      id: Date.now().toString(),
      title: 'New Event',
      date: selectedDate || new Date(),
      time: '12:00 PM',
      type: 'meeting',
      color: '#3b82f6',
      priority: 'medium'
    }
    setEvents(prev => [...prev, newEvent])
  }

  // Stats calculations
  const stats = useMemo(() => ({
    total: filteredEvents.length,
    meetings: filteredEvents.filter(e => e.type === 'meeting').length,
    deadlines: filteredEvents.filter(e => e.type === 'deadline').length,
    holidays: filteredEvents.filter(e => e.type === 'holiday').length,
    thisWeek: filteredEvents.filter(e => {
      const now = new Date()
      const weekEnd = addDays(now, 7)
      return e.date >= now && e.date <= weekEnd
    }).length
  }), [filteredEvents])

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Optimized Calendar
              </h1>
              <p className="text-gray-600 mt-2">Modern, responsive, and feature-rich calendar design</p>
            </div>
            
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                {isDarkMode ? '🌙' : '☀️'}
              </button>
              <button className="relative p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={handleAddEvent}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">Add Event</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-gray-600" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              >
                <option value="all">All Events</option>
                <option value="meeting">Meetings</option>
                <option value="deadline">Deadlines</option>
                <option value="holiday">Holidays</option>
                <option value="leave">Leave</option>
                <option value="training">Training</option>
                <option value="reminder">Reminders</option>
              </select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <Calendar className="h-8 w-8 text-indigo-600" />
                <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Total Events</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
                </div>
                <span className="text-2xl font-bold text-blue-600">{stats.meetings}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Meetings</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                </div>
                <span className="text-2xl font-bold text-red-600">{stats.deadlines}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Deadlines</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-2xl font-bold text-green-600">{stats.holidays}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Holidays</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <div className="h-4 w-4 bg-purple-500 rounded-full"></div>
                </div>
                <span className="text-2xl font-bold text-purple-600">{stats.thisWeek}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">This Week</p>
            </div>
          </div>
        </div>

        {/* Main Calendar */}
        <OptimizedCalendar
          events={filteredEvents}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
          className="mb-8"
        />

        {/* Selected Date Info */}
        {selectedDate && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">
              Selected Date: {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <div className="flex gap-3">
              <button 
                onClick={handleAddEvent}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Event for This Date
              </button>
              <button 
                onClick={() => setSelectedDate(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}