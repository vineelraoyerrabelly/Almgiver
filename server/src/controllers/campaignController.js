import { Campaign } from '../models/Campaign.js';
import { Donation } from '../models/Donation.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCampaigns = asyncHandler(async (req, res) => {
  const { search = '', status = 'all' } = req.query;
  const filter = {
    college: req.user.college._id
  };

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
    .populate('college', 'name slug')
    .sort({ createdAt: -1 });

  res.json(campaigns);
});

export const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('college', 'name slug');

  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  if (String(campaign.college._id) !== String(req.user.college._id)) {
    res.status(403);
    throw new Error('You can only view campaigns from your college');
  }

  const donors = await Donation.find({ campaignId: campaign._id })
    .sort({ createdAt: -1 })
    .limit(8)
    .select('amount donorName donorRole donorCollegeName createdAt');

  res.json({ ...campaign.toObject(), recentDonations: donors });
});

export const createCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.create({
    ...req.body,
    college: req.user.college._id,
    createdBy: req.user._id
  });

  const populatedCampaign = await Campaign.findById(campaign._id)
    .populate('createdBy', 'name email')
    .populate('college', 'name slug');

  res.status(201).json(populatedCampaign);
});

export const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  if (String(campaign.college) !== String(req.user.college._id)) {
    res.status(403);
    throw new Error('You can only edit campaigns from your college');
  }

  const { college, currentAmount, createdBy, ...allowedUpdates } = req.body;
  Object.assign(campaign, allowedUpdates);
  const updated = await campaign.save();
  const populatedCampaign = await Campaign.findById(updated._id)
    .populate('createdBy', 'name email')
    .populate('college', 'name slug');
  res.json(populatedCampaign);
});

export const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  if (String(campaign.college) !== String(req.user.college._id)) {
    res.status(403);
    throw new Error('You can only delete campaigns from your college');
  }

  await campaign.deleteOne();
  res.json({ message: 'Campaign deleted successfully' });
});
