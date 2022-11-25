import httpClient from '../../../../src/infrastructure/http-client';
import SQSCLient from '../../../../src/infrastructure/sqs-client';
import UserEventsPublisherUseCase from '../../../../src/core/domain/user/user-events-publisher-use-case';
jest.mock('../../../../src/infrastructure/http-client');
jest.mock('../../../../src/infrastructure/sqs-client');

describe('UserEventsPublisherUseCase', () => {
  let useCase: UserEventsPublisherUseCase;
  const mockedApiResponse = {
    self: 'localhost:3000/api/v1/users/123/events?start=50',
    next: 'localhost:3000/api/v1/users/123/events?start=150',
    items: [
      {
        id: 50,
        title: 'Super Mocked Interview 50',
        url: 'wwww.super.mocked.zoom.us/interview50',
        start: '2022-11-25T12:38:20.557Z',
        end: '2022-11-25T13:08:20.557Z'
      },
      {
        id: 51,
        title: 'Super Mocked Interview 51',
        url: 'wwww.super.mocked.zoom.us/interview51',
        start: '2022-11-25T12:38:20.557Z',
        end: '2022-11-25T13:08:20.557Z'
      },
      {
        id: 52,
        title: 'Super Mocked Interview 52',
        url: 'wwww.super.mocked.zoom.us/interview52',
        start: '2022-11-25T12:38:20.557Z',
        end: '2022-11-25T13:08:20.557Z'
      },
      {
        id: 53,
        title: 'Super Mocked Interview 53',
        url: 'wwww.super.mocked.zoom.us/interview53',
        start: '2022-11-25T12:38:20.557Z',
        end: '2022-11-25T13:08:20.557Z'
      },
      {
        id: 54,
        title: 'Super Mocked Interview 54',
        url: 'wwww.super.mocked.zoom.us/interview54',
        start: '2022-11-25T12:38:20.557Z',
        end: '2022-11-25T13:08:20.557Z'
      },
      {
        id: 55,
        title: 'Super Mocked Interview 55',
        url: 'wwww.super.mocked.zoom.us/interview55',
        start: '2022-11-25T12:38:20.557Z',
        end: '2022-11-25T13:08:20.557Z'
      },
      {
        id: 56,
        title: 'Super Mocked Interview 56',
        url: 'wwww.super.mocked.zoom.us/interview56',
        start: '2022-11-25T12:38:20.557Z',
        end: '2022-11-25T13:08:20.557Z'
      },
      {
        id: 57,
        title: 'Super Mocked Interview 57',
        url: 'wwww.super.mocked.zoom.us/interview57',
        start: '2022-11-25T12:38:20.557Z',
        end: '2022-11-25T13:08:20.557Z'
      },
      {
        id: 58,
        title: 'Super Mocked Interview 58',
        url: 'wwww.super.mocked.zoom.us/interview58',
        start: '2022-11-25T12:38:20.557Z',
        end: '2022-11-25T13:08:20.557Z'
      },
      {
        id: 59,
        title: 'Super Mocked Interview 59',
        url: 'wwww.super.mocked.zoom.us/interview59',
        start: '2022-11-25T12:38:20.557Z',
        end: '2022-11-25T13:08:20.557Z'
      },
      {
        id: 60,
        title: 'Super Mocked Interview 60',
        url: 'wwww.super.mocked.zoom.us/interview60',
        start: '2022-11-25T12:38:20.557Z',
        end: '2022-11-25T13:08:20.557Z'
      }
    ]
  }

  beforeEach(() => {
    jest.clearAllMocks();
    SQSCLient.prototype.sendMessage = jest.fn();
    httpClient.get = jest.fn()
      .mockResolvedValueOnce({ data: mockedApiResponse })
      .mockResolvedValueOnce({ data: { ...mockedApiResponse, next: null } });
    useCase = new UserEventsPublisherUseCase();
  });

  describe('execute', () => {
    it('Should get user events when userId is provided', async () => {
      await useCase.execute(5);
      expect(httpClient.get).toHaveBeenCalledTimes(2);
    })

    it('Should send all user events to SQS', async () => {
      await useCase.execute(5);
      expect(SQSCLient.prototype.sendMessage).toHaveBeenCalledTimes(22);
    })

    it('Should throw error when fails to get events unexpectedly', async () => {
      httpClient.get = jest.fn().mockRejectedValueOnce(new Error());
      await expect(useCase.execute(1)).rejects.toThrow();
    })

    it('Should throw error when fails to send events to SQS', async () => {
      SQSCLient.prototype.sendMessage = jest.fn().mockRejectedValueOnce(new Error());
      useCase = new UserEventsPublisherUseCase();
      await expect(useCase.execute(3)).rejects.toThrow();
    })
  })
})
