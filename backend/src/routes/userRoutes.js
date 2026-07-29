import { Router } from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from "../controllers/userController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.use(authenticateToken);
router.use(authorizeRoles("ADMIN"));

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
