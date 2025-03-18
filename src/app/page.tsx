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
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f0f7ff]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#f0f7ff]">
        <div className="text-center space-y-6 p-8 bg-white rounded-2xl shadow-lg max-w-md w-full mx-4">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Meeting Scheduler</h1>
          <p className="text-gray-600">Schedule and join meetings with ease</p>
          <Link
            href="/login"
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 
                     transition-colors font-medium text-center shadow-sm hover:shadow-md"
          >
            Sign In to Continue
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0f7ff]">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight px-4 py-2 ml-8">
                Meeting Scheduler
              </h1>
            </div>
            {session?.user && (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  {session.user.image && (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="rounded-full ring-2 ring-gray-200"
                    />
                  )}
                  <span className="text-gray-900 font-medium">{session.user.name}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-red-600 hover:text-red-700 font-medium px-4 py-2 
                           border border-red-200 rounded-lg hover:bg-red-200 transition-all cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Meeting Type Selection */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-2 gap-px bg-gray-100">
            <button
              onClick={() => handleTabChange('instant')}
              className={`px-6 py-4 text-sm font-medium transition-all relative ${
                activeTab === 'instant'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="relative z-10">Start an Instant Meeting</span>
              {activeTab === 'instant' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => handleTabChange('scheduled')}
              className={`px-6 py-4 text-sm font-medium transition-all relative ${
                activeTab === 'scheduled'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="relative z-10">Schedule a Meeting</span>
              {activeTab === 'scheduled' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          </div>

          <div className="p-10">
            {activeTab === 'instant' ? (
              <InstantMeeting onMeetingCreated={setMeetingDetails} />
            ) : (
              <ScheduleMeeting onMeetingScheduled={setMeetingDetails} />
            )}

            {meetingDetails && (
              <div className="mt-8 p-8 bg-blue-50 rounded-2xl border border-blue-100 shadow-lg">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h3 className="font-semibold text-base text-gray-900">Meeting Created Successfully</h3>
                </div>
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                      <p className="text-gray-500 mb-2">Starts</p>
                      <p className="font-medium text-gray-900">{new Date(meetingDetails.startTime).toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                      <p className="text-gray-500 mb-2">Ends</p>
                      <p className="font-medium text-gray-900">{new Date(meetingDetails.endTime).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={meetingDetails.meetingLink}
                      readOnly
                      className="flex-1 px-4 py-3 text-sm text-gray-900 bg-white border border-gray-200 
                               rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               shadow-sm hover:shadow-md transition-all"
                    />
                    <button
                      onClick={handleCopyLink}
                      className={`p-3 rounded-xl transition-all ${
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
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white 
                               rounded-xl hover:bg-blue-700 transition-all font-medium text-sm
                               shadow-sm hover:shadow-md"
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