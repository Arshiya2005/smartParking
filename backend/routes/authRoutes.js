import express from "express";

import { register, login, logout, gauth, } from "../controllers/authController.js"
import {protectSignupMiddleware} from "../lib/arcjet.js"

const router = express.Router();

/*
router.post("/signup", protectSignupMiddleware, async (req, res) => {
  // Handle signup logic (e.g., insert user into DB)
  res.status(200).json({ message: "Signup successful" });
});
*/

router.post("/register", protectSignupMiddleware, register);
router.get("/logout", logout);
router.post("/login", login);
router.get("/auth/google", gauth);


export default router;
