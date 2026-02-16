import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Appointment = sequelize.define('Appointment', {
    customerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contactNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    garmentType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM('Gents', 'Ladies'),
        allowNull: false
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'YYYY-MM-DD'
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'HH:MM AM/PM'
    }
}, {
    tableName: 'appointments',
    timestamps: true
});

export default Appointment;
