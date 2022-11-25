import { Producer } from 'sqs-producer';
import { Consumer } from 'sqs-consumer';

export default class SQSClient {
  private readonly queueUrl = 'https://sqs.eu-west-1.amazonaws.com/account-id/queue-name';

  async sendMessage (message: string): Promise<void> {
    const producer = Producer.create({
      queueUrl: 'https://sqs.eu-west-1.amazonaws.com/account-id/queue-name',
      region: 'eu-west-1'
    });

    await producer.send(message);
  }

  async consumeMessages (): Promise<void> {
    const app = Consumer.create({
      queueUrl: 'https://sqs.eu-west-1.amazonaws.com/account-id/queue-name',
      handleMessage: async (message) => {
        // do some work with `message`
      }
    });

    app.on('error', (err) => {
      console.error(err.message);
    });

    app.on('processing_error', (err) => {
      console.error(err.message);
    });

    app.start();
  }
}
