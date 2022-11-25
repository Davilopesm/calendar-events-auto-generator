import { Router, Request, Response } from 'express';
import UserController from './controller';

const router = Router();
const DEFAULT_EVENTS_PER_PAGE = 100;

router.get('/:id/events', async (req: Request, res: Response, next) => {
  try {
    const limit: number = parseInt(req.query.limit as string) || DEFAULT_EVENTS_PER_PAGE;
    const start: number = parseInt(req.query.start as string) || null;
    const userId: string = req.params.id;
    const calendarEvents = new UserController().getUserEvents(userId, start, limit);
    res.send(calendarEvents);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message
    });
  }
})

export const User = router;
