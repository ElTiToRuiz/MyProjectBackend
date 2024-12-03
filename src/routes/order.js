import express from 'express'; 
import { OrdersController } from '../controllers/order/orderController.js';
import { OrderProductController } from '../controllers/order/orderProductController.js';


export const ordersRouter = express.Router();

// Get all orders
ordersRouter.get('/admin', OrdersController.getAllOrders);

// Get all orders for a team
ordersRouter.get('/:userId', OrdersController.getOrders);

// FIlter orders by status
ordersRouter.get('/status', OrdersController.getAllOrders);

// Get order by ID
ordersRouter.get('/:id', OrdersController.getOrderById);

// Create a new order
// ordersRouter.post('/', verifyTokenAndRole(['superadmin', 'admin', 'manager']), OrdersController.createOrder);
// this only on developmente else the above one
ordersRouter.post('/',  OrdersController.createOrder);

// Update an order
ordersRouter.put('/:id', OrdersController.updateOrder);

// Update a order as Urgent
ordersRouter.put('/:id/urgent', OrdersController.markOrderAsUrgent);

// Delete an order
ordersRouter.delete('/:id', OrdersController.deleteOrder);

// Get all products in an order
ordersRouter.get('/products/:order_id', OrderProductController.getProductsForOrder); 

// Add product to order
ordersRouter.post('/products',  OrderProductController.addProductToOrder);

// Remove product from order
ordersRouter.delete('/products', OrderProductController.removeProductFromOrder);

// Add order to a team
ordersRouter.post('/:id/assign', OrdersController.addOrderToTeam);

// Remove order from a team
ordersRouter.post('/:id/unassign', OrdersController.removeOrderFromTeam);