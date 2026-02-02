import Product from "../models/Product.js";


const getAllProducts = async(req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const creatProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
}
const updateProduct = (req, res) => {
  res.status(200).json({ message: 'Product updated successfully' });    

}
const deleteProduct = (req, res) => {
  res.status(200).json({ message: 'Product deleted successfully' });
}
const getProductByCategoryId = async (req, res) => {
  try {
    const product = await Product.find({ category: req.params.id, isActive: true });  
    if (!product || product.length === 0) {
      return res.status(404).json({ message: 'Product not found1' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export { getAllProducts, creatProduct, updateProduct, deleteProduct, getProductByCategoryId };