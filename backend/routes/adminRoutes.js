import express from "express";

import {isAuthenticated} from "../controllers/authController.js"

import { welcome , ownerInfo , ownerAreas , areaActiveBookings , areaBookingHistory } from "../controllers/adminControllers.js"

const router = express.Router();

router.get("/welcome", isAuthenticated, welcome);
router.get("/ownerInfo", isAuthenticated, ownerInfo);
router.get("/ownerAreas", isAuthenticated, ownerAreas);
router.get("/areaActiveBookings", isAuthenticated, areaActiveBookings);
router.get("/areaBookingHistory", isAuthenticated, areaBookingHistory);

export default router;