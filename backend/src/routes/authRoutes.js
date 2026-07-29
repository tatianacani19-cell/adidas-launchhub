import { Router } from "express";
import { login, me, forgotPassword, resetPassword, testEmail } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/login", login);
router.get("/me", authenticateToken, me);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/test-email", testEmail);

export default router;
