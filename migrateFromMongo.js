
import { MongoClient } from 'mongodb';
import { sequelize } from './config/db.js';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URI;

async function migrate() {
    if (!mongoUri) {
        console.error('MONGO_URI is not defined in .env');
        process.exit(1);
    }

    const client = new MongoClient(mongoUri);

    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas...');
        
        await sequelize.authenticate();
        console.log('Connected to MySQL...');

        // Assuming database name from URI or defaulting to 'test' (standard for Compass)
        // Let's get database from URI
        const dbName = new URL(mongoUri).pathname.substring(1) || 'test';
        const db = client.db(dbName);

        // Fetch products
        // Try 'products' collection (Mongoose pluralizes by default)
        const productsCollection = db.collection('products');
        const mongoProducts = await productsCollection.find({}).toArray();

        console.log(`Found ${mongoProducts.length} products in MongoDB.`);

        if (mongoProducts.length === 0) {
            console.log('No products found to migrate.');
            process.exit(0);
        }

        // Transform for MySQL
        const mysqlProducts = mongoProducts.map(p => ({
            title: p.title,
            category: p.category,
            year: p.year,
            image: p.image,
            createdAt: p.createdAt || new Date(),
            updatedAt: p.updatedAt || new Date()
        }));

        // Insert into MySQL
        // We do NOT use force: true here, we append data.
        await sequelize.sync(); 
        await Product.bulkCreate(mysqlProducts);

        console.log(`Successfully migrated ${mysqlProducts.length} products to MySQL!`);

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await client.close();
        // Keep Sequelize connection open? No need for script.
        process.exit(0);
    }
}

migrate();
