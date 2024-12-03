import sequelize from "../../config/database.js";
import { OrderModel } from "../../models/order/orderModel.js";
import { ShipmentModel } from "../../models/shipment/shipmentModel.js";
import { ShipmentController } from "../shipment/shipmentController.js";
import { sendNotifcationAdmin, sendNotifcationStaff } from "../../sockets/index.js";
import { TeamMembersModel } from "../../models/teams/teamMembersModel.js";
import { NotificationController } from "../notifications/notificationController.js";
import { Op } from "sequelize";
import { OrderProductModel } from "../../models/order/orderProductModel.js";
import { ProductModel } from "../../models/order/productModel.js";
import { StatsController } from "../statsController.js";

export class OrdersController{

    // Fetch all orders
    static async getAllOrders(req, res){
        try {
            const orders = await OrderModel.findAll();
            res.status(200).json(orders);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error fetching orders', error });
        }
    };

    static async getOrders(req, res){
        try {
            const { userId } = req.params;
            const teams = await TeamMembersModel.findAll({ where: { userId: userId } });
            const teamIds = teams.map(team => team.teamId);
            console.log(teamIds)
            const orders = await OrderModel.findAll({ where: { assignedTeam: teamIds } });
            console.log(orders)
            res.status(200).json(orders);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error fetching orders', error });
        }
    }



    // Fetch a single order by ID
    static async getOrderById(req, res){
        try {
            const order = await OrderModel.findByPk(req.params.id);
            if (!order) return res.status(404).json({ message: 'Order not found' });
            res.status(200).json(order);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error fetching order', error });
        }
    };

    // Create a new order
    static async createOrder(req, res){
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ message: 'Order data is required' });
            }
            const newOrder = await OrderModel.create(req.body);
            const shipment = await ShipmentController.createShipmentEmpty({order: newOrder});
          
            sendNotifcationAdmin('new-order', newOrder)
            sendNotifcationAdmin('new-shipment', shipment)

            await NotificationController.createOrderNotification(newOrder, req.user);
  
            res.status(201).json({ order: newOrder, shipment });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error creating order', error });
        }
    };

    // Update an order (e.g., status change)
    static async updateOrder(req, res){
        try {
            const { id } = req.params;
            const [updated] = await OrderModel.update(req.body, { where: { id } });
            if (!updated) return res.status(404).json({ message: 'Order not found' });
            const updateOrder = await OrderModel.findByPk(id);
            const updateShipment = await ShipmentController.updateShipment({order: updateOrder});          
            sendNotifcationAdmin('update-order', updateOrder) 
            // console.log('updateOrder', updateOrder)
            // io.emit('update-order', updateOrder);
            sendNotifcationAdmin('update-shipment', updateShipment)
            NotificationController.updateOrderNotification(updateOrder, req.user);
            res.status(200).json({ message: 'Order updated successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error updating order', error });
        }
    };

    // Mark an order and its shipment urgent
    static async markOrderAsUrgent(req, res){
        try {
            const { id } = req.params;
            await OrdersController.makeOrderUrgent({orderId: id});
            res.status(200).json({ message: 'Order marked as urgent' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error marking order as urgent', error });
        }
    }

    // Mark an order as urgent an its shipment
    static async makeOrderUrgent({ orderId }) {
        const t = await sequelize.transaction();
        try {
            const order = await OrderModel.findByPk(orderId, { transaction: t });
            if (!order) throw new Error('Order not found');
            const shipment = await ShipmentModel.findOne({ where: { orderId }, transaction: t });
            if (!shipment) throw new Error('Shipment not found');
    
            await order.update({ urgent: true }, { transaction: t });
            await shipment.update({ urgent: true }, { transaction: t });
            await t.commit();
    
            sendNotifcationStaff('update-order', order) 
            sendNotifcationAdmin('update-shipment', shipment)
            NotificationController.makeOrderUrgentNotification(order);
        } catch (error) {
            if (t) await t.rollback();
            console.error('Error making order urgent:', error);
            throw error;
        }
    }

    static async addOrderToTeam(req, res){
        try{
            console.log(req.body)
            const { id } = req.params;
            const { teamId } = req.body;
            const order = await OrderModel.findByPk(id);
            if (!order) return res.status(404).json({ message: 'Order not found' });
            if(order.assignedTeam === teamId) return res.status(400).json({ message: 'Order already assigned to team' }); 
            order.assignedTeam = teamId;
            await order.save();
            res.status(200).json({ message: 'Order added to team successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error adding order to team', error });
        }
    }

    static async removeOrderFromTeam(req, res){
        try{
            const { id } = req.params;
            const { teamId } = req.body;
            const order = await OrderModel.findByPk(id);
            if (!order) return res.status(404).json({ message: 'Order not found' });
            if(order.assignedTeam !== teamId) return res.status(400).json({ message: 'Order not assigned to team' });
            order.assignedTeam = null;
            await order.save();
            await order.update({ assignedTeam: teams.filter(team => team !== teamId) });
            res.status(200).json({ message: 'Order removed from team successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error removing order from team', error });
        }
    }
    

    // Delete an order
    static async deleteOrder(req, res){
        try {
            const { id } = req.params;
            const order = await OrderModel.findByPk(id);
            await OrderModel.destroy({ where: { id } });
            if (!deleted) return res.status(404).json({ message: 'Order not found' });
            res.status(200).json({ message: 'Order deleted successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error deleting order', error });
        }
    };

    static getRevenue = async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const start = startDate || '1970-01-01';
            const end = endDate || new Date();
            const totalRevenue = await StatsController.getRevenue({ startDate: start, endDate: end });
            res.status(200).json({revenue: totalRevenue}); 
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error fetching revenue', error });
        }
    };            
}