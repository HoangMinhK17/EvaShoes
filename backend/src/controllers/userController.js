import User from "../models/Users.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        // Generate JWT token
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role }, 
            secret, 
            { expiresIn: '7d' }
        );
        
        return res.status(200).json({ 
            message: 'Login successful', 
            token, 
            user: {
                _id: user._id,
                username: user.username, 
                email: user.email, 
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({ message: 'Error during login', error: error.message });
    }
}
const registerUser = async (req, res) => {
    const { email, password, username, re_password } = req.body;
    if (password !== re_password) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashPassword, username });
    newUser.save()
        .then(() => {
            res.status(201).json({ message: 'User registered successfully' });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error registering user', error });
        });
}
export { loginUser, registerUser };