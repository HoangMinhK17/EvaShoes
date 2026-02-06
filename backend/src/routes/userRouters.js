import express from 'express';
import { deleteUser, findUserByNameOrEmail, getAllUsers, getUserByToken, loginUser, registerUser, updateUser, changePassword } from '../controllers/userController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get("/getusers", getAllUsers);
router.put("/updateuser/:id", updateUser); // User update (e.g., username)
router.delete("/deleteuser/:id", deleteUser);
router.get("/search/:keyword", findUserByNameOrEmail);
router.get("/me", auth, getUserByToken);
router.put("/change-password", auth, changePassword); // Change password

export default router;