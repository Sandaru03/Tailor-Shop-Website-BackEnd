import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Measurement = sequelize.define('Measurement', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    measurements: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Object containing neck, shoulder, chest, etc.'
    },
    videoFront: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    videoBack: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    status: {
        type: DataTypes.ENUM('pending', 'reviewed', 'completed'),
        defaultValue: 'pending'
    }
}, {
    tableName: 'measurements',
    timestamps: true
});

export default Measurement;
