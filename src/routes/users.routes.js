import { Router } from "express";
import * as usersController from "../api/users/users.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = Router();

router.get("/", requireAuth, requireRole("admin"), usersController.getUsers);
router.put("/role", requireAuth, requireRole("admin"), usersController.changeRole);
router.put("/active", requireAuth, requireRole("admin"), usersController.setActive);
router.post("/delete", requireAuth, requireRole("admin"), usersController.removeUser);

export default router;
