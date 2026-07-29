import { Router } from "express";

import {
    getLaunches,
    getLaunchById,
    addLaunch,
    editLaunch,
    removeLaunch
} from "../controllers/launchController.js";

const router = Router();

router.get("/", getLaunches);
router.get("/:id", getLaunchById);

router.post("/", addLaunch);
router.put("/:id", editLaunch);
router.delete("/:id", removeLaunch);

export default router;