"use client"

import React, { useState, useMemo, useCallback } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isWeekend, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Users, Plus } from 'lucide-react'
import { cn } from '../../lib/utils'

interface OptimizedCalendarEvent {
  id: string
  title: string
  date: Date
  time?: string
  location?: string
  type: 'meeting' | 'holiday' | 'deadline' | 'leave' | 'training' | 'reminder'
  color: string
  attendees?: number
  priority?: 'low' | 'medium' | 'high'
}

interface OptimizedCalendarProps {
  events?: OptimizedCalendarEvent[]
  className?: string
  onEventClick?: (event: OptimizedCalendarEvent) => void
  onDateClick?: (date: Date) => void
  initialMonth?: Date
}

const eventTypeColors = {
  meeting: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700', dot: 'bg-blue-500' },
  holiday: { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700', dot: 'bg-green-500' },
  deadline: { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-700', dot: 'bg-red-500' },
  leave: { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700', dot: 'bg-purple-500' },
  training: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700', dot: 'bg-orange-500' },
  reminder: { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-700', dot: 'bg-yellow-500' }
}

export function OptimizedCalendar({ 
  events = [], 
  className, 
  onEventClick, 
  onDateClick, 
  initialMonth = new Date() 
}: OptimizedCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(initialMonth)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = useMemo(() => eachDayOfInterval({ start: monthStart, end: monthEnd }), [monthStart, monthEnd])

  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, OptimizedCalendarEvent[]>()
    events.forEach(event => {
      const dateKey = format(event.date, 'yyyy-MM-dd')
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, [])
      }
      grouped.get(dateKey)!.push(event)
    })
    return grouped
  }, [events])

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(prev => subMonths(prev, 1))
  }, [])

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(prev => addMonths(prev, 1))
  }, [])

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date)
    onDateClick?.(date)
  }, [onDateClick])

  const getEventsForDate = useCallback((date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return eventsByDate.get(dateKey) || []
  }, [eventsByDate])

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className={cn("w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden", className)}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Optimized Calendar</h1>
              <p className="text-indigo-100 text-sm">Manage your schedule efficiently</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm">
            <Plus className="h-4 w-4" />
            <span className="font-medium">Add Event</span>
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <button 
            onClick={handlePrevMonth}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <h2 className="text-xl font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          
          <button 
            onClick={handleNextMonth}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {monthDays.map((date, index) => {
            const dayEvents = getEventsForDate(date)
            const isWeekendDay = isWeekend(date)
            const isTodayDate = isToday(date)
            const isSelected = selectedDate && isSameDay(date, selectedDate)

            return (
              <div
                key={index}
                onClick={() => handleDateClick(date)}
                className={cn(
                  "min-h-[100px] p-2 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md",
                  isWeekendDay && "bg-gray-50 border-gray-200",
                  !isWeekendDay && "bg-white border-gray-200 hover:border-indigo-300",
                  isTodayDate && "ring-2 ring-indigo-500 bg-indigo-50",
                  isSelected && "border-indigo-500 bg-indigo-50 shadow-md"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={cn(
                    "text-sm font-medium",
                    isTodayDate ? "text-indigo-600" : isWeekendDay ? "text-gray-500" : "text-gray-700"
                  )}>
                    {format(date, 'd')}
                  </span>
                  {isTodayDate && (
                    <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">Today</span>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => {
                    const colors = eventTypeColors[event.type]
                    return (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick?.(event)
                        }}
                        className={cn(
                          "text-xs px-2 py-1 rounded-md truncate cursor-pointer hover:opacity-80 transition-opacity",
                          colors.bg, colors.text, colors.border, "border"
                        )}
                      >
                        <div className="flex items-center gap-1">
                          <div className={cn("w-1.5 h-1.5 rounded-full", colors.dot)} />
                          <span className="truncate">{event.title}</span>
                        </div>
                        {event.time && (
                          <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
                            <Clock className="h-3 w-3" />
                            <span>{event.time}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="bg-gray-50 border-t border-gray-200 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{events.length}</div>
            <div className="text-sm text-gray-600">Total Events</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {events.filter(e => e.type === 'meeting').length}
            </div>
            <div className="text-sm text-gray-600">Meetings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {events.filter(e => e.type === 'holiday').length}
            </div>
            <div className="text-sm text-gray-600">Holidays</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {events.filter(e => e.type === 'deadline').length}
            </div>
            <div className="text-sm text-gray-600">Deadlines</div>
          </div>
        </div>
      </div>
    </div>
  )
}