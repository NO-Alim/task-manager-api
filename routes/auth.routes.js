import express from "express";
import { loginUser, registerUser, logoutUser } from "../controller/auth.controller.js";
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);



export default router;