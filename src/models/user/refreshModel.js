import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

export const RefreshTokenModel = sequelize.define('RefreshToken', { 
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id' 
        },
        onDelete: 'CASCADE'
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'refresh_tokens',
    timestamps: true,
});

