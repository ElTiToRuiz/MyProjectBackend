import { Op } from "sequelize";
import { OrderModel } from "../models/order/orderModel.js";
import { ShipmentModel } from "../models/shipment/shipmentModel.js";
import { ProductModel } from "../models/order/productModel.js";
import { OrderProductModel } from "../models/order/orderProductModel.js";
import sequelize from "../config/database.js";
import { TeamMembersModel } from "../models/teams/teamMembersModel.js";
import { TeamModel } from "../models/teams/teamModel.js";

export class StatsController{
    static async getOrdersByDate({ startDate, endDate }) {
        try {
            const start = startDate ? new Date(startDate) : new Date('1970-01-01');
            const end = endDate ? new Date(endDate) : new Date();
            
            end.setHours(23, 59, 59, 999);

            const orders = await OrderModel.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [start, end] 
                    }
                },
                order: [
                    ['createdAt', 'DESC'] 
                ]
            });
            return orders;
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching orders');
        }
    }


 
    static async getTotalOrdersEachWeek() {
        try {
            const getLastSevenDays = () => {
                const today = new Date();
                const startDate = new Date(today);
                startDate.setDate(today.getDate() - 6);
                const startDateFormatted = startDate.toISOString().split('T')[0]; // Extracts 'YYYY-MM-DD'
                const endDateFormatted = today.toISOString().split('T')[0]; // Extracts 'YYYY-MM-DD'
        
                return [startDateFormatted, endDateFormatted];
            };
    
            const [startDate, endDate] = getLastSevenDays();
            const orders = await StatsController.getOrdersByDate({ startDate, endDate });
    
            // Initialize totalOrderEachDay with weekdays
            const totalOrderEachDay = [];

            for (let i = 8; i > 0 ; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                totalOrderEachDay[`${date.getDate()}/${date.getMonth()+ 1}`] = 0;
            }
    
            // Loop over the orders and count orders for each weekday
            orders.forEach(order => {
                const orderDate = new Date(order.createdAt);
                totalOrderEachDay[`${orderDate.getDate()}/${orderDate.getMonth()+1}`] += 1;
            });
           
            const totalOrdersEachWeek = {
                labels: [],
                data: []
            }
            // Convert totalOrderEachDay object to an array of objects
            Object.keys(totalOrderEachDay).map(key => {
                totalOrdersEachWeek.labels.push(key);
                totalOrdersEachWeek.data.push(totalOrderEachDay[key]);
            })

            console.log(totalOrdersEachWeek);

            return totalOrdersEachWeek;
        } catch (error) {
            console.log(error);
            throw new Error('Error fetching orders');
        }  
    }

    static async getRevenue({startDate, endDate}){
        try{
            const orders = await OrderModel.findAll({
                required: true,
                include: [
                    {
                        model: ShipmentModel,
                        as: 'shipping',
                        where: {
                            orderDate: {
                                [Op.between]: [startDate, endDate]
                            },
                            shipmentStatus: 'delivered'
                        },
                        attributes: [],
                        required: true
                    },
                    {
                        model: OrderProductModel,
                        as: 'orderProducts',
                        include: [
                            {
                                model: ProductModel,
                                as: 'product',
                                required: true,
                                attributes: ['price']
                            }
                        ],
                        attributes: ['quantity']
                    }
                ],
                attributes: ['id']
            });
            
            let totalRevenue = 0;
            orders.forEach(order => {
                order.dataValues.orderProducts.forEach(p => { 
                    totalRevenue += p.quantity*p.product.price;
                })
            });
            return totalRevenue;
        }catch(error){
            console.error(error);
            throw new Error('Error fetching revenue');
        }
    }

    static async getTOPMaxProductSold(){
        try{
            const result = await OrderProductModel.findAll({
                attributes: [
                    'productId',
                    [sequelize.fn('MAX', sequelize.col('quantity')), 'maxQuantity']
                ],
                group: ['productId'],
                raw: true,
                include: [
                    {
                        model: ProductModel,
                        as: 'product',
                        required: true,
                        attributes: ['name'],
                    }
                ],
                order: [['maxQuantity', 'DESC']]
            });
            
            const productMarketShare = {
                labels: [],
                data: []
            }

            result.forEach(product => {
                productMarketShare.labels.push(product['product.name']);
                productMarketShare.data.push(product.maxQuantity);
            });
            return productMarketShare;
        } catch(error){
            console.error(error);
            throw new Error('Error fetching top product');
        }
    }


    static async getOrderStatus(){
        try{
            const result = await OrderModel.findAll({
                attributes: [
                    'status',
                    [sequelize.fn('COUNT', sequelize.col('status')), 'count']
                ],
                group: ['status'],
                raw: true
            });   
            const orderStatus = {
                labels: [],
                data: []
            }
            result.forEach(status => {
                orderStatus.labels.push(status.status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()));
                orderStatus.data.push(status.count);
            })
            return orderStatus;
        } catch(error){
            console.error(error);
            throw new Error('Error fetching order status');
        }
    }

    static async getTeamsMembers(){
        try{ 
            const result = await TeamModel.findAll({
                attributes: ['id', 'name'],
                raw: true,
            });
            const teamMembers = {
                labels: [],
                data: []
            }   

            await Promise.all(result.map(async (team) => {
                teamMembers.labels.push(team.name);

                const members = await TeamMembersModel.findAll({
                    where: { teamId: team.id },
                    attributes: [
                        [sequelize.fn('COUNT', sequelize.col('userId')), 'count']
                    ],
                    raw: true
                });
                console.log(members);
                teamMembers.data.push(members[0].count);
            }));

            return teamMembers;
        } catch(error){
            console.error(error);
            throw new Error('Error fetching team members');
        }
    }
    

    static async getStats(req, res){
        try{
            const totalOrdersEachWeek = await StatsController.getTotalOrdersEachWeek(); 
            const topProducts = await StatsController.getTOPMaxProductSold()
            const orderStatus = await StatsController.getOrderStatus();
            const teamMembers = await StatsController.getTeamsMembers();
            console.log(totalOrdersEachWeek);
            console.log(topProducts);
            console.log(orderStatus);
            console.log(teamMembers);
            return res.status(200).json({totalOrdersEachWeek, topProducts, orderStatus, teamMembers});
        }catch(error){
            console.error(error);
            return res.status(500).json({message: 'Failed to retrieve stats'});
        }
    }
}


// StatsController.getTotalOrdersEachWeek();