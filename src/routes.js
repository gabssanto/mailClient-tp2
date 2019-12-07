import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import MailController from './app/controllers/MailController';
import cors from "cors";

const routes = new Router();

routes.use(cors())

routes.post('/users', (req, res) => UserController.store(req, res));
routes.get('/users/all', (req, res) => UserController.show(req, res));

routes.post('/sessions', SessionController.store);
routes.post('/mail', MailController.store);
routes.post('/mailSender', MailController.showSender);
routes.post('/mailReceiver', MailController.showReceiver);
routes.use(authMiddleware);

routes.put('/users', (req, res) => UserController.update(req, res));
routes.delete('/users/:id', (req, res) => UserController.delete(req, res));

export default routes;
