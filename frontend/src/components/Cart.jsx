import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import '../styles/cart.css';

const Cart = () => {
    const { 
        cartItems, 
        removeFromCart, 
        updateQuantity, 
        getTotalPrice, 
        showCart, 
        setShowCart 
    } = useContext(CartContext);

    const totalPrice = getTotalPrice();

    return (
        <div className="cart-container">
            <button
                className="cart-toggle-btn"
                onClick={() => setShowCart(!showCart)}
            >
                <span className="cart-icon">🛒</span>
                <span className="cart-text">Giỏ hàng</span>
                {cartItems.length > 0 && (
                    <span className="cart-badge">{cartItems.length}</span>
                )}
            </button>

            {showCart && (
                <div className="cart-overlay" onClick={() => setShowCart(false)}>
                    <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="cart-header">
                            <h2>🛒 Giỏ hàng của bạn</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowCart(false)}
                                title="Đóng giỏ hàng"
                            >
                                ✕
                            </button>
                        </div>

                        {cartItems.length === 0 ? (
                            <div className="empty-cart">
                                <p className="empty-icon">🛍️</p>
                                <p>Giỏ hàng trống</p>
                                <p className="empty-hint">Thêm sản phẩm để bắt đầu mua sắm!</p>
                            </div>
                        ) : (
                            <>
                                <div className="cart-items-wrapper">
                                    <div className="cart-items">
                                        {cartItems.map((item, index) => (
                                            <div key={index} className="cart-item">
                                                <div className="item-image">
                                                    <img
                                                        src={item.product.imageUrl?.[0] || 'https://via.placeholder.com/80/E8E8E8/999999?text=No+Image'}
                                                        alt={item.product.name}
                                                        onError={(e) => e.target.src = 'https://via.placeholder.com/80/E8E8E8/999999?text=No+Image'}
                                                    />
                                                </div>
                                                <div className="item-details">
                                                    <h4>{item.product.name}</h4>
                                                    <p className="item-price">
                                                        {item.price.toLocaleString('vi-VN')} đ
                                                    </p>
                                                    {item.color && (
                                                        <p className="item-color">
                                                            <span className="label">Màu:</span> {item.color}
                                                        </p>
                                                    )}
                                                    {item.size && (
                                                        <p className="item-size">
                                                            <span className="label">Size:</span> {item.size}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="item-quantity">
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.product._id,
                                                                item.quantity - 1,
                                                                item.color,
                                                                item.size
                                                            )
                                                        }
                                                    >
                                                        −
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const newQty = parseInt(e.target.value) || 1;
                                                            if (newQty > 0) {
                                                                updateQuantity(
                                                                    item.product._id,
                                                                    newQty,
                                                                    item.color,
                                                                    item.size
                                                                );
                                                            }
                                                        }}
                                                        className="qty-input"
                                                    />
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.product._id,
                                                                item.quantity + 1,
                                                                item.color,
                                                                item.size
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div className="item-total">
                                                    {(
                                                        item.price * item.quantity
                                                    ).toLocaleString('vi-VN')} đ
                                                </div>
                                                <button
                                                    className="remove-btn"
                                                    onClick={() =>
                                                        removeFromCart(
                                                            item.product._id,
                                                            item.color,
                                                            item.size
                                                        )
                                                    }
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="cart-footer">
                                    <div className="cart-summary">
                                        <span className="summary-label">Tổng tiền:</span>
                                        <span className="summary-value">
                                            {totalPrice.toLocaleString('vi-VN')} đ
                                        </span>
                                    </div>
                                    <div className="cart-actions">
                                        <button 
                                            className="btn-checkout"
                                            onClick={() => alert('Tính năng thanh toán đang được phát triển')}
                                        >
                                            💳 Thanh toán
                                        </button>
                                        <button 
                                            className="btn-continue"
                                            onClick={() => setShowCart(false)}
                                        >
                                            Tiếp tục mua
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
