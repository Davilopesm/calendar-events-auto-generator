import { CalendarEvent } from './entities/calendar-event';
const MAXIMUM_EVENTS = 5000;

export default class GetUserEventsUseCase {
  private createMockEvents (startEvent = 0, numberOfEvents: number): CalendarEvent[] {
    return [...Array(numberOfEvents)].map(() => {
      const currentEvent = startEvent++;
      const date = new Date();
      return {
        id: currentEvent,
        title: `Super Mocked Interview ${currentEvent}`,
        url: `wwww.super.mocked.zoom.us/interview${currentEvent}`,
        start: date.toISOString(),
        end: new Date(date.getTime() + 30 * 60000).toISOString()
      };
    });
  }

  execute (start: number, limit: number): CalendarEvent[] {
    if (start >= MAXIMUM_EVENTS) {
      return [];
    }

    return this.createMockEvents(start, limit);
  }
}
