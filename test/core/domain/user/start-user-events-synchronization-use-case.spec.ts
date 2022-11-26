import SQSCLient from '../../../../src/infrastructure/sqs-client';
import StartUserEventsSynchronizationUseCase from '../../../../src/core/domain/user/start-user-events-synchronization-use-case';
jest.mock('../../../../src/infrastructure/sqs-client');

describe('StartUserEventsSynchronizationUseCase', () => {
  console.error = jest.fn();
  const userId = '5';
  let useCase: StartUserEventsSynchronizationUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('Should send user as message to SQS queue for further events processing', async () => {
      SQSCLient.prototype.sendMessage = jest.fn();
      useCase = new StartUserEventsSynchronizationUseCase();

      await useCase.execute(userId);
      expect(SQSCLient.prototype.sendMessage).toHaveBeenCalledTimes(1);
      expect(SQSCLient.prototype.sendMessage).toHaveBeenCalledWith(JSON.stringify(5));
    });

    it('Should throw error when fails to send SQS event unexpectedly', async () => {
      SQSCLient.prototype.sendMessage = jest.fn().mockRejectedValueOnce(new Error());
      useCase = new StartUserEventsSynchronizationUseCase();
      await expect(useCase.execute(userId)).rejects.toThrow();
    });
  });
})
