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
      // Ideally check equality based on object ID but our mock always return different IDs for simplicity atm
      const updatedEvent = newEvents.find(element => element.url === oldEvent.url && element.title === oldEvent.title);

      // If event does not exist on API but exists on DB it needs to be deleted
      if (!updatedEvent) {
        console.log(`Event ${oldEvent.id} synchronized and deleted for user ${userId}`);
        await this.userEventRepository.delete(oldEvent.id);
        return;
      }

      // If event exists on API and on DB and is different we need to update it
      if (!this.areEventsEqual(oldEvent, updatedEvent)) {
        console.log(`Event ${oldEvent.id} synchronized and updated for user ${userId}`);
        await this.userEventRepository.update(oldEvent.id, updatedEvent);
        return;
      }

      // If event exists on API on DB and is equal on both we dont need to do anything for it
      console.log(`Event ${oldEvent.id} synchronized with no changes for user ${userId}`);
    }));

    await Promise.all(newEvents.map(async newEvent => {
      const updatedEvent = oldEvents.find(oldEvent => oldEvent.url === newEvent.url && oldEvent.title === newEvent.title)
      // If event exists on API but not on DB it needs to be created
      if (!updatedEvent) {
        console.log(`Event ${newEvent.id} recently added for user ${userId}`);
        await this.userEventRepository.insert(userId, newEvent);
      }
    }))
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
