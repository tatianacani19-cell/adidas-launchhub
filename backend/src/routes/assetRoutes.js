import { Router } from "express";
import { uploadAsset, deleteAsset } from "../controllers/assetController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = Router({ mergeParams: true });

router.use(authenticateToken);

router.post("/", authorizeRoles("ADMIN", "CREATOR"), upload.single("file"), uploadAsset);
router.delete("/:assetId", authorizeRoles("ADMIN", "CREATOR"), deleteAsset);

export default router;
