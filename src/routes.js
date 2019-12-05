import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import MailController from './app/controllers/MailController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.post('/mail', MailController.store);
routes.get('/mail', MailController.showAll);
routes.use(authMiddleware);

routes.put('/users', UserController.update);

export default routes;
