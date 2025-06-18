import express from "express";

import {welcome, info, editFname, editLname, addArea, parkingAreas, availableSlot} from "../controllers/ownerController.js"
import {isAuthenticated} from "../controllers/authController.js"

const router = express.Router();

router.get("/welcome", isAuthenticated, welcome);
router.get("/profile/info", isAuthenticated, info);
router.post("/profile/info/editFname", isAuthenticated, editFname);
router.post("/profile/info/editLname", isAuthenticated, editLname);
router.post("/addArea", isAuthenticated, addArea);
router.get("/parkingAreas", isAuthenticated, parkingAreas);
router.get("/availableSlot", isAuthenticated, availableSlot);

export default router;