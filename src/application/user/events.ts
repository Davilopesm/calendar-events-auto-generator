import SQSClient from '../../infrastructure/sqs-client';
import CreateUserEventsUseCase from '../../core/domain/user/upsert-user-events-use-case';
import httpClient from '../../infrastructure/http-client';

export default class UserEvents {
  constructor (
    private readonly sqsClient = new SQSClient()
  ) { }

  async createUserEvents (): Promise<void> {
    try {
      const amountOfUsersToSynchronizeEveryHour = 5;
      for (let i = 1; i <= amountOfUsersToSynchronizeEveryHour; i++) {
        await httpClient.post(`http://localhost:3000/api/v1/users/${i}/events`);
      }
    } catch (error: any) {
      throw new Error(`Failed getting user events with: ${JSON.stringify(error.message)}`);
    }
  }

  async syncUserEvents (): Promise<void> {
    try {
      await this.sqsClient.consumeUpsertUserEventsMessage(new CreateUserEventsUseCase());
    } catch (error: any) {
      throw new Error(`Failed getting user events with: ${JSON.stringify(error.message)}`);
    }
  }
}
