import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminProductDetail from './AdminProductDetail';
import AddProductModal from './AddProductModal';
import '../styles/admin.css';

export default function AdminDashboard() {
  const API_BASE = "http://localhost:3001/api/evashoes"; // sửa theo backend của bạn
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalOrders: 0,
  });
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategoryTerm, setSearchCategoryTerm] = useState('');
  const [searchProductTerm, setSearchProductTerm] = useState('');
  // User modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    isActive: true
  });

  // Category modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  // Product detail modal state
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);

  // Add Product modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'categories') {
      fetchCategories();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);


  useEffect(() => {
    if (activeTab !== "users") return;

    const delay = setTimeout(() => {
      searchUsers(searchTerm);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  useEffect(() => {
    if (activeTab !== "categories") return;

    const delay = setTimeout(() => {
      searchCategory(searchCategoryTerm);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchCategoryTerm]);
  useEffect(() => {
    if (activeTab !== "products") return;

    const delay = setTimeout(() => {
      searchProduct(searchProductTerm);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchProductTerm]);
  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setStats({
        totalProducts: 45,
        totalCategories: 8,
        totalUsers: 128,
        totalOrders: 52,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/categories/`);
      const data = await response.json();

      if (response.ok) {
        setCategories(data.categories || []);
        console.log('Fetched categories:', data.categories);
      } else {
        setError(data.message || 'Không thể tải danh sách danh mục');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };


  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/products/`);
      const data = await response.json();

      if (response.ok) {
        setProducts(Array.isArray(data) ? data : []);
        console.log('Fetched products:', data);
      } else {
        setError(data.message || 'Không thể tải danh sách sản phẩm');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };


  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/getusers/`);
      const data = await response.json();
      console.log('Fetched users:', data);
      if (response.ok) {
        // API trả về mảng trực tiếp, không phải object với property users
        setUsers(Array.isArray(data) ? data : (data.users || []));
        console.log('Set users to state:', Array.isArray(data) ? data : (data.users || []));
      } else {
        setError(data.message || 'Không thể tải danh sách người dùng');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role || 'user',
      isActive: user.isActive !== undefined ? user.isActive : true
    });
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      role: 'user',
      isActive: true
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/updateuser/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(prevUsers =>
          prevUsers.map(u => u._id === selectedUser._id ? data : u)
        );
        handleCloseModal();
        alert('Cập nhật người dùng thành công!');
      } else {
        alert(data.message || 'Không thể cập nhật người dùng');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };


  const searchUsers = async (keyword) => {
    try {
      setLoading(true);
      if (!keyword || !keyword.trim()) {
        fetchUsers();
        return;
      }
      const res = await fetch(`${API_BASE}/search/${keyword}`);
      const data = await res.json();

      setUsers(Array.isArray(data) ? data : (data.users || []));


    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };
  const searchCategory = async (keyword) => {
    try {
      setLoading(true);
      if (!keyword || !keyword.trim()) {
        fetchCategories();
        return;
      }
      const res = await fetch(`${API_BASE}/categories/search/${keyword}`);
      const data = await res.json();

      setCategories(Array.isArray(data) ? data : (data.categories || []));


    } catch (error) {
      console.error('Error searching categories:', error);
    } finally {
      setLoading(false);
    }
  };
  const searchProduct = async (keyword) => {
    try {
      setLoading(true);
      if (!keyword || !keyword.trim()) {
        fetchProducts();
        return;
      }
      const res = await fetch(`${API_BASE}/products/searchByName/${keyword}`);
      const data = await res.json();

      setProducts(Array.isArray(data) ? data : (data.products || []));


    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };
  // Category handlers
  const handleOpenCategoryModal = (category = null) => {
    if (category) {
      // Edit mode
      setSelectedCategory(category);
      setCategoryFormData({
        name: category.name,
        description: category.description || '',
        isActive: category.isActive !== undefined ? category.isActive : true
      });
    } else {
      // Create mode
      setSelectedCategory(null);
      setCategoryFormData({
        name: '',
        description: '',
        isActive: true
      });
    }
    setShowCategoryModal(true);
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setSelectedCategory(null);
    setCategoryFormData({
      name: '',
      description: '',
      isActive: true
    });
  };

  const handleCategoryFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoryFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (selectedCategory) {
        // Update existing category
        const response = await fetch(`${API_BASE}/categories/${selectedCategory._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryFormData)
        });

        const data = await response.json();

        if (response.ok) {
          setCategories(prevCategories =>
            prevCategories.map(c => c._id === selectedCategory._id ? data : c)
          );
          handleCloseCategoryModal();
          alert('Cập nhật danh mục thành công!');
        } else {
          alert(data.message || 'Không thể cập nhật danh mục');
        }
      } else {
        // Create new category
        const response = await fetch(`${API_BASE}/categories/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryFormData)
        });

        const data = await response.json();

        if (response.ok) {
          setCategories(prevCategories => [...prevCategories, data]);
          handleCloseCategoryModal();
          alert('Thêm danh mục mới thành công!');
        } else {
          alert(data.message || 'Không thể thêm danh mục');
        }
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };


  // Product detail handlers
  const handleViewProductDetail = (productId) => {
    setSelectedProductId(productId);
    setShowProductDetail(true);
  };

  const handleCloseProductDetail = () => {
    setShowProductDetail(false);
    setSelectedProductId(null);
  };

  const handleProductUpdate = (updatedProduct) => {
    // Update product in the list
    setProducts(prevProducts =>
      prevProducts.map(p => p._id === updatedProduct._id ? updatedProduct : p)
    );
  };

  // Add Product handlers
  const handleOpenAddProductModal = () => {
    setShowAddProductModal(true);
  };

  const handleCloseAddProductModal = () => {
    setShowAddProductModal(false);
  };

  const handleSaveProduct = async (formData) => {
    try {
      const response = await fetch(`${API_BASE}/products/`, {
        method: 'POST',
        // Don't set Content-Type header - browser will set it automatically with boundary for FormData
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setProducts(prevProducts => [...prevProducts, data]);
        handleCloseAddProductModal();
        alert('Thêm sản phẩm mới thành công!');
        fetchProducts(); // Refresh the product list
      } else {
        alert(data.message || 'Không thể thêm sản phẩm');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Lỗi kết nối đến server');
    }
  };


  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { id: 'overview', icon: '📊', label: 'Tổng Quan' },
    { id: 'products', icon: '👟', label: 'Quản Lí Sản Phẩm' },
    { id: 'categories', icon: '📁', label: 'Quản Lí Danh Mục' },
    { id: 'users', icon: '👥', label: 'Quản Lí Người Dùng' },
    { id: 'orders', icon: '📦', label: 'Quản Lí Đơn Hàng' },
    { id: 'analytics', icon: '📈', label: 'Phân Tích' },
    { id: 'settings', icon: '⚙️', label: 'Cài Đặt' },
  ];

  return (
    <div className="admin-dashboard">

      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>ADMIN</h2>
          <p>EVASHOES</p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">👤</div>
            <div className="user-details">
              <p className="username">{user?.username || 'Admin'}</p>
              <p className="role">Quản trị viên</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Đăng xuất
          </button>
        </div>
      </aside>


      <main className="admin-main">

        <header className="admin-header">
          <div className="header-left">
            <h1>Bảng Điều Khiển Quản Trị</h1>
            <p>Chào mừng, {user?.username || 'Admin'}!</p>
          </div>
          <div className="header-right">
            <input
              type="text"
              className="search-box"
              placeholder="🔍 Tìm kiếm..."
            />
            <button className="notification-btn">
              🔔{' '}
              <span className="badge">3</span>
            </button>
          </div>
        </header>


        <div className="admin-content">
          {activeTab === 'overview' && (
            <div className="tab-content">
              <h2>Tổng Quan</h2>


              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👟</div>
                  <div className="stat-info">
                    <p className="stat-label">Sản Phẩm</p>
                    <p className="stat-value">{stats.totalProducts}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📁</div>
                  <div className="stat-info">
                    <p className="stat-label">Danh Mục</p>
                    <p className="stat-value">{stats.totalCategories}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <p className="stat-label">Người Dùng</p>
                    <p className="stat-value">{stats.totalUsers}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-info">
                    <p className="stat-label">Đơn Hàng</p>
                    <p className="stat-value">{stats.totalOrders}</p>
                  </div>
                </div>
              </div>


              <div className="charts-section">
                <div className="chart-card">
                  <h3>Doanh Số Bán Hàng (7 ngày gần đây)</h3>
                  <div className="chart-placeholder">
                    <p>📊 Biểu đồ sẽ được hiển thị tại đây</p>
                  </div>
                </div>
                <div className="chart-card">
                  <h3>Top Sản Phẩm</h3>
                  <div className="chart-placeholder">
                    <p>📈 Danh sách sản phẩm bán chạy nhất</p>
                  </div>
                </div>
              </div>


              <div className="recent-orders">
                <h3>Đơn Hàng Gần Đây</h3>
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Khách Hàng</th>
                      <th>Tổng Tiền</th>
                      <th>Trạng Thái</th>
                      <th>Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#001</td>
                      <td>Nguyễn Văn A</td>
                      <td>1,250,000 ₫</td>
                      <td><span className="badge-success">Đã Giao</span></td>
                      <td><button className="view-btn">Xem</button></td>
                    </tr>
                    <tr>
                      <td>#002</td>
                      <td>Trần Thị B</td>
                      <td>850,000 ₫</td>
                      <td><span className="badge-pending">Đang Xử Lý</span></td>
                      <td><button className="view-btn">Xem</button></td>
                    </tr>
                    <tr>
                      <td>#003</td>
                      <td>Lê Văn C</td>
                      <td>2,100,000 ₫</td>
                      <td><span className="badge-success">Đã Giao</span></td>
                      <td><button className="view-btn">Xem</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Quản Lí Sản Phẩm</h2>
                  <input type="text" placeholder="🔍 Tìm kiếm sản phẩm..." className="search-input" value={searchProductTerm} onChange={(e) => setSearchProductTerm(e.target.value)} />
                <button className="btn-primary" onClick={handleOpenAddProductModal}>+ Thêm Sản Phẩm</button>
              </div>

              {loading && (
                <div className="loading-state">
                  <p>⏳ Đang tải danh sách sản phẩm...</p>
                </div>
              )}

              {error && (
                <div className="error-state">
                  <p>❌ {error}</p>
                  <button className="btn-retry" onClick={fetchProducts}>Thử lại</button>
                </div>
              )}

              {!loading && !error && products.length === 0 && (
                <div className="empty-state">
                  <p>📦 Chưa có sản phẩm nào</p>
                </div>
              )}

              {!loading && !error && products.length > 0 && (
                <div className="products-list">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Hình ảnh</th>
                        <th>Tên sản phẩm</th>
                        <th>Danh mục</th>
                        <th>Giá</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id}>
                          <td>
                            <div className="product-image-cell">
                              <img
                                src={product.imageUrl && product.imageUrl[0]
                                  ? (product.imageUrl[0].startsWith('/')
                                    ? `http://localhost:3001${product.imageUrl[0]}`
                                    : product.imageUrl[0])
                                  : 'https://via.placeholder.com/60x60/E8E8E8/999999?text=No+Image'
                                }
                                alt={product.name}
                                className="product-thumbnail"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/60x60/E8E8E8/999999?text=No+Image';
                                }}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="product-name-cell">
                              <strong>{product.name}</strong>
                            </div>
                          </td>
                          <td>
                            <span className="product-category">{product.category?.name || 'N/A'}</span>
                          </td>
                          <td>
                            <div className="product-price-cell">
                              {product.sellPrice ? (
                                <>
                                  <span className="price-sale">{product.sellPrice.toLocaleString('vi-VN')}₫</span>
                                  <span className="price-original">{product.price.toLocaleString('vi-VN')}₫</span>
                                </>
                              ) : (
                                <span className="price-normal">{product.price.toLocaleString('vi-VN')}₫</span>
                              )}
                            </div>
                          </td>

                          <td>
                            <span className={product.isActive ? 'badge-success' : 'badge-inactive'}>
                              {product.isActive ? 'Hoạt động' : 'Không hoạt động'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn-view" title="Xem chi tiết" onClick={() => handleViewProductDetail(product._id)}>👁️</button>
                              <button className="btn-edit" title="Chỉnh sửa">✏️</button>
                              <button className="btn-delete" title="Xóa">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Quản Lí Danh Mục</h2>
                <input type="text" placeholder="🔍 Tìm kiếm doanh mục..." className="search-input" value={searchCategoryTerm} onChange={(e) => setSearchCategoryTerm(e.target.value)} />
                <button className="btn-primary" onClick={() => handleOpenCategoryModal()}>+ Thêm Danh Mục</button>

              </div>

              {loading && (
                <div className="loading-state">
                  <p>⏳ Đang tải danh sách danh mục...</p>
                </div>
              )}

              {error && (
                <div className="error-state">
                  <p>❌ {error}</p>
                  <button className="btn-retry" onClick={fetchCategories}>Thử lại</button>
                </div>
              )}

              {!loading && !error && categories.length === 0 && (
                <div className="empty-state">
                  <p>📁 Chưa có danh mục nào</p>
                </div>
              )}

              {!loading && !error && categories.length > 0 && (
                <div className="categories-list">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Tên Danh Mục</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => (
                        <tr key={category._id}>
                          <td>
                            <div className="category-name">
                              <strong>{category.name}</strong>
                            </div>
                          </td>

                          <td>
                            <span className={category.isActive ? 'badge-success' : 'badge-inactive'}>
                              {category.isActive ? 'Hoạt động' : 'Không hoạt động'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn-edit" title="Chỉnh sửa" onClick={() => handleOpenCategoryModal(category)}>✏️</button>
                              <button className="btn-delete" title="Xóa">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Quản Lí Người Dùng</h2>
                <input type="text" placeholder="🔍 Tìm kiếm người dùng..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>

              {loading && (
                <div className="loading-state">
                  <p>⏳ Đang tải danh sách người dùng...</p>
                </div>
              )}

              {error && (
                <div className="error-state">
                  <p>❌ {error}</p>
                  <button className="btn-retry" onClick={fetchUsers}>Thử lại</button>
                </div>
              )}

              {!loading && !error && users.length === 0 && (
                <div className="empty-state">
                  <p>👥 Chưa có người dùng nào</p>
                </div>
              )}

              {!loading && !error && users.length > 0 && (
                <div className="users-list">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Tên Người Dùng</th>
                        <th>Email</th>
                        <th>Vai Trò</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td>
                            <div className="user-name">
                              <strong>{user.username}</strong>
                            </div>
                          </td>
                          <td>
                            <div className="user-email">
                              {user.email}
                            </div>
                          </td>
                          <td>
                            <span className={user.role == "admin" ? 'badge-admin' : 'badge-user'}>
                              {user.role == "admin" ? 'Quản trị viên' : 'Người dùng'}
                            </span>
                          </td>
                          <td>
                            <span className={user.isActive ? 'badge-success' : 'badge-inactive'}>
                              {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn-edit" title="Chỉnh sửa" onClick={() => handleEditUser(user)}>✏️</button>
                              <button className="btn-delete" title="Xóa">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Quản Lí Đơn Hàng</h2>
                <select className="filter-select">
                  <option>Tất Cả Trạng Thái</option>
                  <option>Đã Giao</option>
                  <option>Đang Xử Lý</option>
                  <option>Chờ Xác Nhận</option>
                </select>
              </div>
              <div className="placeholder-content">
                <p>📦 Danh sách đơn hàng sẽ được hiển thị tại đây</p>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="tab-content">
              <h2>Phân Tích & Báo Cáo</h2>
              <div className="placeholder-content">
                <p>📈 Các biểu đồ phân tích sẽ được hiển thị tại đây</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="tab-content">
              <h2>Cài Đặt Hệ Thống</h2>
              <div className="placeholder-content">
                <p>⚙️ Cài đặt hệ thống sẽ được hiển thị tại đây</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {showEditModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chỉnh Sửa Người Dùng</h2>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>

            <form onSubmit={handleUpdateUser} className="modal-form">
              <div className="form-group">
                <label htmlFor="username">Tên Người Dùng</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input readOnly
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Vai Trò</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="form-select"
                >
                  <option value="user">Người dùng</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleFormChange}
                  />
                  <span>Tài khoản hoạt động</span>
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="modal-overlay" onClick={handleCloseCategoryModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}</h2>
              <button className="modal-close" onClick={handleCloseCategoryModal}>×</button>
            </div>

            <form onSubmit={handleSaveCategory} className="modal-form">
              <div className="form-group">
                <label htmlFor="category-name">Tên Danh Mục *</label>
                <input
                  type="text"
                  id="category-name"
                  name="name"
                  value={categoryFormData.name}
                  onChange={handleCategoryFormChange}
                  required
                  className="form-input"
                  placeholder="Nhập tên danh mục"
                />
              </div>


              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={categoryFormData.isActive}
                    onChange={handleCategoryFormChange}
                  />
                  <span>Danh mục hoạt động</span>
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={handleCloseCategoryModal}>
                  Hủy
                </button>
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? 'Đang lưu...' : (selectedCategory ? 'Cập nhật' : 'Thêm mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {showProductDetail && selectedProductId && (
        <AdminProductDetail
          productId={selectedProductId}
          onClose={handleCloseProductDetail}
          onUpdate={handleProductUpdate}
        />
      )}

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={showAddProductModal}
        onClose={handleCloseAddProductModal}
        onSave={handleSaveProduct}
        categories={categories}
      />
    </div>
  );
}

