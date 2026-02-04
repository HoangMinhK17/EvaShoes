import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/adminProductDetail.css';

const API_BASE = 'http://localhost:3001/api/evashoes';

function AdminProductDetail({ productId, onClose, onUpdate }) {
    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        productDetails: '',
        price: 0,
        sellPrice: 0,
        category: '',
        colors: [],
        sizes: [],
        isActive: true
    });

    useEffect(() => {
        fetchProductDetail();
        fetchCategories();
    }, [productId]);

    const fetchProductDetail = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/products/searchById/${productId}`);
            if (!response.ok) throw new Error('Failed to fetch product');
            const data = await response.json();
            setProduct(data);
            setFormData({
                name: data.name || '',
                description: data.description || '',
                productDetails: data.productDetails || '',
                price: data.price || 0,
                sellPrice: data.sellPrice || 0,
                category: data.category?._id || '',
                colors: data.colors || [],
                sizes: data.sizes || [],
                isActive: data.isActive !== undefined ? data.isActive : true
            });
        } catch (error) {
            console.error('Error fetching product:', error);
            alert('Không thể tải thông tin sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE}/categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const response = await fetch(`${API_BASE}/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to update product');

            const updatedProduct = await response.json();
            setProduct(updatedProduct);
            setIsEditMode(false);
            alert('Cập nhật sản phẩm thành công!');

            if (onUpdate) {
                onUpdate(updatedProduct);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Không thể cập nhật sản phẩm');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                productDetails: product.productDetails || '',
                price: product.price || 0,
                sellPrice: product.sellPrice || 0,
                category: product.category?._id || '',
                colors: product.colors || [],
                sizes: product.sizes || [],
                isActive: product.isActive !== undefined ? product.isActive : true
            });
        }
        setIsEditMode(false);
    };

    // Helper functions for colors array
    const handleAddColor = () => {
        setFormData(prev => ({
            ...prev,
            colors: [...prev.colors, { name: '', code: '#000000', image: '' }]
        }));
    };

    const handleColorChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.map((color, i) =>
                i === index ? { ...color, [field]: value } : color
            )
        }));
    };

    const handleRemoveColor = (index) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.filter((_, i) => i !== index)
        }));
    };

    // Helper functions for sizes array
    const handleAddSize = () => {
        setFormData(prev => ({
            ...prev,
            sizes: [...prev.sizes, { size: 0, stock: 0 }]
        }));
    };

    const handleSizeChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.map((sizeItem, i) =>
                i === index ? { ...sizeItem, [field]: Number(value) } : sizeItem
            )
        }));
    };

    const handleRemoveSize = (index) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.filter((_, i) => i !== index)
        }));
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return 'https://via.placeholder.com/400x500/E8E8E8/999999?text=Product';
        if (imageUrl.startsWith('/')) {
            return `http://localhost:3001${imageUrl}`;
        }
        return imageUrl;
    };

    if (loading) {
        return (
            <div className="admin-product-overlay" onClick={onClose}>
                <div className="admin-product-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="loading">Đang tải...</div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="admin-product-overlay" onClick={onClose}>
                <div className="admin-product-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="loading">Không tìm thấy sản phẩm</div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-product-overlay" onClick={onClose}>
            <div className="admin-product-modal" onClick={(e) => e.stopPropagation()}>
                <button className="admin-close-btn" onClick={onClose}>✕</button>

                <div className="admin-product-header">
                    <h2>{isEditMode ? 'Chỉnh Sửa Sản Phẩm' : 'Chi Tiết Sản Phẩm'}</h2>
                    <div className="admin-header-actions">
                        {!isEditMode ? (
                            <button className="btn-edit-mode" onClick={() => setIsEditMode(true)}>
                                ✏️ Chỉnh sửa
                            </button>
                        ) : (
                            <>
                                <button className="btn-cancel-edit" onClick={handleCancel} disabled={saving}>
                                    Hủy
                                </button>
                                <button className="btn-save-edit" onClick={handleSave} disabled={saving}>
                                    {saving ? 'Đang lưu...' : '💾 Lưu'}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="admin-product-content">
                    {/* Product Image */}
                    <div className="admin-product-image">
                        <img
                            src={product.imageUrl && product.imageUrl[0] ? getImageUrl(product.imageUrl[0]) : 'https://via.placeholder.com/400x500/E8E8E8/999999?text=No+Image'}
                            alt={product.name}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x500/E8E8E8/999999?text=No+Image';
                            }}
                        />
                    </div>

                    {/* Product Info */}
                    <div className="admin-product-info">
                        <div className="admin-form-group">
                            <label>Tên sản phẩm</label>
                            {isEditMode ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="admin-input"
                                />
                            ) : (
                                <p className="admin-value">{product.name}</p>
                            )}
                        </div>

                        <div className="admin-form-group">
                            <label>Mô tả</label>
                            {isEditMode ? (
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="admin-textarea"
                                    rows="4"
                                />
                            ) : (
                                <p className="admin-value">{product.description || 'Chưa có mô tả'}</p>
                            )}
                        </div>

                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label>Giá gốc</label>
                                {isEditMode ? (
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="admin-input"
                                    />
                                ) : (
                                    <p className="admin-value">{formatPrice(product.price)}</p>
                                )}
                            </div>

                            <div className="admin-form-group">
                                <label>Giá sale</label>
                                {isEditMode ? (
                                    <input
                                        type="number"
                                        name="sellPrice"
                                        value={formData.sellPrice}
                                        onChange={handleInputChange}
                                        className="admin-input"
                                    />
                                ) : (
                                    <p className="admin-value">{product.sellPrice ? formatPrice(product.sellPrice) : 'Không có'}</p>
                                )}
                            </div>
                        </div>

                        <div className="admin-form-group">
                            <label>Danh mục</label>
                            {isEditMode ? (
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="admin-input"
                                >
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            ) : (
                                <p className="admin-value">{product.category?.name || 'N/A'}</p>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="admin-form-group">
                            <label>Chi tiết sản phẩm</label>
                            {isEditMode ? (
                                <textarea
                                    name="productDetails"
                                    value={formData.productDetails}
                                    onChange={handleInputChange}
                                    className="admin-textarea"
                                    rows="6"
                                    placeholder="Nhập chi tiết sản phẩm (mỗi dòng một thông tin)"
                                />
                            ) : (
                                <div className="admin-value product-details-text">
                                    {product.productDetails ? (
                                        product.productDetails.split('\n').map((line, index) => (
                                            line.trim() && <p key={`detail-${index}`}>{line}</p>
                                        ))
                                    ) : (
                                        <p>Chưa có chi tiết</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Colors */}
                        {/* Colors */}
                        <div className="admin-form-group">
                            <label>Màu sắc ({formData.colors.length} màu)</label>
                            {isEditMode ? (
                                <div className="admin-colors-edit">
                                    {formData.colors.map((color, index) => (
                                        <div key={`color-edit-${index}`} className="admin-color-edit-item">
                                            <input
                                                type="text"
                                                placeholder="Tên màu"
                                                value={color.name}
                                                onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                                                className="admin-input-small"
                                            />
                                            <input
                                                type="color"
                                                value={color.code}
                                                onChange={(e) => handleColorChange(index, 'code', e.target.value)}
                                                className="admin-color-picker"
                                                title="Chọn màu"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Mã màu (hex)"
                                                value={color.code}
                                                onChange={(e) => handleColorChange(index, 'code', e.target.value)}
                                                className="admin-input-small"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveColor(index)}
                                                className="btn-remove-item"
                                                title="Xóa màu"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleAddColor}
                                        className="btn-add-item"
                                    >
                                        + Thêm màu
                                    </button>
                                </div>
                            ) : (
                                product.colors && product.colors.length > 0 ? (
                                    <div className="admin-colors-list">
                                        {product.colors.map((color, index) => (
                                            <div key={`color-${index}`} className="admin-color-item">
                                                <div
                                                    className="admin-color-swatch"
                                                    style={{ backgroundColor: color.code }}
                                                    title={color.name}
                                                />
                                                <span className="admin-color-name">{color.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="admin-value">Chưa có màu sắc</p>
                                )
                            )}
                        </div>

                        {/* Sizes and Stock */}
                        <div className="admin-form-group">
                            <label>Size và Tồn kho</label>
                            {isEditMode ? (
                                <div className="admin-sizes-edit">
                                    {formData.sizes.map((sizeItem, index) => (
                                        <div key={`size-edit-${index}`} className="admin-size-edit-item">
                                            <div>
                                                <label style={{ fontSize: '11px', marginBottom: '4px', display: 'block' }}>Size</label>
                                                <input
                                                    type="number"
                                                    placeholder="Size"
                                                    value={sizeItem.size}
                                                    onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                                                    className="admin-input-small"
                                                />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '11px', marginBottom: '4px', display: 'block' }}>Số lượng</label>
                                                <input
                                                    type="number"
                                                    placeholder="Số lượng"
                                                    value={sizeItem.stock}
                                                    onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                                                    className="admin-input-small"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSize(index)}
                                                className="btn-remove-item"
                                                title="Xóa size"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleAddSize}
                                        className="btn-add-item"
                                    >
                                        + Thêm size
                                    </button>
                                </div>
                            ) : (
                                product.sizes && product.sizes.length > 0 ? (
                                    <div className="admin-sizes-list">
                                        <table className="admin-sizes-table">
                                            <thead>
                                                <tr>
                                                    <th>Size</th>
                                                    <th>Số lượng</th>
                                                    <th>Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {product.sizes.map((sizeItem, index) => (
                                                    <tr key={`size-${index}`}>
                                                        <td><strong>{sizeItem.size}</strong></td>
                                                        <td>{sizeItem.stock}</td>
                                                        <td>
                                                            <span className={`stock-status ${sizeItem.stock > 10 ? 'in-stock' : sizeItem.stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
                                                                {sizeItem.stock > 5 ? 'Còn hàng' : sizeItem.stock > 0 ? 'Sắp hết' : 'Hết hàng'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="total-stock">
                                            <strong>Tổng tồn kho:</strong> {product.sizes.reduce((sum, s) => sum + (s.stock || 0), 0)} sản phẩm
                                        </div>
                                    </div>
                                ) : (
                                    <p className="admin-value">Chưa có thông tin size</p>
                                )
                            )}
                        </div>

                        <div className="admin-form-row">
                            <div className="admin-form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleInputChange}
                                        disabled={!isEditMode}
                                    />
                                    <span>Sản phẩm hoạt động</span>
                                </label>
                            </div>


                        </div>

                        <div className="admin-product-meta">
                            <p><strong>ID:</strong> {product._id}</p>
                            <p><strong>Đã bán:</strong> {product.sold || 0} sản phẩm</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

AdminProductDetail.propTypes = {
    productId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onUpdate: PropTypes.func,
};

export default AdminProductDetail;
