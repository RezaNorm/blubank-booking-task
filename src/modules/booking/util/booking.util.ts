export interface BookingRange {
  start: Date;
  end: Date;
}

export function isBookingOverlap(a: BookingRange, b: BookingRange): boolean {
  return a.start < b.end && a.end > b.start;
}

export function getAvailableDates(
  bookings: BookingRange[],
  from: Date,
  to: Date
): string[] {
  const availableDates: string[] = [];
  const currentDate = new Date(from);

  while (currentDate <= to) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const isBooked = bookings.some(b =>
      currentDate >= b.start && currentDate <= b.end
    );
    if (!isBooked) {
      availableDates.push(dateStr);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return availableDates;
}

export function getReservedDateRanges(bookings: BookingRange[]): { start: string; end: string }[] {
  return bookings.map(b => ({
    start: b.start.toISOString().split('T')[0],
    end: b.end.toISOString().split('T')[0],
  }));
}