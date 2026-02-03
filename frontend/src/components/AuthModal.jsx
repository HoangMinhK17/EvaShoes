import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '../context/AuthContext';
import '../styles/auth.css';

function AuthModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const { login, register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    let result;

    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await register(email, username, password, rePassword);
    }

    setLoading(false);

    if (result.success) {
      setMessageType('success');
      setMessage(result.message);
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setMessageType('error');
      setMessage(result.message);
    }
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setUsername('');
    setPassword('');
    setRePassword('');
    setMessage('');
  };

  return (
    <div aria-hidden="true" className="auth-modal-overlay" onClick={onClose}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose}>✕</button>

        <div className="auth-container">
          <div className="auth-header">
            <h2>{isLogin ? 'Đăng Nhập' : 'Đăng Ký'}</h2>
            <p className="auth-subtitle">
              {isLogin
                ? 'Chào mừng quay trở lại EVASHOES'
                : 'Tạo tài khoản mới để mua sắm'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            {/* Username Field - chỉ hiển thị khi register */}
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="username">Tên người dùng</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Tên người dùng"
                />
              </div>
            )}

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            {/* Re-password Field - chỉ hiển thị khi register */}
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="rePassword">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  id="rePassword"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
            )}

            {/* Message */}
            {message && (
              <div className={`auth-message ${messageType}`}>
                {messageType === 'success' ? '✓' : '✕'} {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {(() => {
                if (loading) return '⏳ Đang xử lý...';
                return isLogin ? 'Đăng Nhập' : 'Đăng Ký';
              })()}
            </button>
          </form>

          {/* Forgot Password - chỉ login */}
          {isLogin && (
            <div className="auth-forgot">
              <a href="#forgot">Quên mật khẩu?</a>
            </div>
          )}

          {/* Switch Mode */}
          <div className="auth-footer">
            <p>
              {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
              <button
                type="button"
                className="auth-switch-btn"
                onClick={handleSwitchMode}
              >
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </div>

          {/* Social Login */}
          <div className="auth-divider">
            <span>Hoặc</span>
          </div>

          <div className="auth-social">
            <button type="button" className="social-btn google">
              Google
            </button>
            <button type="button" className="social-btn facebook">
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

AuthModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AuthModal;
