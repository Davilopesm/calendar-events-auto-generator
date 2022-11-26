import StartUserEventsSynchronizationUseCase from '../../core/domain/user/start-user-events-synchronization-use-case';
import GetUserEventsUseCase from '../../core/domain/user/get-user-events-use-case';
import { PaginatedResponse } from './interfaces';

const MAXIMUM_EVENTS = 5000;
export default class UserController {
  constructor (
    private readonly getUserEventsUseCase = new GetUserEventsUseCase(),
    private readonly startUserEventsCreationUseCase = new StartUserEventsSynchronizationUseCase()
  ) { }

  private getPagination (start: number, limit: number, userId: string): { self: string, next: string } {
    const baseUrl = `http://localhost:3000/api/v1/users/${userId}/events`;
    const nextId = start + limit;

    const next = nextId <= MAXIMUM_EVENTS ? `${baseUrl}?start=${nextId}` : null;
    const self = start > 0 ? `${baseUrl}?start=${start}` : `${baseUrl}`;
    return { self, next };
  }

  getUserEvents (userId: string, start: number, limit: number): PaginatedResponse {
    try {
      console.log('Getting user events', userId);
      const userCalendarEvents = this.getUserEventsUseCase.execute(start, limit)
      const { self, next } = this.getPagination(start, limit, userId)
      return {
        self,
        next,
        items: userCalendarEvents
      }
    } catch (error: any) {
      throw new Error(`Failed getting user events with: ${JSON.stringify(error.message)}`);
    }
  }

  async createUserEvents (userId: string): Promise<void> {
    try {
      await this.startUserEventsCreationUseCase.execute(userId);
    } catch (error: any) {
      throw new Error(`Failed starting user events creation with: ${JSON.stringify(error.message)}`);
    }
  }
}
