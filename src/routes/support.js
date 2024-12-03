import express from 'express';
import { SupportController } from '../controllers/supportController.js';

export const supportRouter = express.Router();

supportRouter.post('/new/bug', SupportController.bugReport);

supportRouter.post('/forgot/password', SupportController.recoverPassword);