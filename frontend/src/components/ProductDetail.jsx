import { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import '../styles/productDetail.css';

const API_URL = 'http://localhost:3001/api/evashoes';
const API_BASE = 'http://localhost:3001';

export default function ProductDetail({ productId, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products/searchById/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      setProduct(data);
      // Tự động chọn màu/size đầu tiên nếu có
      if (data.colors && data.colors.length > 0) {
        setSelectedColor(data.colors[0].name);
      }
      if (data.sizes && data.sizes.length > 0) {
        const availableSize = data.sizes.find(s => s.stock > 0);
        if (availableSize) {
          setSelectedSize(availableSize.size);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return `https://via.placeholder.com/400x500/E8E8E8/999999?text=Product`;
    if (imageUrl.startsWith('/')) {
      return `${API_BASE}${imageUrl}`;
    }
    return imageUrl;
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('❌ Vui lòng chọn size!');
      return;
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert('❌ Vui lòng chọn màu!');
      return;
    }

    addToCart(product, quantity, selectedColor, selectedSize);
  
    setQuantity(1);
  };

  if (loading) {
    return (
      <div className="product-detail-overlay" onClick={onClose}>
        <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
          <div className="loading">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-overlay" onClick={onClose}>
        <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
          <div className="loading">Không tìm thấy sản phẩm</div>
        </div>
      </div>
    );
  }

  const images = product.imageUrl && product.imageUrl.length > 0 
    ? product.imageUrl 
    : ['placeholder'];
  const currentImage = images[currentImageIndex];
  const imageUrl = currentImage === 'placeholder' 
    ? `https://via.placeholder.com/400x500/E8E8E8/999999?text=${product.name}`
    : getImageUrl(currentImage);

  return (
    <div className="product-detail-overlay" onClick={onClose}>
      <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="detail-close-btn" onClick={onClose}>✕</button>
        
        <div className="detail-container">
          {/* Left: Images */}
          <div className="detail-images">
            <div className="main-image">
              <img 
                src={imageUrl}
                alt={product.name}
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/400x500/E8E8E8/999999?text=${product.name}`;
                }}
              />
              {product.isSale && (
                <div className="sale-badge-detail">SALE</div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="thumbnail-list">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`thumbnail-item ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img 
                      src={index === 0 ? imageUrl : getImageUrl(images[index])}
                      alt={`Thumbnail ${index + 1}`}
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/60x80/E8E8E8/999999`;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="detail-info">
            <h1 className="detail-product-name">{product.name}</h1>
            
            <div className="detail-rating">
              <span className="stars">★★★★★</span>
              <span className="sold">({product.sold || 0} đã bán)</span>
            </div>

            <div className="detail-prices">
              {product.sellPrice ? (
                <>
                  <span className="original-price">{formatPrice(product.sellPrice * 1.2)}</span>
                  <span className="sale-price">{formatPrice(product.sellPrice)}</span>
                  <span className="discount-percent">-20%</span>
                </>
              ) : (
                <span className="price">{formatPrice(product.price)}</span>
              )}
            </div>

            {(product.description || product.productDetails) && (
              <div className="detail-description-section">
                {product.description && (
                  <div className="detail-description">
                    <h3>📝 Mô tả sản phẩm</h3>
                    <p>{product.description}</p>
                  </div>
                )}
                {product.productDetails && (
                  <div className="detail-product-specs">
                    <h3>📋 Chi tiết sản phẩm</h3>
                    <div className="product-details-content">
                      {product.productDetails.split('\n').map((line, index) => (
                        line.trim() && <p key={index}>{line}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="detail-section">
                <label className="section-label">Chọn màu sắc:</label>
                <div className="colors-container">
                  {product.colors.map((color) => (
                    <button
                      key={color.code}
                      className={`color-btn ${selectedColor === color.name ? 'active' : ''}`}
                      style={{ backgroundColor: color.code }}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                    >
                      {selectedColor === color.name && <span className="checkmark">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="detail-section">
                <label className="section-label">Chọn size:</label>
                <div className="sizes-container">
                  {product.sizes.map((size) => (
                    <button
                      key={size.size}
                      className={`size-btn ${selectedSize === size.size ? 'active' : ''} ${size.stock === 0 ? 'disabled' : ''}`}
                      onClick={() => size.stock > 0 && setSelectedSize(size.size)}
                      disabled={size.stock === 0}
                    >
                      {size.size}
                      {size.stock === 0 && <span className="out-of-stock">Hết</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="detail-section">
              <label className="section-label">Số lượng:</label>
              <div className="quantity-control">
                <button 
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  −
                </button>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="qty-input"
                />
                <button 
                  className="qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button 
              className="detail-add-to-cart-btn"
              onClick={handleAddToCart}
            >
              🛒 THÊM VÀO GIỎ HÀNG
            </button>

            {/* Additional Info */}
            <div className="detail-footer-info">
              <div className="info-item">
                <span className="icon">📦</span>
                <span>Giao hàng toàn quốc</span>
              </div>
              <div className="info-item">
                <span className="icon">🔄</span>
                <span>Đổi trả trong 30 ngày</span>
              </div>
              <div className="info-item">
                <span className="icon">✓</span>
                <span>Hàng chính hãng 100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
