import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

export const ProductModel = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true
        }
    },
    stockQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    threshold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        },
        defaultValue: 5
    }
}, {
    tableName: 'products',
    timestamps: true
});

