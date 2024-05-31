import express from 'express';
const router = express.Router();
import { getUsers, deleteUser, updateUser } from '../controllers/User.js';
import { protect, admin, permissionCheck } from '../middleware/authMiddleware.js';

router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, permissionCheck, deleteUser);
router.put('/:id', protect, permissionCheck, updateUser);

export default router;
