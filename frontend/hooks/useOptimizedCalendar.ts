import { useMemo, useCallback } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns'

export interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: string
  [key: string]: any
}

export function useOptimizedCalendar(events: CalendarEvent[], currentDate: Date = new Date()) {
  // Memoize month calculation to avoid recalculating on every render
  const monthData = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
    
    return { monthStart, monthEnd, monthDays }
  }, [currentDate])

  // Group events by date for efficient lookup
  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, CalendarEvent[]>()
    
    events.forEach(event => {
      const dateKey = format(event.date, 'yyyy-MM-dd')
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, [])
      }
      grouped.get(dateKey)!.push(event)
    })
    
    return grouped
  }, [events])

  // Get events for a specific date
  const getEventsForDate = useCallback((date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return eventsByDate.get(dateKey) || []
  }, [eventsByDate])

  // Check if date has events
  const hasEvents = useCallback((date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return eventsByDate.has(dateKey)
  }, [eventsByDate])

  // Get events count for a date
  const getEventsCount = useCallback((date: Date) => {
    return getEventsForDate(date).length
  }, [getEventsForDate])

  // Filter events by type
  const filterEventsByType = useCallback((type: string) => {
    return events.filter(event => event.type === type)
  }, [events])

  // Search events
  const searchEvents = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return events.filter(event => 
      event.title.toLowerCase().includes(lowercaseQuery) ||
      (event.location && event.location.toLowerCase().includes(lowercaseQuery))
    )
  }, [events])

  // Get events in date range
  const getEventsInRange = useCallback((startDate: Date, endDate: Date) => {
    return events.filter(event => 
      event.date >= startDate && event.date <= endDate
    )
  }, [events])

  // Performance stats
  const stats = useMemo(() => ({
    totalEvents: events.length,
    eventsByType: events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    uniqueDates: eventsByDate.size
  }), [events, eventsByDate])

  return {
    monthData,
    eventsByDate,
    getEventsForDate,
    hasEvents,
    getEventsCount,
    filterEventsByType,
    searchEvents,
    getEventsInRange,
    stats
  }
}

export default useOptimizedCalendar