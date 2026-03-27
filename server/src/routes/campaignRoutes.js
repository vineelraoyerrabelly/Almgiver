import express from 'express';
import {
  createCampaign,
  deleteCampaign,
  getCampaignById,
  getCampaigns,
  updateCampaign
} from '../controllers/campaignController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getCampaigns).post(protect, adminOnly, createCampaign);
router
  .route('/:id')
  .get(getCampaignById)
  .put(protect, adminOnly, updateCampaign)
  .delete(protect, adminOnly, deleteCampaign);

export default router;

