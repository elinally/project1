import express from "express";
import { getAds, createAd, updateAd, deleteAd } from "../controllers/AdControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/', getAds);
router.post('/', authMiddleware, createAd);
router.put('/:id', authMiddleware, updateAd);
router.delete('/:id', authMiddleware, deleteAd);

export default router;
