import { tr } from "@faker-js/faker";
import { ProductModel } from "../../models/order/productModel.js";
import { sendNotifcationStaff } from "../../sockets/index.js";
import { productUpdated } from "../../utils/notificationText.js";
import { NotificationController } from "../notifications/notificationController.js";
export class ProductController {
  
  // Create a new product
    static async createProduct(req, res) {
        try {
            const { name, sku, price, stockQuantity } = req.body;
            if (!name || !sku || !price || !stockQuantity) return res.status(400).json({ message: 'All fields are required' });
            const product = await ProductModel.create({ name, sku, price, stockQuantity });
            sendNotifcationStaff('new-product', product);
            return res.status(201).json(product);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to create product', error });
        }
    }

    // Get all products
    static async getAllProducts(req, res) {
        try {
            const products = await ProductModel.findAll();
            return res.status(200).json(products);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to retrieve products', error });
        }
    }

    // Get a product by its ID
    static async getProductById(req, res) {
        try {
            const productId = req.params.id;
            const product = await ProductModel.findByPk(productId, {
                include: {
                  model: OrderModel,
                  as: 'orders',
                  through: { attributes: ['quantity'] }
                }
            });

            if (!product) return res.status(404).json({ message: 'Product not found' });
            return res.status(200).json(product);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to retrieve product', error });
        }
    }

    // Update a product by its ID
    static async updateProduct(req, res) {
        try {
            const productId = req.params.id;
            const { name, sku, price, stockQuantity, threshold } = req.body;

            const product = await ProductModel.findByPk(productId);
            if (!product) return res.status(404).json({ message: 'Product not found' });
            const hasStockChanged = stockQuantity > product.stockQuantity;
            product.name = name !== undefined ? name : product.name;
            product.sku = sku !== undefined ? sku : product.sku;
            product.price = price !== undefined ? price : product.price;
            product.stockQuantity = stockQuantity !== undefined ? stockQuantity : product.stockQuantity;
            product.threshold = threshold !== undefined ? threshold : product.threshold;
            await product.save();
            sendNotifcationStaff('update-product', product);
            NotificationController.updateInventoryNotification(product, hasStockChanged);
            return res.status(200).json(product);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to update product', error });
        }
    }

    // Delete a product by its ID
    static async deleteProduct(req, res) {
        try {
            const productId = req.params.id;
            const product = await ProductModel.findByPk(productId);
            if (!product) return res.status(404).json({ message: 'Product not found' });
            await product.destroy();
            sendNotifcationStaff('delete-product', product);
            return res.status(204).json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to delete product', error });
        }
    }
}
