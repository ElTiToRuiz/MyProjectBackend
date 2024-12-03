import sequelize from "../config/database.js";
import { OrderModel } from "./order/orderModel.js";
import { OrderProductModel } from "./order/orderProductModel.js"
import { ProductModel } from "./order/productModel.js";
import { ShipmentModel } from "./shipment/shipmentModel.js";
import { TeamMembersModel } from "./teams/teamMembersModel.js";
import { TeamModel } from "./teams/teamModel.js";
import { RefreshTokenModel } from "./user/refreshModel.js";
import { UserModel } from "./user/userModel.js";


const initModels = () => {
    // Relación entre OrderProductModel y ProductModel
    ProductModel.hasMany(OrderProductModel, { foreignKey: 'productId', as: 'orderProducts' });
    OrderProductModel.belongsTo(ProductModel, { foreignKey: 'productId', as: 'product' });

    // Relación entre OrderProductModel y OrderModel
    OrderModel.hasMany(OrderProductModel, { foreignKey: 'orderId', as: 'orderProducts' });
    OrderProductModel.belongsTo(OrderModel, { foreignKey: 'orderId', as: 'order' });
    // Relación entre UserModel y RefreshTokenModel
    UserModel.hasOne(RefreshTokenModel, { foreignKey: 'userId', as: 'refreshToken' });
    RefreshTokenModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });

    // Relación entre UserModel y TeamMembersModel
    UserModel.hasMany(TeamMembersModel, { foreignKey: 'userId', as: 'teamMembers' });
    TeamMembersModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });

    // Relación entre TeamMembersModel y TeamModel
    TeamModel.hasMany(TeamMembersModel, { foreignKey: 'teamId', as: 'teamMembers' });
    TeamMembersModel.belongsTo(TeamModel, { foreignKey: 'teamId', as: 'team' });

    // Relacion entre OrderModel y ShippingModel
    OrderModel.hasOne(ShipmentModel, { foreignKey: 'orderId', as: 'shipping' });
    ShipmentModel.belongsTo(OrderModel, { foreignKey: 'orderId', as: 'order' });
}; 

export const setupDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        
        // inicilaizar modelos
        initModels();

        await sequelize.sync({
            alter: false, 
            // force: true
        });

        console.log('All models were synchronized successfully.');
    }catch (error) {
        console.error('Unable to connect to the database:', error);
    } 
}