import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/myorders.css'; // Reusing some styles for consistency

const API_BASE = 'http://localhost:3001/api/evashoes';

const UserInfo = () => {
    const { token, isCheckingSession, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Change Password State
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (isCheckingSession) return;

        if (!token) {
            navigate('/');
            return;
        }

        fetchUserProfile();
    }, [token, navigate, isCheckingSession]);

    const fetchUserProfile = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE}/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể tải thông tin tài khoản');
            }

            const data = await response.json();
            setProfile(data);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePasswordClick = () => {
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setShowChangePasswordModal(true);
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Mật khẩu mới không khớp!');
            return;
        }

        if (!passwordData.currentPassword || !passwordData.newPassword) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        // API call logic would go here
        try {
            const response = await fetch(`${API_BASE}/change-password`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đổi mật khẩu thất bại');
            }

            alert('Đổi mật khẩu thành công!');
            setShowChangePasswordModal(false);
        } catch (err) {
            alert(err.message);
        }
    };

    if (isCheckingSession || isLoading) {
        return <div className="loading-container">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="container" style={{ marginTop: '120px', marginBottom: '50px' }}>
            <div className="profile-wrapper" style={{
                maxWidth: '600px',
                margin: '0 auto',
                padding: '30px',
                boxShadow: '0 0 15px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                backgroundColor: '#fff'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Hồ Sơ Của Tôi</h2>

                {profile && (
                    <div className="profile-info">
                        <div className="info-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>Tên người dùng:</label>
                            <div style={{ padding: '10px', background: '#f9f9f9', borderRadius: '4px', border: '1px solid #eee' }}>
                                {profile.username}
                            </div>
                        </div>

                        <div className="info-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>Email:</label>
                            <div style={{ padding: '10px', background: '#f9f9f9', borderRadius: '4px', border: '1px solid #eee' }}>
                                {profile.email}
                            </div>
                        </div>

                        <div className="info-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>Vai trò:</label>
                            <div style={{ padding: '10px', background: '#f9f9f9', borderRadius: '4px', border: '1px solid #eee' }}>
                                {profile.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                            </div>
                        </div>

                        <div className="info-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>Trạng thái tài khoản:</label>
                            <div style={{ padding: '10px', background: '#f9f9f9', borderRadius: '4px', border: '1px solid #eee' }}>
                                <span style={{ color: profile.isActive ? 'green' : 'red', fontWeight: '500' }}>
                                    {profile.isActive ? 'Đang hoạt động' : 'Đã khóa'}
                                </span>
                            </div>
                        </div>

                        <div className="profile-actions" style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                            <button
                                onClick={handleChangePasswordClick}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                Đổi Mật Khẩu
                            </button>
                            <button
                                onClick={() => navigate('/my-orders')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                Đơn Hàng Của Tôi
                            </button>
                            <button
                                onClick={logout}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                Đăng Xuất
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Change Password Modal */}
            {showChangePasswordModal && (
                <div className="modal-overlay" onClick={() => setShowChangePasswordModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h2>Đổi Mật Khẩu</h2>
                            <button className="modal-close" onClick={() => setShowChangePasswordModal(false)}>×</button>
                        </div>
                        <div className="">
                            <div style={{ marginBottom: '15px', marginLeft: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Mật khẩu hiện tại:</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    style={{ width: '80%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px', marginLeft: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Mật khẩu mới:</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    style={{ width: '80%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px', marginLeft: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Xác nhận mật khẩu mới:</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    style={{ width: '80%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                        </div>
                        <div className="modal-footer" style={{ justifyContent: 'flex-start', gap: '10px', marginLeft: '20px', marginBottom: '20px', width: '90%' }}>
                          
                            <button
                                className="btn-confirm"
                                onClick={handleSubmitChangePassword}
                                style={{ padding: '8px 15px', border: 'none', borderRadius: '4px', background: '#007bff', color: '#fff', width: '50%' }}
                            >
                                Lưu Thay Đổi
                            </button>
                              <button
                                className="btn-cancel"
                                onClick={() => setShowChangePasswordModal(false)}
                                style={{ padding: '8px 15px', border: '1px solid #ddd',width: '50%', borderRadius: '4px', background: '#fff' }}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserInfo;
