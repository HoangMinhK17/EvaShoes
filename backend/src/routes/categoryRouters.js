import express from 'express';
import { creatCategory, getAllCategories, updateCategory , deleteCategory, findCategoryByName} from '../controllers/categoryController.js';
const router = express.Router();
router.get('/categories/', getAllCategories);
router.post('/categories/', creatCategory);

router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);
router.get('/categories/search/:name', findCategoryByName);

export default router;