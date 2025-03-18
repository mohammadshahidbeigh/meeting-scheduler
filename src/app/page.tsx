'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import InstantMeeting from '@/components/instant-meeting'
import ScheduleMeeting from '@/components/schedule-meeting'

interface MeetingDetails {
  meetingLink: string;
  meetingId: string;
  startTime: string;
  endTime: string;
}

export default function Home() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<'instant' | 'scheduled'>('instant')
  const [meetingDetails, setMeetingDetails] = useState<MeetingDetails | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  const handleTabChange = (tab: 'instant' | 'scheduled') => {
    if (tab === 'instant' && activeTab === 'scheduled') {
      setMeetingDetails(null)
    } else if (tab === 'scheduled') {
      setMeetingDetails(null)
    }
    setActiveTab(tab)
  }

  const handleCopyLink = async () => {
    if (meetingDetails?.meetingLink) {
      await navigator.clipboard.writeText(meetingDetails.meetingLink)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
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
              <InstantMeeting onMeetingCreated={setMeetingDetails} />
            ) : (
              <ScheduleMeeting onMeetingScheduled={setMeetingDetails} />
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
                      onClick={handleCopyLink}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        isCopied 
                          ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      title={isCopied ? "Copied!" : "Copy link"}
                    >
                      {isCopied ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      )}
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