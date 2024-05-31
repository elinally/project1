import express from "express";
import { getAds, createAd, updateAd, deleteAd } from "../controllers/AdControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import { isUserActive, adOwnershipCheck } from "../middleware/verifycationCheck.js"

const router = express.Router();

router.get('/', getAds);
router.post('/', protect, isUserActive, createAd);

router.put('/:id', protect, isUserActive, adOwnershipCheck, updateAd);
router.delete('/:id', protect, isUserActive, adOwnershipCheck, deleteAd);

export default router;
