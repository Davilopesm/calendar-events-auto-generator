interface CalendarEvent {
  id: number
  title: string
  url: string
  start: string
  end: string
}

export class GetUserEventsUseCase {
  constructor () {}

  private createMockEvents (startEvent: number, numberOfEvents = 50): CalendarEvent[] {
    return [...Array(numberOfEvents)].map( item => {
      const currentEvent = startEvent++;
      const date = new Date();
      return {
        id: currentEvent,
        title: "Super Mocked Interview",
        url: `wwww.super.mocked.zoom.us/interview${currentEvent}`,
        start: date.toISOString(),
        end: new Date(date.getMinutes() + 30).toISOString(),
      } as CalendarEvent;
    });

  }

  execute (limit: number, start: number): CalendarEvent[] {
    return this.createMockEvents(start, limit);
  }
}
