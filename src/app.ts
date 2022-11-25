import * as express from 'express';
import { HealthController } from './application/health/controller';
import { UserController } from './application/user/controller';

class App {
  public server;

  constructor () {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares (): void {
    this.server.use(express.json());
  }

  routes (): void {
    this.server.use('/api/v1/', HealthController);
    this.server.use('/api/v1/users', UserController);
  }
}

export default new App().server;
