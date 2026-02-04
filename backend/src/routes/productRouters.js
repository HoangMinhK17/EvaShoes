import express from 'express';
import { creatProduct, getAllProducts, updateProduct, deleteProduct, getProductByCategoryId, getProductById, getProductByName } from '../controllers/productController.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();
router.get('/products/', getAllProducts);
router.post('/products/', upload.array('images', 3), creatProduct);

router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/products/search/:id', getProductByCategoryId);
router.get('/products/searchById/:id', getProductById);
router.get('/products/searchByName/:name', getProductByName);
export default router;