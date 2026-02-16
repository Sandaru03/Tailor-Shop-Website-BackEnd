import { sequelize } from './config/db.js';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleProducts = [
  {
    title: "Golden Glow Facial Kit",
    category: "Hair & Skin Care",
    year: "2024",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Herbal Hair Growth Oil",
    category: "Hair & Skin Care",
    year: "2024",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop"
  },
  {
    title: "Designer Saree Blouse",
    category: "Ladies Fashion",
    year: "2024",
    image: "https://images.unsplash.com/photo-1585226768340-a03527e02cc7?q=80&w=2670&auto=format&fit=crop"
  },
  {
    title: "Embroidered Party Frock",
    category: "Ladies Fashion",
    year: "2023",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2683&auto=format&fit=crop"
  },
  {
    title: "Custom Tailored Suit",
    category: "Gents Fashion",
    year: "2024",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c47e356?q=80&w=2574&auto=format&fit=crop"
  },
  {
    title: "Formal Shirt & Trouser",
    category: "Gents Fashion",
    year: "2024",
    image: "https://images.unsplash.com/photo-1621609764180-2ca554a9d6f2?q=80&w=2574&auto=format&fit=crop"
  },
  {
    title: "Bridal Lehengas Red",
    category: "Bridal & Party Wear",
    year: "2024",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=2574&auto=format&fit=crop"
  },
  {
    title: "Gold Plated Necklace Set",
    category: "Accessories & Cosmetics",
    year: "2023",
    image: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=2574&auto=format&fit=crop"
  },
  {
    title: "Matte Lipstick Collection",
    category: "Accessories & Cosmetics",
    year: "2024",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=2574&auto=format&fit=crop"
  }
];

const seedDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL via Sequelize');

    // Sync models (recreate tables)
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Insert new products
    await Product.bulkCreate(sampleProducts);
    console.log('Sample products seeded successfully!');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
