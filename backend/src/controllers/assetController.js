import path from "path";
import fs from "fs";
import Launch from "../models/Launch.js";

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
            url: `/uploads/${file.filename}`,
            uploadedBy: req.user?.name || req.user?.id || "",
            uploadedAt: new Date(),
        };

        launch.assets.push(asset);
        await launch.save();

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

        launch.assets.pull(assetId);
        await launch.save();

        res.json({ message: "Asset deleted." });
    } catch (error) {
        console.error("Delete asset error:", error);
        res.status(500).json({ message: "Failed to delete asset." });
    }
};
