import express from 'express';
import categoryRoutes from './routes/categoryRouters.js';
import productRoutes from './routes/productRouters.js';
import userRoutes from './routes/userRouters.js';
import cartRoutes from './routes/cartRouters.js';
import orderRoutes from './routes/orderRouters.js';
import adminRoutes from './routes/adminRouters.js';
import financialRoutes from './routes/financialRouter.js';
import connectDB from './config/db.js';

import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();
connectDB();

// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-user-id');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/evashoes/', productRoutes, categoryRoutes, userRoutes, cartRoutes, orderRoutes, adminRoutes, financialRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

