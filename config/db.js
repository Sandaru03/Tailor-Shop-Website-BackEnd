import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'tailor_shop_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false, 
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL Database connected successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error.message);
        if (error.original && error.original.code === 'ECONNREFUSED') {
            console.error('---------------------------------------------------');
            console.error('🔴 ERROR: MySQL Server is NOT running or not reachable!');
            console.error('👉 Please make sure you have started MySQL in XAMPP or Workbench.');
            console.error('👉 Check if it is running on port 3306.');
            console.error('---------------------------------------------------');
        }
        process.exit(1); 
    }
};

export { sequelize, connectDB };
