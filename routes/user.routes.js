import express from "express";
import { getAllUser } from "../controller/user.controller.js";

const router = express.Router();

router.get('/', getAllUser);

export default router;