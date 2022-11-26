import UserEventRepository from '../../../infrastructure/database/repository/user-event-repository';
import httpClient from '../../../infrastructure/http-client';
import { CalendarEvent } from './entities/calendar-event';

export default class UpsertUserEventsUseCase {
  constructor (
    private readonly userEventRepository = new UserEventRepository()
  ) { }

  private readonly baseUrl = 'http://localhost:3000/api/v1/users';

  private async getUserDatabaseEvents (userId: number): Promise<CalendarEvent[]> {
    const databaseEvents = await this.userEventRepository.findByUserId(userId);
    console.log('Database Events', JSON.stringify(databaseEvents[0]));
    if (databaseEvents.length) {
      return databaseEvents as CalendarEvent[];
    }
    console.log('User does not have any saved events, saving all new ones');
  }

  private async getUserApiEvents (userId: number, apiEvents?: CalendarEvent[], url?: string): Promise<CalendarEvent[]> {
    const events = apiEvents || [];
    const uri = url || `${this.baseUrl}/${userId}/events`;
    const apiResponse = await httpClient.get(uri);
    events.push(apiResponse.data.items);

    const nextCall = apiResponse.data?.next;
    if (!nextCall) {
      return events.flat();
    }

    return await this.getUserApiEvents(userId, events, nextCall);
  }

  private async saveAllEvents (userId: number, events: CalendarEvent[]): Promise<void> {
    console.log('Saving all events as new entries for user', userId);
    await Promise.all(events.map(async event => {
      await this.userEventRepository.insert(userId, event);
    }));
  }

  private areEventsEqual (oldEvent: CalendarEvent, newEvent: Partial<CalendarEvent>): boolean {
    if (oldEvent.url !== newEvent.url) return false;
    if (oldEvent.title !== newEvent.title) return false;
    if (oldEvent.start !== newEvent.start) return false;
    if (oldEvent.end !== newEvent.end) return false;
    return true;
  }

  private async synchronizeEvents (userId: number, oldEvents: CalendarEvent[], newEvents: CalendarEvent[]): Promise<void> {
    await Promise.all(oldEvents.map(async oldEvent => {
      console.log('Starting to synchronize event', oldEvent.id);
      // Ideally check equality based on entire object but our mock always return different IDs and same hour for simplicity atm
      const updatedEvent = newEvents.find(element => element.url === oldEvent.url && element.title === oldEvent.title);
      if (!updatedEvent) {
        console.log(`Event ${oldEvent.id} deleted for user ${userId}`);
        await this.userEventRepository.delete(oldEvent.id);
        return;
      }

      if (!this.areEventsEqual(oldEvent, updatedEvent)) {
        console.log(`Event ${oldEvent.id} updated for user ${userId}`);
        await this.userEventRepository.update(oldEvent.id, updatedEvent);
        return;
      }

      const newEvent = oldEvents.find(element => element.id === updatedEvent.id);
      if (newEvent) {
        console.log(`Event ${newEvent.id} recently created for user ${userId}`);
        await this.userEventRepository.insert(userId, newEvent);
      }

      console.log('No changes for event', oldEvent.id);
    }));
  }

  async execute (userId: number): Promise<void> {
    console.log('Starting to upsert events for user', userId);
    try {
      const databaseEvents = await this.getUserDatabaseEvents(userId);
      const apiEvents = await this.getUserApiEvents(userId);
      if (!databaseEvents) {
        await this.saveAllEvents(userId, apiEvents);
        return;
      }

      await this.synchronizeEvents(userId, databaseEvents, apiEvents);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
