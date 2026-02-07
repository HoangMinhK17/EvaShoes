import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import Select from 'react-select';
import '../styles/checkout.css';

const API_BASE = 'http://localhost:3001/api/evashoes';

const Checkout = () => {
    const { user, token } = useContext(AuthContext);
    const { clearCart, removeMultipleFromCart } = useContext(CartContext);
    const location = useLocation();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        ward: '',
        district: '',
        notes: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('COD');

    // Address dropdown states
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
    const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
    const [isLoadingWards, setIsLoadingWards] = useState(false);

    // Phone validation state
    const [phoneError, setPhoneError] = useState('');

    // Fetch provinces on component mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                setIsLoadingProvinces(true);
                const response = await fetch('https://provinces.open-api.vn/api/p/');
                const data = await response.json();
                setProvinces(data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            } finally {
                setIsLoadingProvinces(false);
            }
        };
        fetchProvinces();
    }, []);

    // Fetch districts when province is selected
    useEffect(() => {
        if (!selectedProvince) {
            setDistricts([]);
            return;
        }

        const fetchDistricts = async () => {
            try {
                setIsLoadingDistricts(true);
                const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`);
                const data = await response.json();
                setDistricts(data.districts || []);
            } catch (error) {
                console.error('Error fetching districts:', error);
                setDistricts([]);
            } finally {
                setIsLoadingDistricts(false);
            }
        };
        fetchDistricts();
    }, [selectedProvince]);

    // Fetch wards when district is selected
    useEffect(() => {
        if (!selectedDistrict) {
            setWards([]);
            return;
        }

        const fetchWards = async () => {
            try {
                setIsLoadingWards(true);
                const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`);
                const data = await response.json();
                setWards(data.wards || []);
            } catch (error) {
                console.error('Error fetching wards:', error);
                setWards([]);
            } finally {
                setIsLoadingWards(false);
            }
        };
        fetchWards();
    }, [selectedDistrict]);

    useEffect(() => {
        // Get items passed from Cart
        if (location.state && location.state.items) {
            setItems(location.state.items);
            const total = location.state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            setTotalPrice(total);
        } else {
            // If accessed directly without items, redirect to cart or home
            // For now, let's redirect to home
            navigate('/');
        }

        // Pre-fill form if user data exists (optional, if user model has these fields)
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.fullName || user.username || '',
                phone: user.phone || '',
                address: user.address || '',
                // City/Ward/District might be complex to pre-fill depending on data structure
            }));
        }
    }, [location.state, navigate, user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Phone validation
        if (name === 'phone') {
            // Remove any non-digit characters
            const cleanedPhone = value.replace(/\D/g, '');

            // Validate phone number
            if (cleanedPhone.length === 0) {
                setPhoneError('');
            } else if (cleanedPhone.length !== 10) {
                setPhoneError('Số điện thoại phải có đúng 10 chữ số');
            } else if (!cleanedPhone.startsWith('03') && !cleanedPhone.startsWith('09')) {
                setPhoneError('Số điện thoại phải bắt đầu bằng 03 hoặc 09');
            } else {
                setPhoneError('');
            }

            setFormData(prev => ({
                ...prev,
                [name]: cleanedPhone
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
    };

    // Handle province selection
    const handleProvinceChange = (e) => {
        const provinceCode = e.target.value;
        const provinceName = provinces.find(p => p.code === parseInt(provinceCode))?.name || '';

        setSelectedProvince(provinceCode);
        setSelectedDistrict('');
        setSelectedWard('');
        setDistricts([]);
        setWards([]);

        setFormData(prev => ({
            ...prev,
            city: provinceName,
            district: '',
            ward: ''
        }));
    };

    // Handle district selection
    const handleDistrictChange = (e) => {
        const districtCode = e.target.value;
        const districtName = districts.find(d => d.code === parseInt(districtCode))?.name || '';

        setSelectedDistrict(districtCode);
        setSelectedWard('');
        setWards([]);

        setFormData(prev => ({
            ...prev,
            district: districtName,
            ward: ''
        }));
    };

    // Handle ward selection
    const handleWardChange = (e) => {
        const wardCode = e.target.value;
        const wardName = wards.find(w => w.code === parseInt(wardCode))?.name || '';

        setSelectedWard(wardCode);

        setFormData(prev => ({
            ...prev,
            ward: wardName
        }));
    };

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return 'https://via.placeholder.com/60/E8E8E8/999999?text=No+Image';
        if (imageUrl.startsWith('/')) {
            return `http://localhost:3001${imageUrl}`;
        }
        return imageUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.phone || !formData.address) {
            alert('Vui lòng điền đầy đủ thông tin giao hàng!');
            return;
        }

        if (items.length === 0) {
            alert('Không có sản phẩm nào để thanh toán!');
            return;
        }

        // Validate phone number before submitting
        if (!formData.phone || formData.phone.length !== 10) {
            alert('Vui lòng nhập số điện thoại hợp lệ (10 chữ số)');
            return;
        }

        if (!formData.phone.startsWith('03') && !formData.phone.startsWith('09')) {
            alert('Số điện thoại phải bắt đầu bằng 03 hoặc 09');
            return;
        }

        try {
            setIsPlacingOrder(true);

            // Generate unique order code
            const timestamp = Date.now();
            const randomNum = Math.floor(Math.random() * 10000);
            const codeOrder = `ORD${timestamp}${randomNum}`;

            const orderData = {
                user: user._id,
                items: items.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.price,
                    color: item.color,
                    size: item.size
                })),
                totalPrice: totalPrice,
                paymentMethod: paymentMethod,
                shippingAddress: {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    ward: formData.ward,
                    district: formData.district
                },
                notes: formData.notes,
                codeOrder: codeOrder
            };

            const response = await fetch(`${API_BASE}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Đặt hàng thất bại');
            }

            const data = await response.json();

            alert('Đặt hàng thành công! Mã đơn hàng: ' + data._id);

            // Clear cart logic needs to be smart: 
            // If we checked out ALL items, clear entire cart.
            // If we checked out specific items, remove only those.
            // For now, assuming Cart passed selected items, we should remove them from CartContext.
            // But CartContext.clearCart clears everything. 
            // If the user selected everything, clearCart is fine.
            // If partial, we need a way to remove multiple items. 
            // Let's rely on Cart component to handle clearing selected items OR update CartContext to support bulk remove.
            // SIMPLE APPROACH for now: If we came from Cart with selected items, we should ideally tell CartContext to remove them.
            // Since CartContext only has removeFromCart(one by one) or clearCart(all),
            // We can iterate and remove if partial, or clearCart if it's all.
            // However, iterating might be slow/complex with multiple API calls.
            // BETTER: The backend `createOrder` doesn't automatically clear cart.
            // We should probably call an endpoint to remove these items from cart.
            // Or just use `removeFromCart` loop for now.

            // For this implementation, let's assume we clear the whole cart if the user selected everything (common case)
            // Or we just iterate.

            for (const item of items) {
                // This might trigger multiple re-renders/API calls.
                // ideally we add a bulkRemove to CartContext.
                // For now, let's just clearCart() as a simplification if the user is buying their cart.
                // Note: This might clear items they didn't select if they only selected some.
                // TODO: Refactor CartContext for bulk remove.
                // For now, I will use clearCart() but warn user or just leave it. 
                // Actually, let's try to remove them one by one, expecting it to be fast enough for a few items.
                // console.log("Removing", item.product._id);
            }
            // Actually, let's just clear the items we bought.
            // But wait, the context `removeFromCart` expects (productId, color, size).
            items.forEach(item => {
                // We can't access removeFromCart directly here in a clean way without triggering updates.
                // Actually we can.
            });

            // Since we implemented the logic in Cart.jsx to pass items, maybe we should let Cart.jsx handle removal?
            // No, navigation happened. Cart.jsx is unmounted (or at least hidden if using modal, but we navigated away).

            // Let's implement a loop to remove purchased items.
            /*
            items.forEach(item => {
                removeFromCart(item.product._id, item.color, item.size);
            });
            */
            // Because `removeFromCart` updates state and syncs to DB, it might be race-condition prone if called in loop.
            // Safe bet: Clear Cart if it was a full buy, or just alert for now.

            // Optimization: Call a backend endpoint "remove items" or just clearCart if simple.
            // Let's assume for this task we clear the whole cart for simplicity as usually users buy all.
            // If they buy partial, it's a known limitation for this iteration.
            // Clear only purchased items from cart
            removeMultipleFromCart(items);

            navigate('/');

        } catch (error) {
            console.error('Lỗi đặt hàng:', error);
            alert('Có lỗi xảy ra: ' + error.message);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (!location.state || !location.state.items) {
        return (
            <div className="checkout-container checkout-empty">
                <p>Không có thông tin đơn hàng.</p>
                <button onClick={() => navigate('/')} className="btn-back-home">Quay lại trang chủ</button>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <h1 className="checkout-title">Thanh Toán</h1>

            <div className="checkout-content">
                {/* Left Column: Shipping & Payment */}
                <div className="checkout-left">
                    {/* Shipping Info */}
                    <section className="checkout-section">
                        <h2>📍 Thông tin giao hàng</h2>
                        <form id="checkout-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Họ và tên</label>
                                <input style={{ width: '50%' }}
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Nguyễn Văn A"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Số điện thoại *</label>
                                    <input style={{ width: '160%' }}
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`form-control ${phoneError ? 'input-error' : ''}`}
                                        placeholder="0912345678"
                                        maxLength="10"
                                        required
                                    />
                                    {phoneError && (
                                        <span className="error-message">{phoneError}</span>
                                    )}

                                </div>
                            </div>

                            <div className="form-group">
                                <label>Địa chỉ cụ thể</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Số nhà, tên đường..."
                                    required
                                />
                            </div>

                            <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Tỉnh / Thành phố *</label>
                                    <Select
                                        name="city"
                                        value={provinces.find(p => p.code === parseInt(selectedProvince)) ? {
                                            value: selectedProvince,
                                            label: provinces.find(p => p.code === parseInt(selectedProvince)).name
                                        } : null}
                                        onChange={(option) => {
                                            const event = {
                                                target: {
                                                    value: option ? option.value : ''
                                                }
                                            };
                                            handleProvinceChange(event);
                                        }}
                                        options={provinces.map(province => ({
                                            value: province.code,
                                            label: province.name
                                        }))}
                                        placeholder={isLoadingProvinces ? 'Đang tải...' : 'Tìm kiếm hoặc chọn tỉnh/thành phố...'}
                                        isDisabled={isLoadingProvinces}
                                        isLoading={isLoadingProvinces}
                                        isClearable
                                        isSearchable
                                        noOptionsMessage={() => 'Không tìm thấy'}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                    />
                                </div>

                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Quận / Huyện *</label>
                                    <Select
                                        name="district"
                                        value={districts.find(d => d.code === parseInt(selectedDistrict)) ? {
                                            value: selectedDistrict,
                                            label: districts.find(d => d.code === parseInt(selectedDistrict)).name
                                        } : null}
                                        onChange={(option) => {
                                            const event = {
                                                target: {
                                                    value: option ? option.value : ''
                                                }
                                            };
                                            handleDistrictChange(event);
                                        }}
                                        options={districts.map(district => ({
                                            value: district.code,
                                            label: district.name
                                        }))}
                                        placeholder={isLoadingDistricts ? 'Đang tải...' : 'Tìm kiếm hoặc chọn quận/huyện...'}
                                        isDisabled={!selectedProvince || isLoadingDistricts}
                                        isLoading={isLoadingDistricts}
                                        isClearable
                                        isSearchable
                                        noOptionsMessage={() => 'Không tìm thấy'}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Phường / Xã *</label>
                                <Select
                                    name="ward"
                                    value={wards.find(w => w.code === parseInt(selectedWard)) ? {
                                        value: selectedWard,
                                        label: wards.find(w => w.code === parseInt(selectedWard)).name
                                    } : null}
                                    onChange={(option) => {
                                        const event = {
                                            target: {
                                                value: option ? option.value : ''
                                            }
                                        };
                                        handleWardChange(event);
                                    }}
                                    options={wards.map(ward => ({
                                        value: ward.code,
                                        label: ward.name
                                    }))}
                                    placeholder={isLoadingWards ? 'Đang tải...' : 'Tìm kiếm hoặc chọn phường/xã...'}
                                    isDisabled={!selectedDistrict || isLoadingWards}
                                    isLoading={isLoadingWards}
                                    isClearable
                                    isSearchable
                                    noOptionsMessage={() => 'Không tìm thấy'}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>

                            <div className="form-group">
                                <label>Ghi chú đơn hàng (tùy chọn)</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    rows="3"
                                    placeholder="Ví dụ: Giao giờ hành chính..."
                                />
                            </div>
                        </form>
                    </section>

                    {/* Payment Method */}
                    <section className="checkout-section">
                        <h2>💳 Phương thức thanh toán</h2>
                        <div className="payment-methods">
                            <label className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={paymentMethod === 'COD'}
                                    onChange={() => handlePaymentMethodChange('COD')}
                                />
                                <div className="payment-label">
                                    <span className="payment-name">Thanh toán khi nhận hàng (COD)</span>
                                    <span className="payment-desc">Thanh toán bằng tiền mặt khi shipper giao hàng đến.</span>
                                </div>
                            </label>

                            <label className={`payment-option ${paymentMethod === 'banking' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="banking"
                                    checked={paymentMethod === 'banking'}
                                    onChange={() => handlePaymentMethodChange('banking')}
                                />
                                <div className="payment-label">
                                    <span className="payment-name">Chuyển khoản ngân hàng</span>
                                    <span className="payment-desc">Quét mã QR hoặc chuyển khoản theo thông tin.</span>
                                </div>
                            </label>
                        </div>
                    </section>
                </div>

                {/* Right Column: Order Summary */}
                <div className="checkout-right">
                    <section className="checkout-section">
                        <h2>📦 Đơn hàng của bạn</h2>
                        <div className="order-summary-items">
                            {items.map((item, index) => (
                                <div key={index} className="summary-item">
                                    <img
                                        src={getImageUrl(item.product.imageUrl?.[0])}
                                        alt={item.product.name}
                                    />
                                    <div className="summary-item-info">
                                        <p className="summary-item-name">{item.product.name}</p>
                                        <div className="summary-item-meta">
                                            <span>Màu: {item.color}</span> | <span>Size: {item.size}</span>
                                        </div>
                                        <div className="summary-item-meta">
                                            SL: {item.quantity} x {item.price.toLocaleString('vi-VN')} đ
                                        </div>
                                    </div>
                                    <div className="summary-item-price">
                                        {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="summary-total">
                            <div className="summary-row">
                                <span>Tạm tính</span>
                                <span>{totalPrice.toLocaleString('vi-VN')} đ</span>
                            </div>
                            <div className="summary-row">
                                <span>Phí vận chuyển</span>
                                <span>Miễn phí</span>
                            </div>
                            <div className="summary-row total">
                                <span>Tổng cộng</span>
                                <span>{totalPrice.toLocaleString('vi-VN')} đ</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            className="btn-place-order"
                            disabled={isPlacingOrder}
                        >
                            {isPlacingOrder ? 'Đang xử lý...' : 'ĐẶT HÀNG NGAY'}
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
