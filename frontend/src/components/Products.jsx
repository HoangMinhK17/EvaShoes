import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
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

  // Get max stock based on selected size or total stock
  const getMaxStock = () => {
    if (!product) return 0;

    // If product has sizes, get stock from selected size
    if (product.sizes && product.sizes.length > 0) {
      if (selectedSize) {
        const sizeObj = product.sizes.find(s => s.size === selectedSize);
        return sizeObj ? sizeObj.stock : 0;
      }
      return 0; // No size selected yet
    }

    // If no sizes (like bags), use default stock
    return 999;
  };

  const maxStock = getMaxStock();

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

    // Validate quantity against stock
    if (quantity > maxStock) {
      alert(`❌ Số lượng không được vượt quá ${maxStock} sản phẩm có sẵn!`);
      return;
    }

    if (maxStock === 0) {
      alert('❌ Sản phẩm này hiện đã hết hàng!');
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
            role="button"
            tabIndex="0"
            onClick={() => onViewDetail(product._id)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onViewDetail(product._id); }}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/220x280/E8E8E8/999999?text=${product.name}`;
            }}
          />
          {images.length > 1 && (
            <div className="image-thumbnails">
              {images.map((_, index) => (
                <button
                  key={`thumbnail-${product._id}-${index}`}
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
        <div aria-hidden="true" className="modal-overlay" onClick={() => setShowModal(false)}>
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
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value) || 1;
                        setQuantity(Math.min(Math.max(1, value), maxStock));
                      }}
                      min="1"
                      max={maxStock}
                    />
                    <button
                      onClick={() => setQuantity(Math.min(quantity + 1, maxStock))}
                      disabled={quantity >= maxStock}
                    >
                      +
                    </button>
                  </div>
                  {maxStock > 0 && (
                    <small className="stock-info-modal">Còn {maxStock} sản phẩm</small>
                  )}
                  {maxStock === 0 && (
                    <small className="stock-info-modal out-of-stock-text">Hết hàng</small>
                  )}
                </div>

                {product.isSale === false ? (
                  <div className="product-stopped-business-modal">
                    <p>Sản phẩm này đã ngừng kinh doanh</p>
                  </div>
                ) : (
                  <button
                    className="btn-add-to-cart"
                    onClick={handleAddToCart}
                  >
                    THÊM VÀO GIỎ
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number,
    sellPrice: PropTypes.number,
    imageUrl: PropTypes.arrayOf(PropTypes.string),
    colors: PropTypes.arrayOf(PropTypes.shape({
      color: PropTypes.string,
    })),
    sizes: PropTypes.arrayOf(PropTypes.shape({
      size: PropTypes.string,
      stock: PropTypes.number,
    })),
    isSale: PropTypes.bool,
    sold: PropTypes.number,
  }).isRequired,
  getImageUrl: PropTypes.func.isRequired,
  formatPrice: PropTypes.func.isRequired,
  onViewDetail: PropTypes.func.isRequired,
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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
    setSearchTerm('');
    if (selectedCategory) {
      fetchProductsByCategory(selectedCategory);
    } else {
      fetchProducts();
    }
  }, [selectedCategory]);

  const searchProducts = async (keyword) => {
    try {
      const response = await fetch(`${API_URL}/products/searchByName/${keyword}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProducts(data || []);
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm.trim()) {
        searchProducts(searchTerm);
      } else {
        if (selectedCategory) {
          fetchProductsByCategory(selectedCategory);
        } else {
          fetchProducts();
        }
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };


  return (
    <section className="products" id="products">
      <h2 className="section-title" style={{ textAlign: 'center' }}>SẢN PHẨM & XU HƯỚNG</h2>

      <div className="search-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            padding: '10px 15px',
            width: '100%',
            maxWidth: '400px',
            borderRadius: '25px',
            border: '1px solid #ddd',
            outline: 'none',
            fontSize: '16px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}
        />
      </div>

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
