import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const sampleProducts = [
  {
    title: "Golden Glow Facial Kit",
    category: "Hair & Skin Care",
    price: 18500,
    description: "Premium gold-infused facial kit for radiant, glowing skin. Perfect for special occasions.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop",
    year: 2024
  },
  {
    title: "Herbal Hair Growth Oil",
    category: "Hair & Skin Care",
    price: 4500,
    description: "100% organic herbal oil to promote hair growth and reduce hair fall. Visible results in 4 weeks.",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop",
    year: 2024
  },
  {
    title: "Designer Saree Blouse",
    category: "Ladies Fashion",
    price: 8500,
    description: "Custom-designed saree blouse with intricate hand embroidery and beadwork.",
    image: "https://images.unsplash.com/photo-1585226768340-a03527e02cc7?q=80&w=2670&auto=format&fit=crop",
    year: 2024
  },
  {
    title: "Embroidered Party Frock",
    category: "Ladies Fashion",
    price: 12500,
    description: "Elegant evening frock with floral embroidery, perfect for parties and receptions.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2683&auto=format&fit=crop",
    year: 2023
  },
  {
    title: "Custom Tailored Suit",
    category: "Gents Fashion",
    price: 35000,
    description: "Bespoke three-piece suit made from premium Italian wool. Tailored to perfection.",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c47e356?q=80&w=2574&auto=format&fit=crop",
    year: 2024
  },
  {
    title: "Formal Shirt & Trouser",
    category: "Gents Fashion",
    price: 8500,
    description: "Classic white formal shirt paired with slim-fit trousers. Essential for every wardrobe.",
    image: "https://images.unsplash.com/photo-1621609764180-2ca554a9d6f2?q=80&w=2574&auto=format&fit=crop",
    year: 2024
  },
  {
    title: "Bridal Lehengas Red",
    category: "Bridal & Party Wear",
    price: 150000,
    description: "Exquisite red bridal lehenga with heavy zardozi work and velvet fabric. A royal choice for your big day.",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=2574&auto=format&fit=crop",
    year: 2024
  },
  {
    title: "Gold Plated Necklace Set",
    category: "Accessories & Cosmetics",
    price: 12500,
    description: "Traditional gold-plated necklace set with matching earrings. Adds a touch of glamour to any outfit.",
    image: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=2574&auto=format&fit=crop",
    year: 2023
  },
  {
    title: "Matte Lipstick Collection",
    category: "Accessories & Cosmetics",
    price: 3500,
    description: "Set of 5 long-lasting matte lipsticks in vibrant shades of red and pink.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=2574&auto=format&fit=crop",
    year: 2024
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    await Product.insertMany(sampleProducts);
    console.log('Sample products seeded successfully!');

    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding database:', err);
    mongoose.connection.close();
  }
};

seedDB();
