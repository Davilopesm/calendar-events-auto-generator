import { Router } from 'express';
import databaseConnection from '../../infrastructure/database/database-connection';
const router = Router();

router.get('/health', async (_req, res) => {
  try {
    await databaseConnection.select('*').from('knex_migrations');
    res.sendStatus(200);
  } catch (error) {
    throw error;
  }
})

export const HealthController = router;
