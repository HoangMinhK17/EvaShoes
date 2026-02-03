import { useState, useEffect, useContext } from 'react';
import { CategoryContext } from '../context/CategoryContext';
import { CartContext } from '../context/CartContext';
import ProductDetail from './ProductDetail';
import '../styles/products.css';

const API_URL = 'http://localhost:3001/api/evashoes';
const API_BASE = 'http://localhost:3001';

// ProductCard component with image carousel
function ProductCard({ product, getImageUrl, formatPrice, onViewDetail }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { addToCart } = useContext(CartContext);

  const images = product.imageUrl && product.imageUrl.length > 0 
    ? product.imageUrl 
    : ['placeholder'];

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const currentImage = images[currentImageIndex];
  const imageUrl = currentImage === 'placeholder' 
    ? `https://via.placeholder.com/220x280/E8E8E8/999999?text=${product.name}`
    : getImageUrl(currentImage);

  const handleAddToCart = () => {
    // Kiểm tra xem sản phẩm có yêu cầu chọn size không
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('❌ Vui lòng chọn size!');
      return;
    }

    // Kiểm tra xem sản phẩm có yêu cầu chọn màu không
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert('❌ Vui lòng chọn màu!');
      return;
    }

    addToCart(product, quantity, selectedColor, selectedSize);
    setShowModal(false);
    setQuantity(1);
    setSelectedColor(null);
    setSelectedSize(null);
  };

  return (
    <>
      <div className="product-card">
        <div className="product-image">
          <img 
            src={imageUrl}
            alt={`${product.name} - ${currentImageIndex + 1}`}
            onClick={() => onViewDetail(product._id)}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/220x280/E8E8E8/999999?text=${product.name}`;
            }}
          />
          {images.length > 1 && (
            <div className="image-thumbnails">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => handleThumbnailClick(index)}
                  title={`Ảnh ${index + 1}`}
                ></button>
              ))}
            </div>
          )}
          {product.isSale && (
            <div className="sale-badge">SALE</div>
          )}
          <div className="product-overlay">
            <button 
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              THÊM VÀO GIỎ
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => onViewDetail(product._id)}
            >
              XEM CHI TIẾT
            </button>
          </div>
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-rating">
            <span className="stars">★★★★★</span>
            <span className="sold">({product.sold || 0} đã bán)</span>
          </div>
          <div className="product-prices">
            {product.sellPrice ? (
              <>
                <span className="price-original">{formatPrice(product.sellPrice * 0.2 + product.sellPrice)}</span>
                <span className="price-sale">{formatPrice(product.sellPrice)}</span>
              </>
            ) : (
              <span className="price">{formatPrice(product.price)}</span>
            )}
          </div>
          {product.colors && product.colors.length > 0 && (
            <div className="product-colors">
              {product.colors.map((color) => (
                <div
                  key={color.code}
                  className="color-dot"
                  style={{ backgroundColor: color.code }}
                  title={color.name}
                ></div>
              ))}
            </div>
          )}
          {product.sizes && product.sizes.length > 0 && (
            <div className="product-sizes">
              {product.sizes
                .filter((size) => size.stock > 0)
                .map((size) => (
                  <button
                    key={size.size}
                    className="size-box"
                    title={`Size ${size.size}`}
                  >
                    {size.size}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            
            <div className="modal-body">
              <div className="modal-image">
                <img 
                  src={imageUrl}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/300x400/E8E8E8/999999?text=${product.name}`;
                  }}
                />
              </div>

              <div className="modal-info">
                <h2>{product.name}</h2>
                <div className="modal-price">
                  {product.sellPrice ? (
                    <>
                      <span className="original">{formatPrice(product.sellPrice * 1.2)}</span>
                      <span className="sale">{formatPrice(product.sellPrice)}</span>
                    </>
                  ) : (
                    <span>{formatPrice(product.price)}</span>
                  )}
                </div>

                {product.colors && product.colors.length > 0 && (
                  <div className="modal-section">
                    <label>Chọn màu:</label>
                    <div className="color-options">
                      {product.colors.map((color) => (
                        <button
                          key={color.code}
                          className={`color-option ${selectedColor === color.name ? 'active' : ''}`}
                          style={{ backgroundColor: color.code }}
                          onClick={() => setSelectedColor(color.name)}
                          title={color.name}
                        >
                          {selectedColor === color.name && '✓'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div className="modal-section">
                    <label>Chọn size:</label>
                    <div className="size-options">
                      {product.sizes
                        .filter((size) => size.stock > 0)
                        .map((size) => (
                          <button
                            key={size.size}
                            className={`size-option ${selectedSize === size.size ? 'active' : ''}`}
                            onClick={() => setSelectedSize(size.size)}
                          >
                            {size.size}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                <div className="modal-section">
                  <label>Số lượng:</label>
                  <div className="quantity-selector">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <input 
                      type="number" 
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                    />
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                </div>

                <button 
                  className="btn-add-to-cart"
                  onClick={handleAddToCart}
                >
                  THÊM VÀO GIỎ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const { selectedCategory, setSelectedCategory } = useContext(CategoryContext);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products/`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const fetchProductsByCategory = async (categoryId) => {
    try {
      const response = await fetch(`${API_URL}/products/search/${categoryId}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      setProducts([]);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchProductsByCategory(selectedCategory);
    } else {
      fetchProducts();
    }
  }, [selectedCategory]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return `https://via.placeholder.com/220x280/E8E8E8/999999?text=Product`;
    // if imageUrl is relative (starts with /), build full URL
    if (imageUrl.startsWith('/')) {
      return `${API_BASE}${imageUrl}`;
    }
    // if already full URL, use as-is
    return imageUrl;
  };

  const displayProducts = products;

  const handleShowAll = () => {
    setSelectedCategory(null);
  };

  return (
    <section className="products" id="products">
      <h2  className="section-title" style={{textAlign: 'center'}}>SẢN PHẨM & XU HƯỚNG</h2>
      
      <div className="filter-tabs">
        <button 
          className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
          onClick={handleShowAll}
        >
          TẤT CẢ
        </button>
        <button className="filter-btn">MỚI NHẤT</button>
        <button className="filter-btn">BÁN CHẠY NHẤT</button>
        <button className="filter-btn">ĐƯỢC QUAN TÂM NHIỀU</button>
      </div>

      {displayProducts.length === 0 ? (
        <div className="no-data">Chưa có sản phẩm nào</div>
      ) : (
        <div className="products-grid">
          {displayProducts.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product}
              getImageUrl={getImageUrl}
              formatPrice={formatPrice}
              onViewDetail={setSelectedProductId}
            />
          ))}
        </div>
      )}

      {selectedProductId && (
        <ProductDetail 
          productId={selectedProductId} 
          onClose={() => setSelectedProductId(null)} 
        />
      )}
    </section>
  );
}
