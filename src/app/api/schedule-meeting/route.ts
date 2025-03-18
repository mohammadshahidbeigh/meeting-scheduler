import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { createGoogleMeet } from '@/utils/googleCalendar'

export async function POST(request: Request) {
  const session = await auth()
  
  if (!session?.user?.accessToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { dateTime, duration = 30, title = "Scheduled Meeting" } = await request.json()
    
    if (!dateTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const meeting = await createGoogleMeet(session.user.accessToken, {
      startTime: new Date(dateTime),
      summary: title,
      description: "Scheduled via Meeting Scheduler"
    })
    
    return NextResponse.json(meeting)
  } catch (error) {
    console.error('Failed to schedule meeting:', error)
    return NextResponse.json(
      { error: 'Failed to schedule meeting' },
      { status: 500 }
    )
  }
} 