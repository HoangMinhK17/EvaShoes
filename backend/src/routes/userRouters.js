import express from 'express';
import { deleteUser, findUserByNameOrEmail, getAllUsers, loginUser, registerUser, updateUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get("/getusers", getAllUsers);
router.put("/updateuser/:id", updateUser);
router.delete("/deleteuser/:id", deleteUser);
router.get("/search/:keyword", findUserByNameOrEmail);
export default router;