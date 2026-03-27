import express from 'express';
import {
  createDonationOrder,
  getAdminStats,
  getAllDonations,
  getUserDonations,
  recordDonation
} from '../controllers/donationController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, createDonationOrder);
router.post('/', protect, recordDonation);
router.get('/user', protect, getUserDonations);
router.get('/all', protect, adminOnly, getAllDonations);
router.get('/stats/admin', protect, adminOnly, getAdminStats);

export default router;

