interface MeetingConfig {
  summary?: string;
  description?: string;
  startTime?: Date;
}

export async function createInstantMeet(accessToken: string) {
  try {
    // Create a temporary calendar event that starts now and ends in 1 hour
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: "Instant Meeting",
          description: "Instant meeting created via Meeting Scheduler",
          start: {
            dateTime: now.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: oneHourLater.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          conferenceData: {
            createRequest: {
              requestId: `meet-${Date.now()}`,
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
          visibility: "private",
          transparency: "transparent", // Makes the event show as 'free' in calendar
          reminders: {
            useDefault: false,
            overrides: [] // No reminders
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Calendar API Error:', errorData);
      throw new Error(`Failed to create meeting: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    // Delete the temporary calendar event immediately
    await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${data.id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    return {
      meetingLink: data.hangoutLink,
      meetingId: data.id,
      startTime: data.start.dateTime,
      endTime: data.end.dateTime,
    };
  } catch (error) {
    console.error('Error creating instant meeting:', error);
    throw error;
  }
}

export async function createGoogleMeet(accessToken: string, config: MeetingConfig = {}) {
  const {
    summary = "Scheduled Meeting",
    description = "Meeting created via Meeting Scheduler",
    startTime = new Date(),
  } = config;

  // Ensure startTime is a Date object
  const meetingStartTime = new Date(startTime);
  
  // Set end time to 1 hour after start time
  const endTime = new Date(meetingStartTime.getTime() + 60 * 60 * 1000);

  // Get user's timezone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const event = {
    summary,
    description,
    start: {
      dateTime: meetingStartTime.toISOString(),
      timeZone: userTimeZone,
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: userTimeZone,
    },
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  try {
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Calendar API Error:', errorData);
      throw new Error(`Failed to create meeting: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      meetingLink: data.hangoutLink,
      meetingId: data.id,
      startTime: data.start.dateTime,
      endTime: data.end.dateTime,
    };
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw error;
  }
} 