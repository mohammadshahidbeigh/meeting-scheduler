'use client'

import { useState, useEffect } from 'react'
import { generateTimeSlots } from '@/utils/dateUtils'

interface MeetingDetails {
  meetingLink: string;
  meetingId: string;
  startTime: string;
  endTime: string;
}

interface ScheduleMeetingProps {
  onMeetingScheduled: (details: MeetingDetails) => void;
}

export default function ScheduleMeeting({ onMeetingScheduled }: ScheduleMeetingProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [timeSlots, setTimeSlots] = useState<Array<{ value: string, label: string }>>([])
  const [selectedTime, setSelectedTime] = useState<string>('')

  useEffect(() => {
    if (selectedDate) {
      const slots = generateTimeSlots(selectedDate);
      setTimeSlots(slots);
      // Auto-select the first available time slot
      if (slots.length > 0 && !selectedTime) {
        setSelectedTime(slots[0].value);
      }
    }
  }, [selectedDate]);

  const scheduleMeeting = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const title = formData.get('title') as string

    if (!selectedTime || !title) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setIsLoading(true)
      setError('')

      const response = await fetch('/api/schedule-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          dateTime: selectedTime,
          title 
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to schedule meeting')
      }

      const data = await response.json()
      onMeetingScheduled(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule meeting. Please try again.')
      console.error('Schedule meeting error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Get current date in YYYY-MM-DD format for the date input min attribute
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Schedule a Meeting</h2>
        <p className="mt-1 text-sm text-gray-500">
          Plan a meeting for a future date and time
        </p>
      </div>
      <form onSubmit={scheduleMeeting} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-500">
            Meeting Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            placeholder="Team Sync"
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-500">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            min={today}
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime('');
            }}
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-500">
            Time Slot
          </label>
          <select
            id="time"
            name="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a time</option>
            {timeSlots.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading || !selectedTime}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
          disabled:bg-blue-300 transition-all duration-200
          flex items-center justify-center gap-2 font-medium text-sm
          shadow-sm hover:shadow disabled:shadow-none
          transform hover:scale-105 disabled:scale-100
          cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
              Scheduling...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule Meeting
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}
