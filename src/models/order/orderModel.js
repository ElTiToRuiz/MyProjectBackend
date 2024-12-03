import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';


export const OrderModel = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    customerAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'in_transit', 'delivered', 'on_hold', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false
    },
    urgent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    additionalDetails: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    assignedTeam: {
        type: DataTypes.UUID,
        allowNull: true,
    }
}, {
    tableName: 'orders',
    timestamps: true,
});
