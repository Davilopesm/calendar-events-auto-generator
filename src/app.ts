import * as express from 'express';
import { Health } from './application/health/routes';
import { User } from './application/user/routes';

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
    this.server.use('/api/v1/', Health);
    this.server.use('/api/v1/users', User);
  }
}

export default new App().server;
