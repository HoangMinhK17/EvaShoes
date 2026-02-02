import express from 'express';
import { creatCategory, getAllCategories, updateCategory , deleteCategory} from '../controllers/categoryController.js';
const router = express.Router();
router.get('/categories/', getAllCategories);
router.post('/categories/', creatCategory);

router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;