import { Router } from 'express';
import { GetUserEventsUseCase } from 'src/core/domain/user/get-user-events-use-case';

const router = Router();

router.get('/:id/events', async (req, res, next) => {
  try {
    const { limit, start } = req.query
    const getEventUseCase = new GetUserEventsUseCase();
    res.send(getEventUseCase.execute(+limit, +start));
  } catch (error) {
    throw error;
  }
})

export const UserController = router;
