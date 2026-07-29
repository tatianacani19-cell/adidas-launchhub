import { Router } from "express";
import {
    getLaunches,
    addLaunch,
    editLaunch,
    removeLaunch
} from "../controllers/launchController.js";

const router = Router();

router.get("/", getLaunches);
router.post("/", addLaunch);
router.put("/:id", editLaunch);
router.delete("/:id", removeLaunch);

export default router;