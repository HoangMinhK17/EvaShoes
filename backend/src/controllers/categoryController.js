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
const updateCategory = (req, res) => {
  res.status(200).json({ message: 'Category updated successfully' });
}    


const deleteCategory = (req, res) => {
  res.status(200).json({ message: 'Category deleted successfully' });
}
export { getAllCategories, creatCategory, updateCategory, deleteCategory };
