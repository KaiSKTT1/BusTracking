import express from "express";
import studentController from "../controllers/studentController.js";
import { isAdmin, verifyToken } from "../middleware/authJwt.js";

const router = express.Router();

router.get("/", verifyToken, studentController.getAllStudents);
router.get("/:id", studentController.getStudentById);
router.post("/", studentController.createStudent);
router.put("/:id", studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);

export default router;
