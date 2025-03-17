'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface MeetingDetails {
  meetingLink: string;
  meetingId: string;
  startTime: string;
  endTime: string;
}

export default function Home() {
  const { data: session, status } = useSession()
  const [meetingDetails, setMeetingDetails] = useState<MeetingDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const createInstantMeeting = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const response = await fetch('/api/instant-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to create meeting')
      }

      const data = await response.json()
      setMeetingDetails(data)
    } catch (err) {
      setError('Failed to create meeting. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Meeting Scheduler</h1>
        <Link 
          href="/login"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Sign In to Continue
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <span className="font-medium">Welcome, {session.user?.name}</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Instant Meeting</h2>
          
          <button
            onClick={createInstantMeeting}
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Creating meeting...
              </>
            ) : (
              'Start Instant Meeting'
            )}
          </button>

          {error && (
            <p className="mt-2 text-red-500 text-sm">{error}</p>
          )}

          {meetingDetails && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Meeting Details</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Start: {new Date(meetingDetails.startTime).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  End: {new Date(meetingDetails.endTime).toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={meetingDetails.meetingLink}
                    readOnly
                    className="flex-1 p-2 border rounded bg-white text-sm"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(meetingDetails.meetingLink)}
                    className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    title="Copy link"
                  >
                    📋
                  </button>
                  <a
                    href={meetingDetails.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Join
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
