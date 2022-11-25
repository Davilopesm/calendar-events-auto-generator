import httpClient from '../../../infrastructure/http-client';
import SQSClient from '../../../infrastructure/sqs-client';
import { CalendarEvent } from './entities/calendar-event';

export default class UserEventsPublisherUseCase {
  constructor (private readonly sqsClient = new SQSClient()) { }
  private readonly baseUrl = 'localhost:3000/api/v1/users/';

  private async sendEventToQueue (events: CalendarEvent[]): Promise<void> {
    await Promise.all(events.map(async (event: CalendarEvent) => {
      console.log('sending', event);

      await this.sqsClient.sendMessage(JSON.stringify(event));
    }))
  }

  private async getUserEvents (userId: number, url?: string): Promise<void> {
    const uri = url || `${this.baseUrl}/${userId}/start`;
    const apiResponse = await httpClient.get(uri);
    await this.sendEventToQueue(apiResponse.data.items);

    const nextCall = apiResponse.data?.next;
    if (!nextCall) return;

    await this.getUserEvents(userId, nextCall);
  }

  async execute (userId: number): Promise<void> {
    try {
      await this.getUserEvents(userId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
