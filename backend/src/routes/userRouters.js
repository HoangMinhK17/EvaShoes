import express from 'express';
import { deleteUser, findUserByNameOrEmail, getAllUsers, getUserByToken, loginUser, registerUser, updateUser } from '../controllers/userController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get("/getusers", getAllUsers);
router.put("/updateuser/:id", updateUser);
router.delete("/deleteuser/:id", deleteUser);
router.get("/search/:keyword", findUserByNameOrEmail);
router.get("/me", auth, getUserByToken);
export default router;