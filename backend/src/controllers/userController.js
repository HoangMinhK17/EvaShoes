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
        const checkActive = user.isActive;
        if (!checkActive) {
            return res.status(403).json({ message: 'Account is inactive. Please contact support.' });
        }
        // Generate JWT token
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            secret,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isActive: user.isActive
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
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalUsers = await User.countDocuments();
        const users = await User.find({}).skip(skip).limit(limit);
        const totalPages = Math.ceil(totalUsers / limit);

        res.status(200).json({
            users,
            totalPages,
            currentPage: page,
            totalUsers
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error });
    }
}
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });

    }


};

const findUserByNameOrEmail = async (req, res) => {
    const { keyword } = req.params;

    try {
        // nếu không nhập gì -> trả tất cả users (tuỳ bạn muốn)
        if (!keyword || !keyword.trim()) {
            const users = await User.find();
            return res.status(200).json(users);
        }

        const regex = new RegExp(keyword.trim(), "i");

        const users = await User.find({
            $or: [{ username: regex }, { email: regex }],
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error searching users", error });
    }
};
const deleteUser = async (req, res) => {
};

const getUserByToken = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();
        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export { loginUser, registerUser, getAllUsers, updateUser, deleteUser, findUserByNameOrEmail, getUserByToken, changePassword };