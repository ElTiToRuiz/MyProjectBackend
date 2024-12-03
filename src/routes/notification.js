import express from 'express'; 
import { NotificationController } from '../controllers/notifications/notificationController.js';


export const notificationRouter = express.Router();

// Get all notifications
notificationRouter.get('/admin/:length', NotificationController.getAllNotifications);

// Get all notifications for a user
notificationRouter.get('/user/:userId/:length', NotificationController.getAllNotificationsForUser);