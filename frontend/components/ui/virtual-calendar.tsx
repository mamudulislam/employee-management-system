"use client"

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { format, addMonths, subMonths, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar, Grid, List, Month } from 'lucide-react'
import { cn } from '../../lib/utils'

interface VirtualCalendarEvent {
  id: string
  title: string
  date: Date
  type?: string
  color?: string
  [key: string]: any
}

type ViewMode = 'month' | 'week' | 'list'

interface VirtualCalendarProps {
  events?: VirtualCalendarEvent[]
  className?: string
  onEventClick?: (event: VirtualCalendarEvent) => void
  onDateClick?: (date: Date) => void
}

const ITEM_HEIGHT = 60
const BUFFER_SIZE = 5

export function VirtualCalendar({ events = [], className, onEventClick, onDateClick }: VirtualCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Virtual scrolling for list view
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 })

  // Memoize events grouped by date
  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, VirtualCalendarEvent[]>()
    events.forEach(event => {
      const dateKey = format(event.date, 'yyyy-MM-dd')
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, [])
      }
      grouped.get(dateKey)!.push(event)
    })
    return grouped
  }, [events])

  // Calculate visible items for virtual scrolling
  const visibleItems = useMemo(() => {
    if (viewMode !== 'list') return []
    
    const sortedDates = Array.from(eventsByDate.keys()).sort()
    const startIdx = Math.max(0, scrollPosition - BUFFER_SIZE)
    const endIdx = Math.min(sortedDates.length, scrollPosition + BUFFER_SIZE * 2)
    
    return sortedDates.slice(startIdx, endIdx).map((dateKey, index) => ({
      dateKey,
      date: new Date(dateKey),
      events: eventsByDate.get(dateKey) || [],
      index: startIdx + index
    }))
  }, [viewMode, scrollPosition, eventsByDate])

  // Handle scroll for virtualization
  const handleScroll = useCallback(() => {
    if (!containerRef.current || viewMode !== 'list') return
    
    const scrollTop = containerRef.current.scrollTop
    const startIndex = Math.floor(scrollTop / ITEM_HEIGHT)
    setScrollPosition(startIndex)
  }, [viewMode])

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setCurrentDate(prev => {
      if (viewMode === 'month') return subMonths(prev, 1)
      return new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000) // Subtract 1 week
    })
  }, [viewMode])

  const handleNext = useCallback(() => {
    setCurrentDate(prev => {
      if (viewMode === 'month') return addMonths(prev, 1)
      return new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000) // Add 1 week
    })
  }, [viewMode])

  // Get dates for current view
  const viewDates = useMemo(() => {
    if (viewMode === 'month') {
      const start = startOfMonth(currentDate)
      const end = endOfMonth(currentDate)
      return eachDayOfInterval({ start, end })
    } else if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 })
      const end = endOfWeek(currentDate, { weekStartsOn: 0 })
      return eachDayOfInterval({ start, end })
    }
    return []
  }, [currentDate, viewMode])

  // Get events for a specific date
  const getEventsForDate = useCallback((date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return eventsByDate.get(dateKey) || []
  }, [eventsByDate])

  // Render list view with virtualization
  const renderListView = () => {
    const totalHeight = eventsByDate.size * ITEM_HEIGHT

    return (
      <div 
        ref={containerRef}
        className="h-96 overflow-auto border rounded-lg"
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleItems.map(({ dateKey, date, events, index }) => (
            <div
              key={dateKey}
              style={{
                position: 'absolute',
                top: index * ITEM_HEIGHT,
                height: ITEM_HEIGHT,
                width: '100%'
              }}
              className="border-b border-gray-200 bg-white hover:bg-gray-50 p-3 cursor-pointer"
              onClick={() => onDateClick?.(date)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">
                    {format(date, 'MMMM d, yyyy')}
                    {isToday(date) && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Today</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {events.length} {events.length === 1 ? 'event' : 'events'}
                  </div>
                </div>
                <div className="flex gap-2">
                  {events.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick?.(event)
                      }}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 cursor-pointer"
                    >
                      {event.title}
                    </div>
                  ))}
                  {events.length > 3 && (
                    <div className="text-xs text-gray-500 self-center">
                      +{events.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render grid view (month/week)
  const renderGridView = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    return (
      <div className="border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {weekDays.map(day => (
            <div key={day} className="p-3 text-center text-sm font-semibold text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7">
          {viewDates.map((date, index) => {
            const dayEvents = getEventsForDate(date)
            const isCurrentMonth = isSameMonth(date, currentDate)
            
            return (
              <div
                key={index}
                onClick={() => onDateClick?.(date)}
                className={cn(
                  "min-h-[80px] p-2 border-r border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors",
                  !isCurrentMonth && "bg-gray-50 text-gray-400",
                  isToday(date) && "bg-blue-50"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={cn(
                    "text-sm font-medium",
                    isToday(date) && "text-blue-600 font-bold"
                  )}>
                    {format(date, 'd')}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-1 rounded">
                      {dayEvents.length}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick?.(event)
                      }}
                      className="text-xs p-1 bg-blue-100 text-blue-700 rounded truncate hover:bg-blue-200 cursor-pointer"
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrev}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <h2 className="text-xl font-semibold">
            {format(currentDate, viewMode === 'month' ? 'MMMM yyyy' : 'MMM d, yyyy')}
          </h2>
          
          <button
            onClick={handleNext}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('month')}
            className={cn(
              "p-2 rounded-lg transition-colors",
              viewMode === 'month' ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
            )}
          >
            <Calendar className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={cn(
              "p-2 rounded-lg transition-colors",
              viewMode === 'week' ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
            )}
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              "p-2 rounded-lg transition-colors",
              viewMode === 'list' ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
            )}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'list' ? renderListView() : renderGridView()}

      {/* Performance Stats */}
      <div className="mt-4 text-sm text-gray-600">
        Total Events: {events.length} | 
        Rendering: {viewMode === 'list' ? `${visibleItems.length} of ${eventsByDate.size} dates` : `${viewDates.length} days`}
      </div>
    </div>
  )
}