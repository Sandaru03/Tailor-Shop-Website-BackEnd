import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['createdAt', 'DESC']] });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new product
export const addProduct = async (req, res) => {
  const { title, category, year } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ message: 'Image is required' });
  }

  const imagePath = `uploads/${req.file.filename}`; 

  try {
    const newProduct = await Product.create({
      title,
      category,
      year,
      image: imagePath,
    });
    res.status(201).json(newProduct);
  } catch (err) {
    fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename), (unlinkErr) => {
      if (unlinkErr) console.error("Failed to delete file after error:", unlinkErr);
    });
    res.status(400).json({ message: err.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const absolutePath = path.join(__dirname, '..', '..', product.image);
    fs.unlink(absolutePath, (err) => {
      if (err) console.error("Failed to delete image file:", err);
    });

    await product.destroy(); 
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Update a product
export const updateProduct = async (req, res) => {
  const { title, category, year } = req.body;
  const productId = req.params.id;

  try {
    let product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields if they exist
    const updates = {};
    if (title) updates.title = title;
    if (category) updates.category = category;
    if (year) updates.year = year;

    // Handle image update
    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, '..', '..', product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Failed to delete old image:", err);
        });
      }
      // Set new image
      updates.image = `uploads/${req.file.filename}`;
    }

    await product.update(updates);
    res.json(product);

  } catch (err) {
    // If error and new file was uploaded, delete it
    if (req.file) {
      fs.unlink(path.join(__dirname, '..', '..', 'uploads', req.file.filename), (unlinkErr) => {
        if (unlinkErr) console.error("Failed to delete temp file:", unlinkErr);
      });
    }
    res.status(400).json({ message: err.message });
  }
};
