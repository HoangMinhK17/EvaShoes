import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/myorders.css';

const API_BASE = 'http://localhost:3001/api/evashoes';

const MyOrders = () => {
    const { user, token, isCheckingSession } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelOrderId, setCancelOrderId] = useState(null);
    const [cancelReason, setCancelReason] = useState('');

    useEffect(() => {
        if (isCheckingSession) return;

        if (!user) {
            navigate('/');
            return;
        }

        fetchOrders();
    }, [user, token, navigate, isCheckingSession]);

    if (isCheckingSession) {
        return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Loading...</div>;
    }

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE}/orders/user/${user._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể tải danh sách đơn hàng');
            }

            const data = await response.json();
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelOrder = (orderId) => {
        setCancelOrderId(orderId);
        setCancelReason('');
        setShowCancelModal(true);
    };

    const handleConfirmCancel = async () => {
        if (!cancelReason.trim()) {
            alert('Vui lòng nhập lý do hủy đơn hàng!');
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/orders/updateStatus/${cancelOrderId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'cancelled',
                    cancelReason: cancelReason.trim()
                })
            });

            if (!response.ok) {
                throw new Error('Không thể hủy đơn hàng');
            }

            alert('Đơn hàng đã được hủy thành công!');
            setShowCancelModal(false);
            setCancelOrderId(null);
            setCancelReason('');
            fetchOrders(); // Refresh orders list
        } catch (err) {
            console.error('Error cancelling order:', err);
            alert('Có lỗi xảy ra khi hủy đơn hàng: ' + err.message);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'pending': { label: 'Chờ xử lý', className: 'status-pending' },
            'confirmed': { label: 'Đang xử lý', className: 'status-processing' },
            'shipped': { label: 'Đang giao', className: 'status-shipped' },
            'delivered': { label: 'Đã giao', className: 'status-delivered' },
            'cancelled': { label: 'Đã hủy', className: 'status-cancelled' }
        };

        const config = statusConfig[status] || { label: status, className: 'status-default' };
        return <span className={`status-badge ${config.className}`}>{config.label}</span>;
    };

    if (isLoading) {
        return (
            <div className="myorders-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Đang tải đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="myorders-container">
                <div className="error-state">
                    <p className="error-icon">⚠️</p>
                    <p className="error-message">{error}</p>
                    <button onClick={() => window.location.reload()} className="retry-btn">
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="myorders-container">
                <div className="empty-state">
                    <p className="empty-icon">📦</p>
                    <h2>Chưa có đơn hàng nào</h2>
                    <p>Bạn chưa đặt đơn hàng nào. Hãy khám phá sản phẩm của chúng tôi!</p>
                    <button onClick={() => navigate('/')} className="shop-now-btn">
                        Mua sắm ngay
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="myorders-container">
            <div className="myorders-header">
                <h1>Đơn hàng của tôi</h1>
                <p className="orders-count">Tổng số: {orders.length} đơn hàng</p>
            </div>

            <div className="orders-list">
                {orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <div className="order-header">
                            <div className="order-info">
                                        <h3 style={{color: 'green'}}>Đơn hàng #{order.codeOrder}</h3>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <div className="status-actions">
                                    {order.status === 'pending' && (
                                        <button
                                            className="btn-status btn-cancel" onClick={() => handleCancelOrder(order._id)}
                                        >
                                            Hủy đơn hàng
                                        </button>
                                    )}
                                </div>
                                <div className="order-status">
                                    {getStatusBadge(order.status)}

                                </div>
                            </div>
                        </div>

                        <div className="order-items">
                            <h4>Sản phẩm ({order.items.length})</h4>
                            {order.items.map((item, index) => (
                                <div key={index} className="order-item">
                                    <div className="item-details">
                                        <p className="item-name">
                                            {item.product?.name || 'Sản phẩm'}
                                        </p>
                                        <p className="item-variant">
                                            Màu: {item.color} | Size: {item.size} | SL: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="item-price">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="order-shipping">
                            <h4>Địa chỉ giao hàng</h4>


                            <p className="shipping-name">Họ tên : {order.shippingAddress.fullName}</p>

                            <p className="shipping-phone"> Số điện thoại : {order.shippingAddress.phone}</p>
                            <p className="shipping-address"> Địa chỉ :  {order.shippingAddress.address}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.city}
                            </p>
                        </div>

                        <div className="order-footer">
                            <div className="payment-method">
                                <span className="payment-label">Phương thức thanh toán:</span>
                                <span className="payment-value">
                                    {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}
                                </span>
                            </div>
                            <div className="order-total">
                                <span className="total-label">Tổng tiền:</span>
                                <span className="total-amount">{formatPrice(order.totalPrice)}</span>
                            </div>

                        </div>
                        <div className="order-date">
                            <span>Đặt vào ngày: {formatDate(order.createdAt)}</span>
                        </div>
                        {
                            order.status === 'cancelled' && (
                                <div className="order-date">
                                    <span>hủy vào ngày: {formatDate(order.cancelAt)}</span>
                                </div>
                            )
                        }
                        {
                            order.status === 'cancelled' && (

                                <div className="order-notes-section" style={{color: 'red'}}>
                                    <span>Lí do hủy: {order.cancelReason || 'Không có lý do hủy'}</span>
                                </div>
                            )
                        }
                        {
                            order.status === 'delivered' && (
                                <div className="order-date" style={{color : 'green'}}>
                                    <span>Đã nhận hàng vào :  {formatDate(order.deliveredAt)}</span>
                                </div>
                            )
                        }


                        {order.notes && (
                            <div className="order-notes">
                                <p><strong>Ghi chú:</strong> {order.notes}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Cancel Reason Modal */}
            {showCancelModal && (
                <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Hủy Đơn Hàng</h2>
                            <button className="modal-close" onClick={() => setShowCancelModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p style={{ marginBottom: '15px', color: '#666' }}>
                                Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng này:
                            </p>
                            <textarea
                                className="cancel-reason-input"
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Nhập lý do hủy đơn hàng..."
                                rows="4"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    resize: 'vertical'
                                }}
                            />
                        </div>
                        <div className="modal-footer" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                className="btn-cancel"
                                onClick={() => setShowCancelModal(false)}
                                style={{
                                    padding: '10px 20px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    background: '#fff',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Đóng
                            </button>
                            <button
                                className="btn-confirm-cancel"
                                onClick={handleConfirmCancel}
                                style={{
                                    padding: '10px 20px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    background: '#dc3545',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    marginRight: '25px',
                                }}
                            >
                                Xác Nhận Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
