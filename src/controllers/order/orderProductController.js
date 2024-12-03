import { Sequelize } from "sequelize";
import { OrderModel } from "../../models/order/orderModel.js";
import { OrderProductModel } from "../../models/order/orderProductModel.js";
import { ProductModel } from "../../models/order/productModel.js";
import sequelize from "../../config/database.js";
import { NotificationController } from "../notifications/notificationController.js";

export class OrderProductController {
    // Add a product to an order
    static async addProductToOrder(req, res) {
        const { orderId, productId, quantity } = req.body;
        if (!orderId || !productId || !quantity) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
    
        try {
            const order = await OrderModel.findByPk(orderId);
            const product = await ProductModel.findByPk(productId);
    
            if (!order) return res.status(404).json({ message: 'Order not found' });
            if (!product) return res.status(404).json({ message: 'Product not found' });
    
            if (product.stockQuantity < quantity) {
                return res.status(400).json({ message: 'Not enough stock available' });
            }
    
            const t = await sequelize.transaction({
                isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
                autocommit: false
            });
            console.log(req.body)
            try {
                let orderProduct = await OrderProductModel.findOne({where: { orderId, productId }}, { transaction: t }); 
                if (orderProduct) {
                    orderProduct.quantity += quantity;
                    await orderProduct.save({ transaction: t });
                } else {
                    orderProduct = await OrderProductModel.create(
                        { orderId, productId, quantity }, 
                        { transaction: t }
                    );
                }
                
                product.stockQuantity -= quantity;
                await product.save({ transaction: t });
                await t.commit();

                await NotificationController.inventoryNotification(product)
    
                return res.status(200).json({
                    message: 'Product added to order',
                    orderProduct: orderProduct
                });

            } catch (error) {
                await t.rollback();
                throw error;
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to add product to order', error });
        }
    }
    

    // Remove a product from an order
    static async removeProductFromOrder(req, res) {
        try {
            console.log(req.body);
            const { orderId, productId } = req.body;
            
            const order = await OrderModel.findByPk(orderId);
            const product = await ProductModel.findByPk(productId);

            if (!order) return res.status(404).json({ message: 'Order not found' });
            if (!product) return res.status(404).json({ message: 'Product not found' });
            
            const t = await sequelize.transaction({
                isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
                autocommit: false
            });

            try{
                const order_product = await OrderProductModel.findOne({where: { orderId, productId }}, { transaction: t }); 
                if (!order_product) {
                    return res.status(404).json({ message: 'Product not found in order' });
                }
                await order_product.destroy({ transaction: t });
                product.stockQuantity += order_product.quantity;
                await product.save({ transaction: t });
                await t.commit();
                
                return res.status(200).json({ message: 'Product removed from order' });
            }catch (error) {
                await t.rollback();
                throw error;
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to remove product from order', error });
        }
    }

    // Get all orders for a product
    static async getOrdersForProduct(req, res) {
        try {
            const productId = req.params.id;

            const product = await OrderProductModel.findAll({
                where: {productId},
                include: {
                    model: OrderModel,
                    as: 'order',
                    required: true,
                }
            });

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json(product.orders);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to retrieve orders for product', error });
        }
    }

    // Get all products from a specific order
    static async getProductsForOrder(req, res) {
        try {
            const orderId = req.params.order_id;
            // get all the orders associated with the order_id
            const products = await OrderProductModel.findAll({
                where: {orderId},
                include: {
                    model: ProductModel,
                    as: 'product',
                    required: true,
                }
            });
            if (!products) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Return all products associated with the order
            return res.status(200).json(products);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to retrieve products for order', error });
        }
    }
}
