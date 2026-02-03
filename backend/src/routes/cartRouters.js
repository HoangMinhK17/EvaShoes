import express from 'express';
import { addItemToCart, getCartItems, removeItemFromCart, clearCart } from '../controllers/cartController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/cart/', auth, getCartItems);
router.post('/cart/add', auth, addItemToCart);
router.post('/cart/remove', auth, removeItemFromCart);
router.post('/cart/clear', auth, clearCart);

export default router;
