import '../styles/header.css';
import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { Link } from "react-router-dom";

export default function Header() {
  const { cartItems, openCart } = useContext(CartContext);
  const { user, logout, showAuthModal, setShowAuthModal } = useContext(AuthContext); // Use global state
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleAccountClick = (e) => {
    e.preventDefault();
    if (user) {
      setShowUserMenu(!showUserMenu);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="header">


      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              <h1>EVASHOES</h1>
            </div>
            <ul className="nav-links">
              <li><Link to="/#home">HÀNG MỚI</Link></li>
              <li><Link to="/#products">SẢN PHẨM</Link></li>
              <li><Link to="/#sale">SALE</Link></li>
              <li><Link to="/#collection">COLLECTION</Link></li>
              <li><Link to="/#support">HỖ TRỢ</Link></li>
              <li><Link to="/#blog">BLOG</Link></li>
            </ul>
            <div className="nav-icons">
              <a href="#search">🔍</a>
              <div className="account-icon-wrapper">
                <button

                  className="account-btn"
                  onClick={handleAccountClick}
                  title={user ? `${user.username}` : 'Tài khoản'}
                >
                  👤
                  {user && <span className="user-indicator"></span>}
                </button>
                {user && showUserMenu && (
                  <div className="user-menu">
                    <div className="user-menu-header">
                      <p className="user-name">{user.username}</p>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <div className="user-menu-divider"></div>
                    <Link to="/profile" className="user-menu-item">👤 Tài khoản của tôi</Link>
                    <Link to="/my-orders" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                      📦 Đơn hàng của tôi
                    </Link>
                    <div className="user-menu-divider"></div>
                    <button
                      className="user-menu-item logout-btn"
                      onClick={handleLogout}
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                )}
              </div>
              <a href="#wishlist">❤️</a>
              <button className="cart-icon-wrapper" onClick={openCart} >
                <Link to="/cart">🛒</Link>
                {cartItems.length > 0 && (
                  <span className="cart-count">{cartItems.length}</span>
                )}
              </button>
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

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </header>
  );
}
