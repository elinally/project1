import express from "express";
import { getAds, createAd, updateAd, deleteAd } from "../controllers/AdControllers.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/', getAds);
router.post('/', protect, createAd);
router.put('/:id', protect, updateAd);
router.delete('/:id', protect, deleteAd);

export default router;
