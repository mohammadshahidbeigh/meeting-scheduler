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
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Schedule a Meeting</h2>
        <p className="mt-0.5 text-xs text-gray-500">
          Plan a meeting for a future date and time
        </p>
      </div>
      <form onSubmit={scheduleMeeting} className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="title" className="block text-xs font-medium text-gray-500 mb-0.5">
            Meeting Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            placeholder="Team Sync"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-sm
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     placeholder:text-gray-400"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label htmlFor="date" className="block text-xs font-medium text-gray-500 mb-0.5">
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
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-sm
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       cursor-pointer"
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-xs font-medium text-gray-500 mb-0.5">
              Time
            </label>
            <select
              id="time"
              name="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-sm
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       cursor-pointer appearance-none bg-white
                       bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M10%203a1%201%200%2001.707.293l3%203a1%201%200%2001-1.414%201.414L10%205.414%207.707%207.707a1%201%200%2001-1.414-1.414l3-3A1%201%200%200110%203zm-3.707%209.293a1%201%200%20011.414%200L10%2014.586l2.293-2.293a1%201%200%20011.414%201.414l-3%203a1%201%200%2001-1.414%200l-3-3a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')]
                       bg-no-repeat bg-[right_0.75rem_center] bg-[length:0.875rem_0.875rem]"
            >
              <option value="" disabled>Select a time</option>
              {timeSlots.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !selectedTime}
          className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 
          disabled:bg-blue-300 transition-all duration-200
          flex items-center justify-center gap-1.5 font-medium text-sm
          shadow-sm hover:shadow disabled:shadow-none
          transform hover:scale-105 disabled:scale-100
          cursor-pointer disabled:cursor-not-allowed
          mt-4 sm:mt-6"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
              Scheduling...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule Meeting
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-3 p-3 bg-red-50 rounded-lg">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}
