import { useState, useEffect } from 'react';
import '../styles/admin.css';

export default function AddProductModal({ isOpen, onClose, onSave, categories }) {
    const [loading, setLoading] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [productFormData, setProductFormData] = useState({
        name: '',
        price: '',
        sellPrice: '',
        description: '',
        productDetails: '',
        category: '',
        colors: [{ name: '', code: '#000000', image: '' }],
        sizes: [{ size: '', stock: '' }],
        isSale: true,
        isActive: true
    });

    useEffect(() => {
        if (!isOpen) {
            // Reset form when modal closes
            setProductFormData({
                name: '',
                price: '',
                sellPrice: '',
                description: '',
                productDetails: '',
                category: '',
                colors: [{ name: '', code: '#000000', image: '' }],
                sizes: [{ size: '', stock: '' }],
                isSale: true,
                isActive: true
            });
            setSelectedImages([]);
            setImagePreviews([]);
        }
    }, [isOpen]);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProductFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(files);

        // Create preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const removeImage = (index) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setSelectedImages(newImages);
        setImagePreviews(newPreviews);

        // Revoke the URL to free memory
        URL.revokeObjectURL(imagePreviews[index]);
    };

    const handleColorChange = (index, field, value) => {
        const newColors = [...productFormData.colors];
        newColors[index][field] = value;
        setProductFormData(prev => ({ ...prev, colors: newColors }));
    };

    const addColor = () => {
        setProductFormData(prev => ({
            ...prev,
            colors: [...prev.colors, { name: '', code: '#000000', image: '' }]
        }));
    };

    const removeColor = (index) => {
        if (productFormData.colors.length > 1) {
            const newColors = productFormData.colors.filter((_, i) => i !== index);
            setProductFormData(prev => ({ ...prev, colors: newColors }));
        }
    };

    const handleSizeChange = (index, field, value) => {
        const newSizes = [...productFormData.sizes];
        newSizes[index][field] = value;
        setProductFormData(prev => ({ ...prev, sizes: newSizes }));
    };

    const addSize = () => {
        setProductFormData(prev => ({
            ...prev,
            sizes: [...prev.sizes, { size: '', stock: '' }]
        }));
    };

    const removeSize = (index) => {
        if (productFormData.sizes.length > 1) {
            const newSizes = productFormData.sizes.filter((_, i) => i !== index);
            setProductFormData(prev => ({ ...prev, sizes: newSizes }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedImages.length === 0) {
            alert('Vui lòng chọn ít nhất một hình ảnh sản phẩm!');
            return;
        }

        setLoading(true);

        try {
            // Create FormData for file upload
            const formData = new FormData();

            // Append basic fields
            formData.append('name', productFormData.name);
            formData.append('price', productFormData.price);
            if (productFormData.sellPrice) {
                formData.append('sellPrice', productFormData.sellPrice);
            }
            formData.append('description', productFormData.description);
            formData.append('productDetails', productFormData.productDetails);
            formData.append('category', productFormData.category);
            formData.append('isSale', productFormData.isSale);
            formData.append('isActive', productFormData.isActive);

            // Find category name for folder structure
            const selectedCategory = categories.find(cat => cat._id === productFormData.category);
            const categoryFolder = selectedCategory ? selectedCategory.name.toLowerCase().replace(/\s+/g, '_') : 'other';
            formData.append('categoryFolder', categoryFolder);

            // Append images
            selectedImages.forEach((image) => {
                formData.append('images', image);
            });

            // Append colors as JSON string
            const validColors = productFormData.colors.filter(c => c.name.trim() !== '');
            formData.append('colors', JSON.stringify(validColors));

            // Append sizes as JSON string
            const validSizes = productFormData.sizes
                .filter(s => s.size !== '' && s.stock !== '')
                .map(s => ({ size: parseFloat(s.size), stock: parseInt(s.stock) }));
            formData.append('sizes', JSON.stringify(validSizes));

            await onSave(formData);

            // Clean up preview URLs
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
        } catch (error) {
            console.error('Error in form submission:', error);
            alert('Có lỗi xảy ra khi thêm sản phẩm!');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Thêm Sản Phẩm Mới</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="product-name">Tên Sản Phẩm *</label>
                            <input
                                type="text"
                                id="product-name"
                                name="name"
                                value={productFormData.name}
                                onChange={handleFormChange}
                                required
                                className="form-input"
                                placeholder="Nhập tên sản phẩm"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="product-category">Danh Mục *</label>
                            <select
                                id="product-category"
                                name="category"
                                value={productFormData.category}
                                onChange={handleFormChange}
                                required
                                className="form-select"
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="product-price">Giá Gốc (₫) *</label>
                            <input
                                type="number"
                                id="product-price"
                                name="price"
                                value={productFormData.price}
                                onChange={handleFormChange}
                                required
                                min="0"
                                className="form-input"
                                placeholder="Nhập giá gốc"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="product-sellPrice">Giá Khuyến Mãi (₫)</label>
                            <input
                                type="number"
                                id="product-sellPrice"
                                name="sellPrice"
                                value={productFormData.sellPrice}
                                onChange={handleFormChange}
                                min="0"
                                className="form-input"
                                placeholder="Nhập giá khuyến mãi (tùy chọn)"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="product-description">Mô Tả *</label>
                        <textarea
                            id="product-description"
                            name="description"
                            value={productFormData.description}
                            onChange={handleFormChange}
                            required
                            className="form-textarea"
                            placeholder="Nhập mô tả sản phẩm"
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="product-details">Chi Tiết Sản Phẩm *</label>
                        <textarea
                            id="product-details"
                            name="productDetails"
                            value={productFormData.productDetails}
                            onChange={handleFormChange}
                            required
                            className="form-textarea"
                            placeholder="Nhập chi tiết sản phẩm"
                            rows="3"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="form-group">
                        <label htmlFor="product-images">Hình Ảnh Sản Phẩm *</label>
                        <input
                            type="file"
                            id="product-images"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="form-input"
                            required={selectedImages.length === 0}
                        />
                        <small className="form-hint">Chọn nhiều ảnh (tối đa 3 ảnh, mỗi ảnh tối đa 5MB)</small>

                        {imagePreviews.length > 0 && (
                            <div className="image-preview-container">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="image-preview-item">
                                        <img src={preview} alt={`Preview ${index + 1}`} />
                                        <button
                                            type="button"
                                            className="remove-preview-btn"
                                            onClick={() => removeImage(index)}
                                            title="Xóa ảnh"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Colors */}
                    <div className="form-group">
                        <label>Màu Sắc</label>
                        {productFormData.colors.map((color, index) => (
                            <div key={index} className="dynamic-field-row color-row">
                                <input
                                    type="text"
                                    value={color.name}
                                    onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                                    className="form-input"
                                    placeholder="Tên màu (vd: Đen, Trắng)"
                                />
                                <input
                                    type="color"
                                    value={color.code}
                                    onChange={(e) => handleColorChange(index, 'code', e.target.value)}
                                    className="form-color-picker"
                                    title="Chọn mã màu"
                                />
                                {productFormData.colors.length > 1 && (
                                    <button type="button" className="btn-remove" onClick={() => removeColor(index)}>
                                        🗑️
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" className="btn-add-field" onClick={addColor}>
                            + Thêm màu
                        </button>
                    </div>

                    {/* Sizes */}
                    <div className="form-group">
                        <label>Kích Thước & Tồn Kho</label>
                        {productFormData.sizes.map((size, index) => (
                            <div key={index} className="dynamic-field-row size-row">
                                <input
                                    type="number"
                                    value={size.size}
                                    onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                                    className="form-input"
                                    placeholder="Size (vd: 38, 39, 40)"
                                    min="0"
                                />
                                <input
                                    type="number"
                                    value={size.stock}
                                    onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                                    className="form-input"
                                    placeholder="Số lượng tồn kho"
                                    min="0"
                                />
                                {productFormData.sizes.length > 1 && (
                                    <button type="button" className="btn-remove" onClick={() => removeSize(index)}>
                                        🗑️
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" className="btn-add-field" onClick={addSize}>
                            + Thêm size
                        </button>
                    </div>

                    {/* Checkboxes */}
                    <div className="form-row">
                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="isSale"
                                    checked={productFormData.isSale}
                                    onChange={handleFormChange}
                                />
                                <span>Đang bán</span>
                            </label>
                        </div>

                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={productFormData.isActive}
                                    onChange={handleFormChange}
                                />
                                <span>Sản phẩm hoạt động</span>
                            </label>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="btn-save" disabled={loading}>
                            {loading ? 'Đang lưu...' : 'Thêm sản phẩm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
