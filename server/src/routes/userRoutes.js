import express from 'express';
import {
  getProfile,
  getUsers,
  updateProfile
} from '../controllers/userController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile').get(protect, getProfile).put(protect, updateProfile);
router.get('/', protect, adminOnly, getUsers);

export default router;

