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

router.use(protect);

router.route('/').get(getCampaigns).post(adminOnly, createCampaign);
router
  .route('/:id')
  .get(getCampaignById)
  .put(adminOnly, updateCampaign)
  .delete(adminOnly, deleteCampaign);

export default router;
