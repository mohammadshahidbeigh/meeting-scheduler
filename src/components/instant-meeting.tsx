'use client'

import { useState } from 'react'

interface MeetingDetails {
  meetingLink: string;
  meetingId: string;
  startTime: string;
  endTime: string;
}

interface InstantMeetingProps {
  onMeetingCreated: (details: MeetingDetails) => void;
}

export default function InstantMeeting({ onMeetingCreated }: InstantMeetingProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const createInstantMeeting = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch('/api/instant-meeting', {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create meeting')
      }

      const data = await response.json()
      onMeetingCreated(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create meeting. Please try again.')
      console.error('Create meeting error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="text-center max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Start an Instant Meeting</h2>
        <p className="mt-1 text-sm text-gray-500">
          Create a meeting that starts right now
        </p>
      </div>
      <button
        onClick={createInstantMeeting}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 
                 disabled:bg-blue-300 transition-colors
                 flex items-center justify-center gap-2 font-medium cursor-pointer"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
            Creating meeting...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Start Meeting Now
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}
