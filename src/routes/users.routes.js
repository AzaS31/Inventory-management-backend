import { Router } from "express";
import * as usersController from "../api/users/users.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/", requireAuth, usersController.getUsers);
router.put("/role", requireAuth, usersController.changeRole);
router.put("/active", requireAuth, usersController.setActive);
router.delete("/:userId", requireAuth, usersController.removeUser);

export default router;
