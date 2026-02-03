// Helper function để call cart API với token authorization

const API_URL = 'http://localhost:3001/api/evashoes';

export const cartAPI = {
  // Thêm sản phẩm vào giỏ
  addToCart: async (token, userId, cartData) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      // Gửi token nếu có
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userId, // ID người dùng
          ...cartData, // productId, quantity, color, size, price, totalPrice
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to cart');
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Lấy giỏ hàng
  getCart: async (token, userId) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/cart/`, {
        method: 'GET',
        headers,
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get cart');
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
