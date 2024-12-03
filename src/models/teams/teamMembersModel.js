import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

export const TeamMembersModel = sequelize.define('TeamMember', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    teamId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'teams',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    role: {
        type: DataTypes.ENUM('staff', 'manager', 'admin', 'superadmin'),
        defaultValue: 'staff',
        allowNull: false
    }
}, {
    tableName: 'team_members',
    timestamps: false
});

