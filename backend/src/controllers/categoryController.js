import Category from "../models/Category.js";

const getAllCategories = async(req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.status(200).json({ categories, message:"Lấy danh mục thành công"});
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
}
const creatCategory = async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });   
    }
}
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}    


const deleteCategory = (req, res) => {
  res.status(200).json({ message: 'Category deleted successfully' });
}
export { getAllCategories, creatCategory, updateCategory, deleteCategory };
