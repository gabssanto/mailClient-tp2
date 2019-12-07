import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import MailController from './app/controllers/MailController';
import cors from "cors";

const routes = new Router();

routes.use(cors())

routes.post('/users', UserController.store);
routes.get('/users/all', (req, res) => UserController.show(req, res));

routes.post('/sessions', SessionController.store);
routes.post('/mail', MailController.store);
routes.post('/mailSender', MailController.showSender);
routes.use(authMiddleware);

routes.put('/users', UserController.update);

export default routes;
