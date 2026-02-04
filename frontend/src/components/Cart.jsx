import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import '../styles/cart.css';

const API_BASE = 'http://localhost:3001';

const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/80/E8E8E8/999999?text=No+Image';
    if (imageUrl.startsWith('/')) {
        return `${API_BASE}${imageUrl}`;
    }
    return imageUrl;
};

const Cart = () => {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        showCart,
        setShowCart
    } = useContext(CartContext);

    // State for selected items (checkbox)
    const [selectedItems, setSelectedItems] = React.useState(new Set());

    // Get max stock for a cart item
    const getMaxStock = (item) => {
        if (!item.product) return 0;

        // If product has sizes and a size was selected
        if (item.product.sizes && item.product.sizes.length > 0 && item.size) {
            const sizeObj = item.product.sizes.find(s => s.size === item.size);
            return sizeObj ? sizeObj.stock : 0;
        }

        // If no sizes (like bags), use default stock
        return 999;
    };

    // Initialize selected items when cart changes
    React.useEffect(() => {
        const newSelected = new Set();
        cartItems.forEach((item, index) => {
            const maxStock = getMaxStock(item);
            const isBusinessStopped = item.product.isSale === false;
            // Auto-select items that have stock and are still on sale
            if (maxStock > 0 && !isBusinessStopped) {
                newSelected.add(index);
            }
        });
        setSelectedItems(newSelected);
    }, [cartItems.length]); // Only re-run when cart items count changes

    // Toggle item selection
    const toggleItemSelection = (index) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedItems(newSelected);
    };

    // Calculate total price for selected items only
    const getSelectedTotalPrice = () => {
        return cartItems.reduce((total, item, index) => {
            if (selectedItems.has(index)) {
                return total + item.price * item.quantity;
            }
            return total;
        }, 0);
    };

    const selectedTotalPrice = getSelectedTotalPrice();

    const totalPrice = getTotalPrice(); // Keep this if getTotalPrice is still used elsewhere, otherwise remove.

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
                <>
                    <div
                        aria-hidden="true"
                        className="cart-overlay"
                        onClick={() => setShowCart(false)}
                    />
                    <div
                        className="cart-modal"
                    >
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
                                        {cartItems.map((item, index) => {
                                            const maxStock = getMaxStock(item);
                                            const isOutOfStock = maxStock === 0;
                                            const isBusinessStopped = item.product.isSale === false;
                                            const isSelected = selectedItems.has(index);
                                            const isDisabled = isOutOfStock || isBusinessStopped;

                                            return (
                                                <div
                                                    key={`${item.product._id}-${item.color}-${item.size}`}
                                                    className={`cart-item ${isDisabled ? 'out-of-stock-item' : ''} ${isSelected ? 'selected' : ''}`}
                                                >
                                                    <div className="item-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => toggleItemSelection(index)}
                                                            disabled={isDisabled}
                                                            title={isBusinessStopped ? 'Sản phẩm ngừng kinh doanh' : (isOutOfStock ? 'Sản phẩm hết hàng' : 'Chọn sản phẩm')}
                                                        />
                                                    </div>
                                                    <div className="item-image">
                                                        <img
                                                            src={getImageUrl(item.product.imageUrl?.[0])}
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
                                                        {(() => {
                                                            const maxStock = getMaxStock(item);
                                                            return (
                                                                <>
                                                                    {maxStock > 0 && (
                                                                        <p className="item-stock">
                                                                            <span className="label">Còn:</span> {maxStock} sản phẩm
                                                                        </p>
                                                                    )}
                                                                    {/* {maxStock === 0 && !isBusinessStopped && (
                                                                        <p className="item-stock out-of-stock">
                                                                            Hết hàng
                                                                        </p>
                                                                    )} */}
                                                                    {isBusinessStopped && (
                                                                        <p className="item-stock stopped-business">
                                                                            Ngừng kinh doanh
                                                                        </p>
                                                                    )}
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                    <div className="item-quantity">
                                                        {(() => {
                                                            const maxStock = getMaxStock(item);
                                                            return (
                                                                <>
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
                                                                        disabled={item.quantity <= 1}
                                                                    >
                                                                        −
                                                                    </button>
                                                                    <input
                                                                        type="number"
                                                                        value={item.quantity}
                                                                        onChange={(e) => {
                                                                            const newQty = Number.parseInt(e.target.value) || 1;
                                                                            if (newQty > 0 && newQty <= maxStock) {
                                                                                updateQuantity(
                                                                                    item.product._id,
                                                                                    newQty,
                                                                                    item.color,
                                                                                    item.size
                                                                                );
                                                                            } else if (newQty > maxStock) {
                                                                                alert(`Số lượng không được vượt quá ${maxStock} sản phẩm có sẵn!`);
                                                                            }
                                                                        }}
                                                                        min="1"
                                                                        max={maxStock}
                                                                        className="qty-input"
                                                                    />
                                                                    <button
                                                                        className="qty-btn"
                                                                        onClick={() => {
                                                                            if (item.quantity < maxStock) {
                                                                                updateQuantity(
                                                                                    item.product._id,
                                                                                    item.quantity + 1,
                                                                                    item.color,
                                                                                    item.size
                                                                                );
                                                                            } else {
                                                                                alert(`Số lượng không được vượt quá ${maxStock} sản phẩm có sẵn!`);
                                                                            }
                                                                        }}
                                                                        disabled={item.quantity >= maxStock}
                                                                    >
                                                                        +
                                                                    </button>
                                                                </>
                                                            );
                                                        })()}
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
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="cart-footer">
                                    <div className="cart-summary">
                                        <span className="summary-label">Tổng tiền ({selectedItems.size} sản phẩm):</span>
                                        <span className="summary-value">
                                            {selectedTotalPrice.toLocaleString('vi-VN')} đ
                                        </span>
                                    </div>
                                    <div className="cart-actions">
                                        <button
                                            className="btn-checkout"
                                            onClick={() => {
                                                if (selectedItems.size === 0) {
                                                    alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán!');
                                                } else {
                                                    alert('Tính năng thanh toán đang được phát triển');
                                                }
                                            }}
                                            disabled={selectedItems.size === 0}
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
                </>
            )}
        </div>
    );
};

export default Cart;
