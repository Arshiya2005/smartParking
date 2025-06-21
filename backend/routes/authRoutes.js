import express from "express";

import { register, login, logout, gauth, ensureAuthenticated } from "../controllers/authController2.js"
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
router.get("/verify", ensureAuthenticated);


export default router;
