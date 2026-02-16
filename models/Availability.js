import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Availability = sequelize.define('Availability', {
    date: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'YYYY-MM-DD'
    },
    slots: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of { time: "HH:MM AM/PM", isBooked: boolean }'
    }
}, {
    tableName: 'availabilities',
    timestamps: true
});

export default Availability;
