import { Op } from "sequelize";
import { NotificationModel, permissionHierarchy } from "../../models/notifications/notificationModel.js";
import { OrderModel } from "../../models/order/orderModel.js";
import { TeamMembersModel } from "../../models/teams/teamMembersModel.js";
import { UserModel } from "../../models/user/userModel.js";
import { io } from "../../server.js";
import { sendNotifcationAdmin, sendNotifcationStaff } from "../../sockets/index.js";
import { inventoryThresholdReached, newStockAdded, noStock, orderCancelled, orderCreated, orderDelivered, orderStatusChanged, orderUrgent, productUpdated } from "../../utils/notificationText.js";


export class NotificationController{
    
    static async getAllNotifications(req, res) {
        try {
            const { length } = req.params;
            const limit = Number.isNaN(parseInt(length)) ? 10 : parseInt(length);
            const notifications = await NotificationModel.findAll({
                order: [['createdAt', 'DESC']], 
                limit: limit,
            });
            return res.status(200).json(notifications);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to retrieve notifications', error });
        }
    }

    static async getAllNotificationsForUser(req, res) {
        try {
            const { userId, length } = req.params;
            const user = await UserModel.findByPk(userId);
            if (!user) return res.status(404).json({ message: 'User not found' });
            const teams = await TeamMembersModel.findAll({ where: { userId: userId } });
            const teamIds = teams.map(team => team.teamId);
            const orders = await OrderModel.findAll({ where: { assignedTeam: teamIds } });
            const orderIds = orders.map(order => order.id); 
            const whereConditions = {
                reference: {
                    [Op.or]: [
                        userId,
                        { [Op.in]: teamIds },
                        { [Op.in]: orderIds },
                        null
                    ]
                }
            };
            
            const notifications = await NotificationModel.findAll({
                where: whereConditions,
                order: [['createdAt', 'DESC']], 
                limit: parseInt(length) || 10,
            });
            return res.status(200).json(notifications);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to retrieve notifications', error });
        }
    }

    static async createOrderNotification(order) {
        try{
            const notification = await NotificationModel.create(orderCreated(order));
            sendNotifcationAdmin('new-notification', notification);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async updateOrderNotification(order) {
        try {
            let notification;
            if(order.status == 'delivered') notification = await NotificationModel.create(orderDelivered(order));
            else if(order.status == 'cancelled') notification = await NotificationModel.create(orderCancelled(order));
            else notification = await NotificationModel.create(orderStatusChanged(order)); 
            io.to(order.assignedTeam).emit('new-notification', notification); 
            sendNotifcationAdmin('new-notification', notification);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async makeOrderUrgentNotification(order) {
        try {
            const notification = await NotificationModel.create(orderUrgent(order));
            io.to(order.assignedTeam).emit('new-notification', notification); 
            sendNotifcationAdmin('new-notification', notification);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async updateInventoryNotification(product, stockUpdate) { 
        try{
            let notification
            if(stockUpdate) notification = await NotificationModel.create(newStockAdded(product));
            else notification = await NotificationModel.create(productUpdated(product));
            sendNotifcationStaff('new-notification', notification);
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    static async inventoryNotification(product) {
        try{
            if(product.dataValues.stockQuantity <= product.dataValues.threshold){
                const notification =  product.dataValues.stockQuantity === 0 ? await NotificationModel.create(noStock(product)) : await NotificationModel.create(inventoryThresholdReached(product));
                sendNotifcationStaff('new-notification', notification);
            }
        }catch(error){
            console.error(error);
            throw error;
        }
    }
}