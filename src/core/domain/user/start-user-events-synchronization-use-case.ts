import SQSClient from '../../../infrastructure/sqs-client';

export default class StartUserEventsSynchronizationUseCase {
  constructor (
    private readonly sqsClient = new SQSClient()
  ) { }

  async execute (userId: string): Promise<void> {
    try {
      await this.sqsClient.sendMessage(userId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
