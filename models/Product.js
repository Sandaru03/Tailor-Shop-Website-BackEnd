import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Product = sequelize.define('Product', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('Hair & Skin Care', 'Ladies Fashion', 'Gents Fashion', 'Bridal & Party Wear', 'Accessories & Cosmetics'),
        allowNull: false
    },
    year: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'products',
    timestamps: true
});

export default Product;
