import Router from "express";
import {
    register,
    login,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
} from "../controllers/user.js";
import { validateLogin, validateRegister } from "../middlewares/validation.js";
import { auth } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
const router = Router();

router.post("/", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/:id", auth, getUser);
router.get("/", getAllUsers);
router.patch("/:id", auth, isAdmin, updateUser);
router.delete("/:id", auth, isAdmin, deleteUser);

export default router;
