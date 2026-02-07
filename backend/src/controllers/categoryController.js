import Category from "../models/Category.js";

const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCategories = await Category.countDocuments();
    const categories = await Category.find({isActive: true}).skip(skip).limit(limit);
    const totalPages = Math.ceil(totalCategories / limit);

    res.status(200).json({
      categories,
      totalPages,
      currentPage: page,
      totalCategories,
      message: "Lấy danh mục thành công"
    });
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
const findCategoryByName = async (req, res) => {
  try {
    const { name } = req.params;
    if (!name || !name.trim()) {
      const categories = await Category.find();
      return res.status(200).json(categories);
    }
    const regex = new RegExp(name, "i"); // i = ignore case

    const categories = await Category.find({
      name: regex
    });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const deleteCategory = (req, res) => {
  res.status(200).json({ message: 'Category deleted successfully' });
}
export { getAllCategories, creatCategory, updateCategory, deleteCategory, findCategoryByName };
