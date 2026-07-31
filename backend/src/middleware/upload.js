import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configurar Cloudinary con las variables de entorno
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurar el almacenamiento directamente hacia Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "adidas-launchhub", // Carpeta donde se guardarán en Cloudinary
        resource_type: "auto",      // Soporta automáticamente imágenes, PDFs, etc.
        public_id: (req, file) => {
            // Mantenemos el uso de UUID como tenías originalmente
            const nameWithoutExt = file.originalname.split(".")[0];
            return `${Date.now()}-${nameWithoutExt}`;
        },
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Límite de 50MB
});

export default upload;
