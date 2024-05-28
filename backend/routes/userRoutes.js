import express from 'express';
const router = express.Router();
import { getUsers, deleteUser, updateUser } from '../controllers/User.js';
import protect from '../middleware/authMiddleware.js';

router.get('/',protect, getUsers);

router.delete('/:id', protect, deleteUser);
router.put('/:id', protect, updateUser);

export default router;
