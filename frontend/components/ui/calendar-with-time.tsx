"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Clock, CalendarDays, Zap, ShieldCheck, Sun, Moon, Coffee, Home, Users } from "lucide-react"

export function CalendarWithTime({ modifiers, modifiersStyles }: { modifiers?: any, modifiersStyles?: any }) {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [viewMode, setViewMode] = React.useState<'month' | 'week'>('month')
    const [selectedTimeZone, setSelectedTimeZone] = React.useState('UTC')

    return (
        <div className="relative p-[3px] rounded-[3.5rem] bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 shadow-2xl">
            <Card className="w-full border-none bg-white/95 backdrop-blur-3xl overflow-hidden rounded-[3.3rem]">
                <CardContent className="p-0">
                    <div className="flex flex-col xl:flex-row">
                        {/* Main Interactive Grid */}
                        <div className="flex-1 p-10 lg:p-14">
                            {/* Enhanced Header */}
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3">Smart Calendar</h2>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg"></div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.3em]">Live Sync Active</p>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full border border-indigo-100">
                                            <Sun className="w-3 h-3 text-indigo-600" />
                                            <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider">Summer Hours</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[1.5rem] text-white shadow-2xl flex items-center gap-3 border border-slate-700">
                                        <CalendarDays className="w-6 h-6 text-indigo-400" />
                                        <div className="text-center">
                                            <span className="text-2xl font-black tracking-tighter block">{date ? date.getDate() : '??'}</span>
                                            <span className="text-[8px] uppercase tracking-wider text-slate-400">{date?.toLocaleDateString('en', { month: 'short' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex items-center justify-center mb-8 gap-2 bg-slate-50 rounded-2xl p-1 border border-slate-200">
                                {(['month', 'week'] as const).map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setViewMode(mode)}
                                        className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                                            viewMode === mode
                                                ? 'bg-white text-indigo-600 shadow-lg border border-indigo-100'
                                                : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        {mode} View
                                    </button>
                                ))}
                            </div>

                            {/* Enhanced Calendar */}
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                modifiers={modifiers}
                                modifiersStyles={modifiersStyles}
                                className="p-0 w-full"
                                classNames={{
                                    months: "w-full",
                                    month: "w-full",
                                    caption: "flex justify-between items-center mb-10 w-full px-2",
                                    caption_label: "text-3xl font-black text-slate-900 tracking-tighter",
                                    nav: "flex items-center gap-3",
                                    nav_button: "h-12 w-12 bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:scale-110 active:scale-90 transition-all shadow-md flex items-center justify-center text-slate-600",
                                    table: "w-full border-spacing-3 border-separate",
                                    head_row: "flex w-full mb-6 px-1",
                                    head_cell: "text-slate-400 font-black text-[11px] uppercase tracking-[0.25em] flex-1 text-center",
                                    row: "flex w-full justify-between gap-3 mb-3",
                                    cell: "relative h-16 sm:h-20 flex-1 p-0 flex items-center justify-center",
                                    day: "h-full w-full flex items-center justify-center rounded-[1.5rem] font-black text-2xl transition-all duration-300 bg-gradient-to-br from-slate-50 to-white text-slate-600 border border-slate-200/50 hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/15 hover:border-indigo-300 active:scale-95 relative overflow-hidden group",
                                    day_selected: "bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 focus:from-indigo-600 focus:to-purple-600 border-none shadow-[0_20px_40px_-15px_rgba(79,70,229,0.5)] scale-110 !opacity-100",
                                    day_today: "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-300 shadow-md",
                                    day_outside: "opacity-15 pointer-events-none scale-75 grayscale",
                                }}
                            />

                            {/* Quick Stats Row */}
                            <div className="grid grid-cols-3 gap-4 mt-8">
                                {[
                                    { icon: Coffee, label: "Breaks", value: "2", color: "from-amber-50 to-orange-50 border-amber-200 text-amber-700" },
                                    { icon: Users, label: "Meetings", value: "3", color: "from-blue-50 to-indigo-50 border-blue-200 text-blue-700" },
                                    { icon: Home, label: "Remote", value: "Yes", color: "from-green-50 to-emerald-50 border-green-200 text-green-700" },
                                ].map((stat, idx) => (
                                    <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 border shadow-sm hover:scale-105 transition-transform cursor-pointer`}>
                                        <stat.icon className="w-4 h-4 mb-2" />
                                        <p className="text-xs font-bold uppercase tracking-wider opacity-70">{stat.label}</p>
                                        <p className="text-lg font-black">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Enhanced Right Configuration Bar */}
                        <div className="xl:w-[440px] bg-gradient-to-b from-slate-50/50 to-white border-l border-slate-100/50 p-10 lg:p-14 flex flex-col justify-center">
                            <div className="w-full space-y-10">
                                {/* Enhanced Header */}
                                <div className="text-center">
                                    <div className="inline-flex p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl shadow-lg border border-indigo-100 mb-6">
                                        <Zap className="w-7 h-7 text-indigo-600 fill-indigo-100" />
                                    </div>
                                    <h4 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Smart Controls</h4>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">AI-Optimized Scheduling</p>
                                </div>

                                {/* Time Zone Selector */}
                                <div className="space-y-4">
                                    <FieldLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Time Zone</FieldLabel>
                                    <select 
                                        value={selectedTimeZone}
                                        onChange={(e) => setSelectedTimeZone(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 font-bold text-lg hover:border-indigo-300 focus:border-indigo-500 focus:ring-0 transition-colors cursor-pointer"
                                    >
                                        <option value="UTC">UTC</option>
                                        <option value="EST">Eastern Time</option>
                                        <option value="PST">Pacific Time</option>
                                        <option value="GMT">GMT</option>
                                    </select>
                                </div>

                                {/* Enhanced Time Inputs */}
                                <div className="space-y-8">
                                    <Field className="space-y-4">
                                        <FieldLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Morning Shift Start</FieldLabel>
                                        <InputGroup className="hover:scale-[1.02] transition-transform group">
                                            <InputGroupAddon className="left-6">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Sun className="h-5 w-5 text-amber-600" />
                                                </div>
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                type="time"
                                                defaultValue="09:00"
                                                className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-[2rem] h-24 pl-20 pr-10 text-3xl font-black tracking-tighter text-slate-900 shadow-lg hover:shadow-xl hover:border-amber-300 focus:ring-0 focus:border-amber-500 transition-all"
                                            />
                                        </InputGroup>
                                    </Field>

                                    <Field className="space-y-4">
                                        <FieldLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Evening Shift End</FieldLabel>
                                        <InputGroup className="hover:scale-[1.02] transition-transform group">
                                            <InputGroupAddon className="left-6">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Moon className="h-5 w-5 text-indigo-600" />
                                                </div>
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                type="time"
                                                defaultValue="18:00"
                                                className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-[2rem] h-24 pl-20 pr-10 text-3xl font-black tracking-tighter text-slate-900 shadow-lg hover:shadow-xl hover:border-indigo-300 focus:ring-0 focus:border-indigo-500 transition-all"
                                            />
                                        </InputGroup>
                                    </Field>
                                </div>

                                {/* Smart Actions */}
                                <div className="space-y-4">
                                    <button className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-[2rem] font-black text-sm tracking-[0.2em] uppercase shadow-2xl hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                                        <ShieldCheck className="w-5 h-5" />
                                        <span>AI Optimize Schedule</span>
                                    </button>
                                    
                                    <button className="w-full py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-[2rem] font-black text-xs tracking-[0.2em] uppercase hover:border-indigo-300 hover:text-indigo-600 transition-all active:scale-[0.98]">
                                        Export Calendar
                                    </button>
                                </div>

                                {/* Productivity Score */}
                                <div className="mt-6 p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Productivity Score</span>
                                        <span className="text-2xl font-black text-emerald-700">94%</span>
                                    </div>
                                    <div className="w-full bg-emerald-200 rounded-full h-2">
                                        <div className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full" style={{width: '94%'}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
