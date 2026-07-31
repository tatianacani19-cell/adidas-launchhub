import { Router } from "express";

import {
    getLaunches,
    getLaunchById,
    addLaunch,
    editLaunch,
    removeLaunch,
    updateLaunchStatusController,
    migrateActivityLog,
} from "../controllers/launchController.js";

import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.get("/", getLaunches);
router.get("/:id", getLaunchById);

router.post("/", authorizeRoles("CREATOR", "ADMIN"), addLaunch);
router.put("/:id", authorizeRoles("CREATOR", "ADMIN"), editLaunch);
router.delete("/:id", authorizeRoles("CREATOR", "ADMIN"), removeLaunch);

router.put("/:id/status", authorizeRoles("APPROVER", "ADMIN"), updateLaunchStatusController);

router.post("/migrate-activity", migrateActivityLog);

export default router;
