import GetUserEventsUseCase from '../../../../src/core/domain/user/get-user-events-use-case';

describe('GetUserEventsUseCase', () => {
  const useCase = new GetUserEventsUseCase();
  describe('execute', () => {
    it('Should correctly return all user events when start and limit are set', () => {
      const response = useCase.execute(50, 100);
      expect(response).toHaveLength(100);
    })

    it('Should return null when requested events are outside of the maximum amount of allowed events', () => {
      const response = useCase.execute(5000, 100);
      expect(response).toHaveLength(0);
    })
  })
})
