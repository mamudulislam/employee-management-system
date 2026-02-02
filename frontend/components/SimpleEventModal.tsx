"use client"

import React, { useState } from 'react';
import { format } from 'date-fns';
import { X, Clock, MapPin, Users, Tag } from 'lucide-react';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface SimpleEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
  location?: string;
  type: 'work' | 'meeting' | 'leave' | 'holiday';
  color: string;
  description?: string;
}

interface SimpleEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: SimpleEvent;
  selectedDate?: Date;
  onSave: (event: Partial<SimpleEvent>) => void;
  onDelete?: (eventId: string) => void;
}

const eventTypes = [
  { value: 'work', label: 'Work', color: '#10b981' },
  { value: 'meeting', label: 'Meeting', color: '#3b82f6' },
  { value: 'leave', label: 'Leave', color: '#f59e0b' },
  { value: 'holiday', label: 'Holiday', color: '#8b5cf6' },
];

export function SimpleEventModal({
  isOpen,
  onClose,
  event,
  selectedDate,
  onSave,
  onDelete
}: SimpleEventModalProps) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    date: event?.date || selectedDate || new Date(),
    time: event?.time || '',
    location: event?.location || '',
    type: event?.type || 'work',
    description: event?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eventType = eventTypes.find(t => t.value === formData.type);
    onSave({
      ...formData,
      color: eventType?.color || '#10b981',
      id: event?.id || Date.now().toString(),
    });
    onClose();
  };

  const handleDelete = () => {
    if (event?.id && onDelete) {
      onDelete(event.id);
      onClose();
    }
  };

  const eventType = eventTypes.find(t => t.value === formData.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: eventType?.color }}
            />
            {event ? 'Edit Event' : 'New Event'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Title</label>
            <Input
              placeholder="Event title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <Input
                type="date"
                value={format(formData.date, 'yyyy-MM-dd')}
                onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Time</label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Type</label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: type.color }}
                      />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Location</label>
            <Input
              placeholder="Event location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              placeholder="Event description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            {event && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="flex-1"
              >
                Delete
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {event ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}