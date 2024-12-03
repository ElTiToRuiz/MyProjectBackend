import express from 'express';
import { ProductController } from '../controllers/order/productController.js';
import { OrderProductController } from '../controllers/order/orderProductController.js';


export const productsRouter = express.Router();

// Route for creating a product
// productsRouter.post('/',  ProductController.createProduct);
// this only on developmente else the above one
productsRouter.post('/', ProductController.createProduct);

// Route for getting all products
productsRouter.get('/', ProductController.getAllProducts);

// Route for getting a product by id
productsRouter.get('/:id',  ProductController.getProductById);

// Route for updating a product
productsRouter.put('/:id',  ProductController.updateProduct);

// Route for deleting a product
productsRouter.delete('/:id', ProductController.deleteProduct);

// Route for getting all orders for a product
productsRouter.get('/:id/orders', OrderProductController.getOrdersForProduct);