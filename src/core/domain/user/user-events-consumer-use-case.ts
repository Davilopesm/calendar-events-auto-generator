import SQSClient from 'src/infrastructure/sqs-client';

export default class UserEventsConsumerUseCase {
  constructor (private readonly sqsClient = new SQSClient()) { }
  private readonly baseUrl = 'localhost:3000/api/v1/users/';

  async execute (userId: number): Promise<void> {

  }
}
