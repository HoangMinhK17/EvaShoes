import jwt from 'jsonwebtoken';

// Middleware xác thực JWT token
const auth = (req, res, next) => {
  try {
    // Lấy token từ header Authorization (format: "Bearer token")
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      // Fallback: Lấy userId từ header hoặc body (cho development)
      const userId = req.headers['x-user-id'] || req.body.userId;
      
      if (!userId) {
        return res.status(401).json({ message: 'Authorization token or User ID is required' });
      }

      req.user = { _id: userId };
      return next();
    }

    // Extract token từ "Bearer token"
    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'your-secret-key';

    // Verify token
    const decoded = jwt.verify(token, secret);
    req.user = { _id: decoded.userId, email: decoded.email, role: decoded.role };
    next();
  } catch (error) {
    // Fallback nếu JWT verify fail
    const userId = req.headers['x-user-id'] || req.body.userId;
    if (userId) {
      req.user = { _id: userId };
      return next();
    }
    
    res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

export default auth;

