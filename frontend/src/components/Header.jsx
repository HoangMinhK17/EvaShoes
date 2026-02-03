import '../styles/header.css';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function Header() {
  const { cartItems, openCart } = useContext(CartContext);

  return (
    <header className="header">
  

      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              <h1>EVASHOES</h1>
            </div>
            <ul className="nav-links">
              <li><a href="#home">HÀNG MỚI</a></li>
              <li><a href="#products">SẢN PHẨM</a></li>
              <li><a href="#sale">SALE</a></li>
              <li><a href="#collection">COLLECTION</a></li>
              <li><a href="#support">HỖ TRỢ</a></li>
              <li><a href="#blog">BLOG</a></li>
            </ul>
            <div className="nav-icons">
              <a href="#search">🔍</a>
              <a href="#account">👤</a>
              <a href="#wishlist">❤️</a>
              <div className="cart-icon-wrapper" onClick={openCart}>
                <a href="#cart">🛒</a>
                {cartItems.length > 0 && (
                  <span className="cart-count">{cartItems.length}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="promo-bar">
        <div className="container">
          <div className="promo-content">
            <span>📦 CHÍNH SÁCH HỖ TRỢ HẬU MẠI</span>
            <span className="divider">|</span>
            <span>🔍 TÌM KIẾM SHOWROOM GẦN BẠN</span>
            <span className="divider">|</span>
            <span>📦 TRỪ HÀNG BẠI CỦA EVASHOES</span>
          </div>
        </div>
      </div>
    </header>
  );
}
