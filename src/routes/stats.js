import express from 'express';
import { OrdersController } from '../controllers/order/orderController.js';
import { StatsController } from '../controllers/statsController.js';

export const statsRouter = express.Router();

// Get total revenue
statsRouter.get('/revenue', OrdersController.getRevenue)

statsRouter.get('/getAll', StatsController.getStats)