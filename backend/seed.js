import mongoose from 'mongoose';
import Category from './src/models/Category.js';
import Product from './src/models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evashoes');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create categories
    const categories = await Category.insertMany([
      { name: 'Giày Cao Gót', isActive: true },
      { name: 'Giày Cộng Sở', isActive: true },
      { name: 'Giày Bập Bê', isActive: true },
      { name: 'Giày Sandal', isActive: true },
    ]);
    console.log('Categories created:', categories);

    // Create products
    const products = await Product.insertMany([
      {
        name: 'Heel Accent Mirror',
        price: 820000,
        sellPrice: null,
        description: 'Giày cao gót thanh lịch với gương hiệu ứng',
        productDetails: 'Chất liệu: Da lộn cao cấp, Chiều cao gót: 7cm',
        category: categories[0]._id,
        imageUrl: ['https://via.placeholder.com/220x280/333333/ffffff?text=Heel+Mirror'],
        colors: [
          { name: 'Đen', code: '#000000' },
          { name: 'Nude', code: '#E8D5C4' },
        ],
        sizes: [
          { size: 35, stock: 5 },
          { size: 36, stock: 8 },
          { size: 37, stock: 10 },
          { size: 38, stock: 7 },
        ],
        isSale: false,
        isActive: true,
        sold: 12,
      },
      {
        name: 'Holding Blue Area Bag',
        price: 1620000,
        sellPrice: null,
        description: 'Túi xách phong cách với chi tiết xanh',
        productDetails: 'Chất liệu: Da tổng hợp, Kích thước: 30x20x12cm',
        category: categories[0]._id,
        imageUrl: ['https://via.placeholder.com/220x280/1a1a1a/ffffff?text=Blue+Bag'],
        colors: [
          { name: 'Xanh', code: '#1e3a5f' },
        ],
        sizes: [],
        isSale: false,
        isActive: true,
        sold: 8,
      },
      {
        name: 'Hammarian Pilaf',
        price: 1170000,
        sellPrice: null,
        description: 'Giày sandal dép cao gót đẹp mắt',
        productDetails: 'Chất liệu: Da mềm, Chiều cao: 5cm',
        category: categories[3]._id,
        imageUrl: ['https://via.placeholder.com/220x280/e8e8e8/666666?text=Pilaf'],
        colors: [
          { name: 'Be', code: '#D4AF99' },
          { name: 'Trắng', code: '#FFFFFF' },
        ],
        sizes: [
          { size: 35, stock: 6 },
          { size: 36, stock: 9 },
          { size: 37, stock: 8 },
        ],
        isSale: false,
        isActive: true,
        sold: 15,
      },
      {
        name: 'Cropped Faux Leather Jacket',
        price: 1290000,
        sellPrice: null,
        description: 'Áo jacket da giả kiểu dáng ngắn',
        productDetails: 'Chất liệu: Da giả, Fit: Cropped',
        category: categories[2]._id,
        imageUrl: ['https://via.placeholder.com/220x280/c0c0c0/333333?text=Jacket'],
        colors: [
          { name: 'Hồng nhạt', code: '#FFB6D9' },
        ],
        sizes: [
          { size: 'XS', stock: 4 },
          { size: 'S', stock: 6 },
          { size: 'M', stock: 8 },
          { size: 'L', stock: 5 },
        ],
        isSale: true,
        isActive: true,
        sold: 23,
      },
      {
        name: 'Colorful Jacket',
        price: 1290000,
        sellPrice: null,
        description: 'Áo jacket đa sắc màu tươi sáng',
        productDetails: 'Chất liệu: Cotton blend, Kiểu dáng: Oversized',
        category: categories[2]._id,
        imageUrl: ['https://via.placeholder.com/220x280/90EE90/ffffff?text=Colorful'],
        colors: [
          { name: 'Xanh lá', code: '#90EE90' },
          { name: 'Hồng', code: '#FF69B4' },
          { name: 'Vàng', code: '#FFD700' },
        ],
        sizes: [
          { size: 'XS', stock: 3 },
          { size: 'S', stock: 5 },
          { size: 'M', stock: 9 },
          { size: 'L', stock: 6 },
        ],
        isSale: true,
        isActive: true,
        sold: 18,
      },
      {
        name: 'Zeal Dressan',
        price: 1620000,
        sellPrice: 1290000,
        description: 'Giày cao gót sang trọng màu xanh',
        productDetails: 'Chất liệu: Da cao cấp, Chiều cao: 8cm',
        category: categories[0]._id,
        imageUrl: ['https://via.placeholder.com/220x280/2F5496/ffffff?text=Zeal'],
        colors: [
          { name: 'Xanh lá', code: '#228B22' },
        ],
        sizes: [
          { size: 35, stock: 4 },
          { size: 36, stock: 7 },
          { size: 37, stock: 6 },
        ],
        isSale: true,
        isActive: true,
        sold: 34,
      },
      {
        name: 'Cushion Unisex Slippaper',
        price: 1290000,
        sellPrice: 990000,
        description: 'Dép êm ái unisex với đệm thoải mái',
        productDetails: 'Chất liệu: EVA foam, Đệm: Memory foam',
        category: categories[3]._id,
        imageUrl: ['https://via.placeholder.com/220x280/D3D3D3/333333?text=Slipper'],
        colors: [
          { name: 'Xanh', code: '#5DADE2' },
          { name: 'Nude', code: '#F4A460' },
        ],
        sizes: [
          { size: 35, stock: 8 },
          { size: 36, stock: 10 },
          { size: 37, stock: 9 },
          { size: 38, stock: 7 },
        ],
        isSale: true,
        isActive: true,
        sold: 56,
      },
    ]);

    console.log('Products created:', products.length);
    console.log('✅ Sample data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
