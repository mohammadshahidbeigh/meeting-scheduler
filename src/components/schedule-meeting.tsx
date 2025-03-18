'use client'

import { useState } from 'react'

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

  const scheduleMeeting = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const dateTime = formData.get('dateTime') as string
    const title = formData.get('title') as string

    if (!dateTime || !title) {
      setError('Please fill in all required fields')
      return
    }

    // Validate that the selected time is in the future
    const selectedDate = new Date(dateTime)
    if (selectedDate <= new Date()) {
      setError('Please select a future date and time')
      return
    }

    try {
      setIsLoading(true)
      setError('')

      const response = await fetch('/api/schedule-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateTime, title }),
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

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Schedule a Meeting</h2>
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
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-900 text-gray-900
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="dateTime" className="block text-sm font-medium text-gray-500">
            Date and Time
          </label>
          <input
            type="datetime-local"
            name="dateTime"
            id="dateTime"
            required
            min={new Date().toISOString().slice(0, 16)}
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 
                   disabled:bg-blue-300 transition-colors
                   flex items-center justify-center gap-2 font-medium cursor-pointer"
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
