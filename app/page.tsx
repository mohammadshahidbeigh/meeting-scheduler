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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'instant' | 'scheduled'>('instant')
  const [meetingDetails, setMeetingDetails] = useState<MeetingDetails | null>(null)

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
      setMeetingDetails(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create meeting. Please try again.')
      console.error('Create meeting error:', err)
    } finally {
      setIsLoading(false)
    }
  }

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
      setMeetingDetails(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule meeting. Please try again.')
      console.error('Schedule meeting error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabChange = (tab: 'instant' | 'scheduled') => {
    // Only clear meeting details when switching to instant meeting tab
    if (tab === 'instant') {
      // Keep existing meeting details if they were from an instant meeting
      if (activeTab === 'scheduled') {
        setMeetingDetails(null)
      }
    } else {
      // Always clear meeting details when switching to scheduled tab
      setMeetingDetails(null)
    }
    
    setActiveTab(tab)
    setError('') // Always clear errors
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
    <div className="min-h-screen bg-[#f0f7ff]">
      {/* Top Navigation Bar */}
      <nav className="bg-[#eafffd] shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Meeting Scheduler</h1>
            </div>
            {session?.user && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {session.user.image && (
        <Image
                      src={session.user.image}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full ring-2 ring-gray-200"
                    />
                  )}
                  <span className="text-gray-900 font-medium">{session.user.name}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 border border-transparent rounded-md hover:border-red-600 hover:bg-red-100 transition cursor-pointer"
                >
                  Sign Out
                </button>

              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Meeting Type Selection */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="grid grid-cols-2 gap-px bg-gray-200">
            <button
              onClick={() => handleTabChange('instant')}
              className={`px-4 py-3 text-sm font-medium rounded-tl-xl ${
                activeTab === 'instant'
                  ? 'bg-white text-gray-900'
                  : 'bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              Start an Instant Meeting
            </button>
            <button
              onClick={() => handleTabChange('scheduled')}
              className={`px-4 py-3 text-sm font-medium rounded-tr-xl ${
                activeTab === 'scheduled'
                  ? 'bg-white text-gray-900'
                  : 'bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              Schedule a Meeting
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'instant' ? (
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
              </div>
            ) : (
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
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {meetingDetails && (
              <div className="mt-6 p-6 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h3 className="font-medium text-gray-900">Meeting Created Successfully</h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Starts</p>
                      <p className="font-medium text-gray-900">{new Date(meetingDetails.startTime).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Ends</p>
                      <p className="font-medium text-gray-900">{new Date(meetingDetails.endTime).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={meetingDetails.meetingLink}
                      readOnly
                      className="flex-1 px-4 py-2 text-sm text-gray-900 bg-gray-50 border rounded-lg"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(meetingDetails.meetingLink)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg
                               transition-colors cursor-pointer"
                      title="Copy link"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                    <a
                      href={meetingDetails.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white 
                               rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Join Meeting
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
