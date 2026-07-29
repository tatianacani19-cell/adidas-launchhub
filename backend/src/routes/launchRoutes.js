import { Router } from "express";

import {
    getLaunches,
    getLaunchById,
    addLaunch,
    editLaunch,
    removeLaunch,
    updateLaunchStatusController,
} from "../controllers/launchController.js";

import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.get("/", getLaunches);
router.get("/:id", getLaunchById);

router.post("/", authorizeRoles("CREATOR", "ADMIN"), addLaunch);
router.put("/:id", authorizeRoles("CREATOR", "ADMIN"), editLaunch);
router.delete("/:id", authorizeRoles("CREATOR", "ADMIN"), removeLaunch);

router.put("/:id/status", authorizeRoles("APPROVER", "ADMIN"), updateLaunchStatusController);

export default router;
