import { CalendarEvent } from './entities/calendar-event';
import { v4 as uuidv4 } from 'uuid';

const MAXIMUM_EVENTS = 5000;

export default class GetUserEventsUseCase {
  private createMockEvents (startEvent = 0, numberOfEvents: number): CalendarEvent[] {
    let eventsToCreate = numberOfEvents;
    if (startEvent + numberOfEvents > MAXIMUM_EVENTS) { // Calculate amount of events to return
      eventsToCreate = numberOfEvents - (startEvent + numberOfEvents - MAXIMUM_EVENTS);
    }
    const date = new Date('2022-09-19'); // Constant mock date otherwise all events would be updated every hour
    return [...Array(eventsToCreate)].map(() => {
      const currentEvent = startEvent++;
      return {
        id: uuidv4(), // Events are unique by ID
        title: `Super Mocked Interview ${currentEvent}`,
        url: `wwww.super.mocked.zoom.us/interview${currentEvent}1`,
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
