import Category from "../models/Category.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/Users.js";

const getAdminStats = async (req, res) => {
  const [totalProducts, totalCategories, totalUsers, totalOrders] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Category.countDocuments({ isActive: true }),
    User.countDocuments({}),
    Order.countDocuments({status: 'delivered'}), 
  ]);

  res.json({ totalProducts, totalCategories, totalUsers, totalOrders });
};

export { getAdminStats };

