import express from 'express';
import { creatProduct, getAllProducts, updateProduct , deleteProduct, getProductByCategoryId} from '../controllers/productController.js';

const router = express.Router();
router.get('/products/', getAllProducts);
router.post('/products/', creatProduct);

router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/products/search/:id', getProductByCategoryId);
export default router;