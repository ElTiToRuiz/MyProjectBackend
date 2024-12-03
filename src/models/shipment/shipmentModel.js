import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

export const ShipmentModel = sequelize.define('Shipment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id'
        },
        onDelete: 'SET NULL'
    },
    trackingNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    shipmentStatus: {
        type: DataTypes.ENUM('pending', 'processing', 'in_transit', 'delivered', 'on_hold', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false
    },
    orderDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estimatedDeliveryDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    deliveredDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    clientName: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    clientEmail: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    clientAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    additionalNotes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    urgent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    tableName: 'shipments',
    timestamps: true
});
