import { Campaign } from '../models/Campaign.js';
import { Donation } from '../models/Donation.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCampaigns = asyncHandler(async (req, res) => {
  const { search = '', status = 'all' } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (status === 'active') {
    filter.deadline = { $gte: new Date() };
  }

  if (status === 'closed') {
    filter.deadline = { $lt: new Date() };
  }

  const campaigns = await Campaign.find(filter)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  res.json(campaigns);
});

export const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id).populate(
    'createdBy',
    'name email'
  );

  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  const donors = await Donation.find({ campaignId: campaign._id })
    .sort({ createdAt: -1 })
    .limit(8)
    .select('amount donorName createdAt');

  res.json({ ...campaign.toObject(), recentDonations: donors });
});

export const createCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.create({
    ...req.body,
    createdBy: req.user._id
  });

  res.status(201).json(campaign);
});

export const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  Object.assign(campaign, req.body);
  const updated = await campaign.save();
  res.json(updated);
});

export const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  await campaign.deleteOne();
  res.json({ message: 'Campaign deleted successfully' });
});

