import Router from "express";
import {
    register,
    login,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
} from "../controllers/user.js";

const router = Router();

router.post("/", register);
router.post("/login", login);
router.get("/:id", getUser);
router.get("/", getAllUsers);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
