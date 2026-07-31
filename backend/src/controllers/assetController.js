import path from "path";
import fs from "fs";
import Launch from "../models/Launch.js";
import { addActivityLog, ACTIVITY_ACTIONS } from "../utils/activityLog.js";

export const uploadAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file provided." });
        }

        const launch = await Launch.findById(id);
        if (!launch) {
            fs.unlinkSync(file.path);
            return res.status(404).json({ message: "Launch not found." });
        }

        const asset = {
            fileName: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            url: file.path,
            uploadedBy: req.user?.name || req.user?.id || "",
            uploadedAt: new Date(),
        };

        launch.assets.push(asset);
        await launch.save();

        await addActivityLog(launch._id, ACTIVITY_ACTIONS.ASSET_UPLOADED, `Uploaded ${file.originalname}`, req.user);

        res.status(201).json(asset);
    } catch (error) {
        console.error("Upload asset error:", error);
        if (req.file) {
            try { fs.unlinkSync(req.file.path); } catch {}
        }
        res.status(500).json({ message: "Failed to upload asset." });
    }
};

export const deleteAsset = async (req, res) => {
    try {
        const { id, assetId } = req.params;

        const launch = await Launch.findById(id);
        if (!launch) {
            return res.status(404).json({ message: "Launch not found." });
        }

        const asset = launch.assets.id(assetId);
        if (!asset) {
            return res.status(404).json({ message: "Asset not found." });
        }

        const filePath = path.join(process.cwd(), "uploads", asset.fileName);
        try { fs.unlinkSync(filePath); } catch {}

        const assetName = asset.originalName;

        launch.assets.pull(assetId);
        await launch.save();

        await addActivityLog(launch._id, ACTIVITY_ACTIONS.ASSET_DELETED, `Deleted ${assetName}`, req.user);

        res.json({ message: "Asset deleted." });
    } catch (error) {
        console.error("Delete asset error:", error);
        res.status(500).json({ message: "Failed to delete asset." });
    }
};

export const uploadProductImage = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file provided." });
        }

        const launch = await Launch.findById(id);
        if (!launch) {
            fs.unlinkSync(file.path);
            return res.status(404).json({ message: "Launch not found." });
        }

        const isReplace = !!launch.productImage?.fileName;

        if (launch.productImage?.fileName) {
            const oldFilePath = path.join(process.cwd(), "uploads", launch.productImage.fileName);
            try { fs.unlinkSync(oldFilePath); } catch {}
        }

        launch.productImage = {
            fileName: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            url: file.path,
            uploadedBy: req.user?.name || req.user?.id || "",
            uploadedAt: new Date(),
        };

        await launch.save();

        if (isReplace) {
            await addActivityLog(launch._id, ACTIVITY_ACTIONS.PRODUCT_IMAGE_REPLACED, `Replaced product image with ${file.originalname}`, req.user);
        } else {
            await addActivityLog(launch._id, ACTIVITY_ACTIONS.PRODUCT_IMAGE_UPLOADED, `Uploaded product image ${file.originalname}`, req.user);
        }

        res.status(201).json(launch.productImage);
    } catch (error) {
        console.error("Upload product image error:", error);
        if (req.file) {
            try { fs.unlinkSync(req.file.path); } catch {}
        }
        if (error.message === "Only JPG, JPEG and PNG images are allowed.") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Failed to upload product image." });
    }
};

export const deleteProductImage = async (req, res) => {
    try {
        const { id } = req.params;

        const launch = await Launch.findById(id);
        if (!launch) {
            return res.status(404).json({ message: "Launch not found." });
        }

        if (!launch.productImage?.fileName) {
            return res.status(404).json({ message: "No product image found." });
        }

        const filePath = path.join(process.cwd(), "uploads", launch.productImage.fileName);
        try { fs.unlinkSync(filePath); } catch {}

        const imageName = launch.productImage.originalName;

        launch.productImage = {
            fileName: "",
            originalName: "",
            mimeType: "",
            size: 0,
            url: "",
            uploadedBy: "",
            uploadedAt: null,
        };

        await launch.save();

        await addActivityLog(launch._id, ACTIVITY_ACTIONS.PRODUCT_IMAGE_DELETED, `Deleted product image ${imageName}`, req.user);

        res.json({ message: "Product image deleted." });
    } catch (error) {
        console.error("Delete product image error:", error);
        res.status(500).json({ message: "Failed to delete product image." });
    }
};
