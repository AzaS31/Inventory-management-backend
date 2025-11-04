import { Router } from "express";
import { userController } from "../api/users/userController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = Router();
router.get("/:id", userController.getUserById);
router.get("/", requireAuth, requireRole("admin"), userController.getUsers);
router.put("/role", requireAuth, requireRole("admin"), userController.changeRole);
router.put("/active", requireAuth, requireRole("admin"), userController.setActive);
router.delete("/delete", requireAuth, requireRole("admin"), userController.deleteUser);

export default router;
