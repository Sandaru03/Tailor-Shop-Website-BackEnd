import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Hair & Skin Care', 'Ladies Fashion', 'Gents Fashion', 'Bridal & Party Wear', 'Accessories & Cosmetics'], 
  },
  year: {
    type: String, 
    required: true,
  },
  image: {
    type: String, 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Product', productSchema);
