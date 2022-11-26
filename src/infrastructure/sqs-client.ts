import { Producer } from 'sqs-producer';
import { Consumer } from 'sqs-consumer';
export default class SQSClient {
  private readonly queueUrl = 'http://localhost:9324/queue/default';

  async sendMessage (message: string): Promise<void> {
    const producer = Producer.create({
      queueUrl: this.queueUrl
    });
    console.log(`Sending message ${message} to SQS`);

    await producer.send(message);
  }

  async consumeUpsertUserEventsMessage (useCase: any): Promise<void> {
    const queueConsumer = Consumer.create({
      queueUrl: this.queueUrl,
      handleMessage: async (message) => {
        console.log(`Received message on SQS with ${message.Body}`);
        await useCase.execute(Number(message.Body));
      }
    });

    queueConsumer.on('error', (err) => {
      console.error(err.message);
    });

    queueConsumer.on('processing_error', (err) => {
      console.error(err.message);
    });

    queueConsumer.start();
  }
}
