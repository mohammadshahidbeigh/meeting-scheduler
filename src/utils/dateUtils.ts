export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  
  // Get date components
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
  const year = d.getFullYear();
  
  // Get time components
  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  const displayHours = hours % 12 || 12; // Convert to 12-hour format
  
  return `${day}-${month}-${year} ${displayHours}:${minutes}${ampm}`;
}

export function parseDateTime(dateTimeString: string): Date {
  // Expected format: dd-mm-yyyy HH:mm
  const [datePart, timePart] = dateTimeString.split(' ');
  const [day, month, year] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);
  
  return new Date(year, month - 1, day, hours, minutes);
}

export function getNextTimeSlot(date: Date = new Date()): Date {
  const minutes = date.getMinutes();
  const remainder = minutes % 15;
  const minutesToAdd = remainder === 0 ? 15 : (15 - remainder);
  
  return new Date(date.getTime() + minutesToAdd * 60000);
}

export function generateTimeSlots(selectedDate: string): Array<{ value: string, label: string }> {
  const date = new Date(selectedDate);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  const slots: Array<{ value: string, label: string }> = [];
  const startHour = isToday ? now.getHours() : 0;
  const startMinute = isToday ? now.getMinutes() : 0;
  
  // Start from the beginning of the next 15-minute slot
  let currentTime = new Date(date);
  if (isToday) {
    currentTime = getNextTimeSlot(now);
  } else {
    currentTime.setHours(0, 0, 0, 0);
  }
  
  while (currentTime.getDate() === date.getDate()) {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    
    const timeString = `${displayHours}:${minutes.toString().padStart(2, '0')}${ampm}`;
    const minutesSuffix = minutes === 0 ? '0' : minutes;
    const label = `${timeString} (${minutesSuffix} mins)`;
    
    slots.push({
      value: currentTime.toISOString(),
      label
    });
    
    // Add 15 minutes
    currentTime = new Date(currentTime.getTime() + 15 * 60000);
  }
  
  return slots;
} 