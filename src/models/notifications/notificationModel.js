import { DataTypes } from 'sequelize';
import sequelize from "../../config/database.js";

export const NotificationModel = sequelize.define('Notification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        defaultValue: 'medium',
    },  
    is_persistent: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    min_permission: {
        type: DataTypes.ENUM('staff', 'manager', 'admin', 'superadmin'),
        defaultValue: 'staff',
    },
    reference: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
    },
}, {
    tableName: 'notifications',
    timestamps: true,
});

export const permissionHierarchy = ['staff', 'manager', 'admin', 'superadmin'];
