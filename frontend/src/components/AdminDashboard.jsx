import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/admin.css';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    // Fetch stats từ API
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Placeholder - thay bằng API thực
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
      {/* Sidebar */}
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

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
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

        {/* Content */}
        <div className="admin-content">
          {activeTab === 'overview' && (
            <div className="tab-content">
              <h2>Tổng Quan</h2>
              
              {/* Stats Cards */}
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

              {/* Charts Section */}
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

              {/* Recent Orders */}
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
                <button className="btn-primary">+ Thêm Sản Phẩm</button>
              </div>
              <div className="placeholder-content">
                <p>📦 Danh sách sản phẩm sẽ được hiển thị tại đây</p>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Quản Lí Danh Mục</h2>
                <button className="btn-primary">+ Thêm Danh Mục</button>
              </div>
              <div className="placeholder-content">
                <p>📁 Danh sách danh mục sẽ được hiển thị tại đây</p>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Quản Lí Người Dùng</h2>
                <input type="text" placeholder="🔍 Tìm kiếm người dùng..." className="search-input" />
              </div>
              <div className="placeholder-content">
                <p>👥 Danh sách người dùng sẽ được hiển thị tại đây</p>
              </div>
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
    </div>
  );
}
