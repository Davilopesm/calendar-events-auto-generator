import httpClient from '../../../../src/infrastructure/http-client';
import UpsertUserEventsUseCase from '../../../../src/core/domain/user/upsert-user-events-use-case';
import UserEventRepository from '../../../../src/infrastructure/database/repository/user-event-repository';
jest.mock('../../../../src/infrastructure/http-client');
jest.mock('../../../../src/infrastructure/database/repository/user-event-repository');

describe('UpsertUserEventsUseCase', () => {
  console.log = jest.fn();
  let useCase: UpsertUserEventsUseCase;
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
      }
    ]
  }

  beforeEach(() => {
    jest.clearAllMocks();
    UserEventRepository.prototype.insert = jest.fn();
    httpClient.get = jest.fn()
      .mockResolvedValueOnce({ data: mockedApiResponse })
      .mockResolvedValueOnce({ data: { ...mockedApiResponse, next: null } });
    useCase = new UpsertUserEventsUseCase();
  });

  describe('execute', () => {
    it('Should get all user saved database events when userId is provided', async () => {
      await useCase.execute(5);
      expect(UserEventRepository.prototype.findByUserId).toHaveBeenCalledTimes(1);
    });

    it('Should get all user api events when userId is provided', async () => {
      await useCase.execute(5);
      expect(httpClient.get).toHaveBeenCalledTimes(2);
    });

    it('Should save all api events when no database event is found for user id', async () => {
      await useCase.execute(3);
      expect(UserEventRepository.prototype.findByUserId).toHaveBeenCalledTimes(1);
      expect(httpClient.get).toHaveBeenCalledTimes(2);
      expect(UserEventRepository.prototype.insert).toHaveBeenCalledTimes(6);
    });

    it('Should delete event when is found on database but no longer returned by API', async () => {
      const mockedResponseWithLessItems = {
        items: [{
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
        }
        ]
      };
      httpClient.get = jest.fn()
        .mockResolvedValueOnce({ data: { ...mockedResponseWithLessItems, next: null } });
      UserEventRepository.prototype.findByUserId = jest.fn().mockResolvedValueOnce(mockedApiResponse.items);

      useCase = new UpsertUserEventsUseCase();
      await useCase.execute(5);
      expect(UserEventRepository.prototype.delete).toHaveBeenCalledTimes(1);
      expect(UserEventRepository.prototype.delete).toHaveBeenCalledWith(52);
    });

    it('Should update event when is found on database and API but has different values', async () => {
      const item = {
        id: 50,
        title: 'Super Mocked Interview 50',
        url: 'wwww.super.mocked.zoom.us/newValueForURL',
        start: '2022-11-25T12:38:20.557Z',
        end: '2022-11-25T13:08:20.557Z'
      };

      const mockedResponseWithDifferentItems = {
        items: [
          item,
          {
            id: 51,
            title: 'Super Mocked Interview 51',
            url: 'wwww.super.mocked.zoom.us/interview51',
            start: '2022-11-25T12:38:20.557Z',
            end: '2022-11-25T13:08:20.557Z'
          }
        ]
      };
      httpClient.get = jest.fn()
        .mockResolvedValueOnce({ data: { ...mockedResponseWithDifferentItems, next: null } });
      UserEventRepository.prototype.findByUserId = jest.fn().mockResolvedValueOnce(mockedApiResponse.items);

      useCase = new UpsertUserEventsUseCase();
      await useCase.execute(5);
      expect(UserEventRepository.prototype.update).toHaveBeenCalledTimes(1);
      expect(UserEventRepository.prototype.update).toHaveBeenCalledWith(item.id, item);
    });
  });
})
