interface MeetingConfig {
  summary?: string;
  description?: string;
  startTime?: Date;
}

export async function createGoogleMeet(accessToken: string, config: MeetingConfig = {}) {
  const {
    summary = "Instant Meeting",
    description = "Meeting created via Meeting Scheduler",
    startTime = new Date(),
  } = config;

  // Set end time to 1 hour after start time
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

  const event = {
    summary,
    description,
    start: {
      dateTime: startTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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