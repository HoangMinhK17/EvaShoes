import Product from "../models/Product.js";


const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({isActive: true}).populate('category', 'name').sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const creatProduct = async (req, res) => {
  try {
    // Parse form data
    const productData = {
      name: req.body.name,
      price: parseFloat(req.body.price),
      sellPrice: req.body.sellPrice ? parseFloat(req.body.sellPrice) : undefined,
      description: req.body.description,
      productDetails: req.body.productDetails,
      category: req.body.category,
      isSale: req.body.isSale === 'true',
      isActive: req.body.isActive === 'true',
    };

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      productData.imageUrl = req.files.map(file => `/uploads/products/${req.body.categoryFolder || 'other'}/${file.filename}`);
    }

    // Parse colors array from JSON string
    if (req.body.colors) {
      try {
        productData.colors = JSON.parse(req.body.colors);
      } catch (e) {
        productData.colors = [];
      }
    }

    // Parse sizes array from JSON string
    if (req.body.sizes) {
      try {
        productData.sizes = JSON.parse(req.body.sizes);
      } catch (e) {
        productData.sizes = [];
      }
    }

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();

    // Populate category before sending response
    await savedProduct.populate('category', 'name');

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: error.message });

  }
}

const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const deleteProduct = (req, res) => {
  
}

const getProductByCategoryId = async (req, res) => {
  try {
    const product = await Product.find({ category: req.params.id,isActive: true });
    if (!product || product.length === 0) {
      return res.status(404).json({ message: 'Product not found1' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id }).populate('category', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found2' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductByName = async (req, res) => {
  try {
    const name = req.params.name;
     console.log(name);
    if (!name || !name.trim()) {
      const products = await Product.find({isActive: true});
      console.log('products', products);
      return res.status(200).json(products);
    }
    const regex = new RegExp(name.trim(), "i");
    console.log(regex);
    const products = await Product.find({ name: regex }).populate('category', 'name');
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'Product not found3' });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllProducts, creatProduct, updateProduct, deleteProduct, getProductByCategoryId, getProductById, getProductByName };