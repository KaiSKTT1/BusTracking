import express from "express";
import studentController from "../../controllers/studentController.js"; // Sửa đường dẫn

const router = express.Router();

router.get("/parent/:id_ph", studentController.getStudentsByParentId);
router.get("/", studentController.getAllStudents);
router.get("/:id", studentController.getStudentById);
router.post("/", studentController.createStudent);
router.put("/:id", studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);

export default router;