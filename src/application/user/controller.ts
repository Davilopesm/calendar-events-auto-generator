import { Router } from 'express';
import GetUserEventsUseCase from '../../core/domain/user/get-user-events-use-case';
import { PaginatedResponse } from './interfaces';

const router = Router();
const MAXIMUM_EVENTS_PER_PAGE = 50;
const MAXIMUM_EVENTS = 5000;

const paginateResponse = (start: number, limit: number, userId: string): { self: string, next: string } => {
  const baseUrl = `localhost:3000/api/v1/users/${userId}/events`;
  const nextId = start + limit;

  const next = nextId <= MAXIMUM_EVENTS ? `${baseUrl}?start=${nextId}` : null;
  const self = start >= 0 ? `${baseUrl}?start=${start}` : `${baseUrl}`;
  return { self, next };
}

router.get('/:id/events', async (req, res, next) => {
  try {
    const limit: number = parseInt(req.query.limit as string) || MAXIMUM_EVENTS_PER_PAGE;
    console.log(limit);
    const start: number = parseInt(req.query.start as string) || null;
    const userId: string = req.params.id;

    const calendarEvents = new GetUserEventsUseCase().execute(start, limit);

    const { self, next } = paginateResponse(start, limit, userId);

    const response: PaginatedResponse = {
      self,
      next,
      items: calendarEvents
    }
    res.send(response);
  } catch (error) {
    throw error;
  }
})

export const UserController = router;
