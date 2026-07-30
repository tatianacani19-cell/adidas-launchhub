import { Router } from "express";
import { uploadAsset, deleteAsset, uploadProductImage, deleteProductImage } from "../controllers/assetController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import productImageUpload from "../middleware/productImageUpload.js";

const router = Router({ mergeParams: true });

router.use(authenticateToken);

router.post("/", authorizeRoles("ADMIN", "CREATOR"), upload.single("file"), (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
}, uploadAsset);

router.delete("/:assetId", authorizeRoles("ADMIN", "CREATOR"), deleteAsset);

router.post("/product-image", authorizeRoles("ADMIN", "CREATOR"), productImageUpload.single("file"), (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
}, uploadProductImage);

router.delete("/product-image", authorizeRoles("ADMIN", "CREATOR"), deleteProductImage);

import multer from "multer";

export default router;
