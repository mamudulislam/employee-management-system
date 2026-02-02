"use client"

import React, { useState } from 'react'
import { CalendarWithTime } from '../components/ui/enhanced-calendar-with-time'
import { format } from 'date-fns'
import { Calendar, Clock, Users, MapPin, AlertCircle, CheckCircle } from 'lucide-react'

interface ScheduledEvent {
  id: string
  title: string
  date: Date
  startTime: string
  endTime: string
  description?: string
  attendees?: number
  location?: string
  type: 'meeting' | 'appointment' | 'reminder' | 'deadline'
}

export default function CalendarWithTimePage() {
  const [scheduledEvents, setScheduledEvents] = useState<ScheduledEvent[]>([
    {
      id: '1',
      title: 'Team Standup',
      date: new Date(),
      startTime: '09:00:00',
      endTime: '09:30:00',
      attendees: 8,
      location: 'Conference Room A',
      type: 'meeting'
    },
    {
      id: '2', 
      title: 'Client Call',
      date: new Date(),
      startTime: '14:00:00',
      endTime: '15:00:00',
      attendees: 3,
      type: 'appointment'
    }
  ])

  const [showSuccess, setShowSuccess] = useState(false)

  const handleScheduleEvent = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const getEventTypeColor = (type: string) => {
    switch(type) {
      case 'meeting': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'appointment': return 'bg-green-100 text-green-700 border-green-300'
      case 'reminder': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'deadline': return 'bg-red-100 text-red-700 border-red-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch(type) {
      case 'meeting': return Users
      case 'appointment': return Calendar
      case 'reminder': return Clock
      case 'deadline': return AlertCircle
      default: return Calendar
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Calendar with Time Selection
          </h1>
          <p className="text-gray-600">
            Schedule events with precise date and time control
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar Component */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                Schedule New Event
              </h2>
              <CalendarWithTime />
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-700 font-medium">Event scheduled successfully!</span>
              </div>
            )}
          </div>

          {/* Scheduled Events List */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-6 w-6 text-purple-600" />
                Scheduled Events
              </h2>
              
              <div className="space-y-3">
                {scheduledEvents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No events scheduled yet</p>
                    <p className="text-sm">Use the calendar to add your first event</p>
                  </div>
                ) : (
                  scheduledEvents.map(event => {
                    const Icon = getEventTypeIcon(event.type)
                    return (
                      <div 
                        key={event.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className="h-4 w-4" />
                              <h3 className="font-semibold text-gray-900">{event.title}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full border ${getEventTypeColor(event.type)}`}>
                                {event.type}
                              </span>
                            </div>
                            
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{format(event.date, 'MMMM d, yyyy')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{event.startTime.slice(0, 5)} - {event.endTime.slice(0, 5)}</span>
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                              {event.attendees && (
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  <span>{event.attendees} attendees</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Today's Events</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {scheduledEvents.filter(e => 
                        format(e.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                      ).length}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Events</p>
                    <p className="text-2xl font-bold text-purple-600">{scheduledEvents.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}