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
    const { dateTime, title = "Scheduled Meeting" } = await request.json()
    
    if (!dateTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Parse the date string and create a new Date object
    const startTime = new Date(dateTime)
    
    // Validate the date
    if (isNaN(startTime.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    // Ensure the meeting is scheduled in the future
    if (startTime <= new Date()) {
      return NextResponse.json(
        { error: 'Meeting must be scheduled in the future' },
        { status: 400 }
      )
    }

    const meeting = await createGoogleMeet(session.user.accessToken, {
      startTime,
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