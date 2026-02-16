
import { sequelize } from './config/db.js';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

// PASTE YOUR MONGODB DATA HERE
// Replace this array with your actual data from MongoDB
const products = [
  {
    title: "Golden Glow Facial Kit",
    category: "Hair & Skin Care",
    year: "2024",
    image: "uploads/sample1.jpg" // Ensure this path is correct for your setup
  },
  // ... Paste other products here
];

const seedDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL');

    // Sync models (be careful, force: true drops tables!)
    // We use force: false here to append, or true to reset.
    // Let's use false to be safe, or explicit cleanup if needed.
    // Actually, for a restoration script, we might want to just insert.
    await sequelize.sync(); 

    // Bulk create
    await Product.bulkCreate(products);
    console.log('Products imported successfully!');

    process.exit(0);
  } catch (err) {
    console.error('Error importing data:', err);
    process.exit(1);
  }
};

seedDB();
