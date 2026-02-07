import '../styles/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>EVASHOES</h4>
              <p>Gọi mua hàng</p>
              <p className="phone">1900566833</p>
              <p>Phục vụ từ thứ 2 đến thứ 7</p>
              <p>0935 856 606</p>
              <div className="social-links">
                <a href="#fb">f</a>
                <a href="#ig">📷</a>
                <a href="#tiktok">🎵</a>
                <a href="#yt">▶️</a>
              </div>
            </div>

            <div className="footer-section">
              <h4>EVASHOES</h4>
              <ul>
                <li><a href="#home">Trang chủ</a></li>
                <li><a href="#khuyen-mai">Tất cả khuyến mãi</a></li>
                <li><a href="#hot-trend">Tất cả hot trend</a></li>
                <li><a href="#chinh-sach">Chính sách độc quyền</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>HỖ TRỢ</h4>
              <ul>
                <li><a href="#shipping">Thông tin vận chuyển & Giao nhận</a></li>
                <li><a href="#return">Hướng dẫn chính sách & Ưu đãi cá nhân</a></li>
                <li><a href="#payment">Chi tiết thanh toán</a></li>
                <li><a href="#contact">Chính sách độc quyền dành riêng</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>ĐĂNG KÝ</h4>
              <p>Nhận cập nhật thông tin sản phẩm mới, thương hiệu & những xu hướng</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Nhập email của bạn" />
                <button type="submit" className="btn btn-primary">GỬI</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>&copy; 2026 EVASHOES. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
