import express from "express";

import {welcome, myVehicles, addVehicle, deleteVehicle, info, editFname, editLname} from "../controllers/customerController.js"
import {isAuthenticated} from "../controllers/authController.js"

const router = express.Router();

router.get("/welcome", isAuthenticated, welcome);
router.get("/profile/myVehicles", isAuthenticated, myVehicles);
router.post("/profile/myVehicles/add", isAuthenticated, addVehicle);
router.post("/profile/myVehicles/delete", isAuthenticated, deleteVehicle);
router.get("/profile/info", isAuthenticated, info);
router.post("/profile/info/editFname", isAuthenticated, editFname);
router.post("/profile/info/editLname", isAuthenticated, editLname);

export default router;