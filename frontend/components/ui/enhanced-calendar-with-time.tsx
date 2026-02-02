"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Clock2Icon, Calendar as CalendarIcon } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { format, addMonths, subMonths, isToday } from "date-fns"

import { cn } from "../../lib/utils"
import { buttonVariants } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "./card"
import { Field, FieldGroup, FieldLabel } from "./field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today:
          "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export function CalendarWithTime() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 12)
  )
  const [startTime, setStartTime] = React.useState("10:30:00")
  const [endTime, setEndTime] = React.useState("12:30:00")

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
  }

  const handleTimeChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartTime(value)
    } else {
      setEndTime(value)
    }
  }

  const isTimeValid = () => {
    if (!startTime || !endTime) return false
    return startTime < endTime
  }

  const getDateTimeDisplay = () => {
    if (!date) return "No date selected"
    return `${format(date, 'MMMM d, yyyy')} from ${startTime.slice(0, 5)} to ${endTime.slice(0, 5)}`
  }

  return (
    <Card className="w-fit mx-auto shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white pb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Schedule Event</h3>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          className="p-3 rounded-t-lg"
          modifiers={{
            today: isToday
          }}
          modifiersStyles={{
            today: {
              backgroundColor: '#3b82f6',
              color: 'white',
              fontWeight: 'bold'
            }
          }}
        />
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t p-4">
        <FieldGroup className="w-full space-y-4">
          <Field>
            <FieldLabel htmlFor="time-from" className="text-sm font-medium text-gray-700">
              Start Time
            </FieldLabel>
            <InputGroup className="shadow-sm">
              <InputGroupInput
                id="time-from"
                type="time"
                step="1"
                value={startTime}
                onChange={(e) => handleTimeChange('start', e.target.value)}
                className={cn(
                  "appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
                  !isTimeValid() && "border-red-300 focus:border-red-500"
                )}
              />
              <InputGroupAddon>
                <Clock2Icon className={cn(
                  "text-muted-foreground",
                  !isTimeValid() && "text-red-500"
                )} />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          
          <Field>
            <FieldLabel htmlFor="time-to" className="text-sm font-medium text-gray-700">
              End Time
            </FieldLabel>
            <InputGroup className="shadow-sm">
              <InputGroupInput
                id="time-to"
                type="time"
                step="1"
                value={endTime}
                onChange={(e) => handleTimeChange('end', e.target.value)}
                className={cn(
                  "appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
                  !isTimeValid() && "border-red-300 focus:border-red-500"
                )}
              />
              <InputGroupAddon>
                <Clock2Icon className={cn(
                  "text-muted-foreground",
                  !isTimeValid() && "text-red-500"
                )} />
              </InputGroupAddon>
            </InputGroup>
          </Field>

          {date && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Selected:</strong> {getDateTimeDisplay()}
              </p>
              {!isTimeValid() && (
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ End time must be after start time
                </p>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button 
              className={cn(
                "flex-1 px-4 py-2 rounded-lg font-medium transition-colors",
                date && isTimeValid()
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
              disabled={!date || !isTimeValid()}
            >
              Schedule Event
            </button>
            <button 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              onClick={() => {
                setDate(undefined)
                setStartTime("10:30:00")
                setEndTime("12:30:00")
              }}
            >
              Clear
            </button>
          </div>
        </FieldGroup>
      </CardFooter>
    </Card>
  )
}

export { Calendar, CalendarWithTime }