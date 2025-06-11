import express from "express";

import {test, test1} from "../controllers/userController.js"

const router = express.Router();

//in server we are using this for /test so -> localhost:3000/test/ will lead to this
router.get("/", test);

//localhost:3000/test/one
router.get("/one", test1);

/*
router.post("/signup", protectSignupMiddleware, async (req, res) => {
  // Handle signup logic (e.g., insert user into DB)
  res.status(200).json({ message: "Signup successful" });
});
*/

export default router;