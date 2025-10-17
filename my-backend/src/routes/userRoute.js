import express from "express";
import userController from "../controllers/userController.js";
const router = express.Router();

router.get("/", userController.getAllUsers);
router.post("/", userController.createNewUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
