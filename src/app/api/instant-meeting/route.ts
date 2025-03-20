import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { createInstantMeet } from '@/utils/googleCalendar'
import { Session } from 'next-auth'

export async function POST() {
  const session = await auth() as Session | null
  
  if (!session?.user?.accessToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const meeting = await createInstantMeet(session.user.accessToken)
    
    return NextResponse.json({
      meetingLink: meeting.meetingLink,
      meetingId: meeting.meetingId,
      startTime: meeting.startTime,
      endTime: meeting.endTime,
    })
  } catch (error) {
    console.error('Failed to create meeting:', error)
    return NextResponse.json(
      { error: 'Failed to create meeting' },
      { status: 500 }
    )
  }
} 