import express from "express";
import guardiansController from "../controllers/guardiansController.js";

const router = express.Router();

router.get("/", guardiansController.getAllGuardians);
router.get("/:id", guardiansController.getGuardianById);
router.post("/", guardiansController.createGuardian);
router.put("/:id", guardiansController.updateGuardian);
router.delete("/:id", guardiansController.deleteGuardian);

export default router;
