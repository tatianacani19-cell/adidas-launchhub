import { Router } from "express";
import {
    getProfile,
    updateProfile,
    changePassword,
} from "../controllers/profileController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.use(authenticateToken);

router.get("/", getProfile);
router.put("/", updateProfile);
router.put("/change-password", changePassword);

export default router;
