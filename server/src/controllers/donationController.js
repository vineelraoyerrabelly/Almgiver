import crypto from 'crypto';
import Razorpay from 'razorpay';
import { Campaign } from '../models/Campaign.js';
import { Donation } from '../models/Donation.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getRazorpayClient = () => {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  console.log('[donations] Razorpay env check', {
    hasKeyId: Boolean(RAZORPAY_KEY_ID),
    hasKeySecret: Boolean(RAZORPAY_KEY_SECRET),
    keyIdPrefix: RAZORPAY_KEY_ID ? RAZORPAY_KEY_ID.slice(0, 8) : null
  });

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return null;
  }

  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
  });
};

export const createDonationOrder = asyncHandler(async (req, res) => {
  const { campaignId, amount } = req.body;
  const razorpayClient = getRazorpayClient();
  console.log('[donations] create-order request', {
    userId: req.user?._id,
    campaignId,
    amount
  });

  if (!campaignId || !amount) {
    res.status(400);
    throw new Error('Campaign and amount are required');
  }

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  if (String(campaign.college) !== String(req.user.college._id)) {
    res.status(403);
    throw new Error('You can only donate to campaigns from your college');
  }

  if (!razorpayClient) {
    console.error('[donations] Razorpay client missing during create-order');
    res.status(500);
    throw new Error(
      'Razorpay is not configured. Please verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the backend .env file and restart the server.'
    );
  }

  let order;

  try {
    order = await razorpayClient.orders.create({
      amount: Number(amount) * 100,
      currency: 'INR',
      receipt: `almgiver_${Date.now()}`,
      notes: {
        campaignId: String(campaignId),
        userId: String(req.user._id)
      }
    });
    console.log('[donations] Razorpay order created', {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('[donations] Razorpay order creation failed', {
      message: error.message,
      statusCode: error.statusCode,
      error: error.error
    });
    res.status(error.statusCode || 500);
    throw new Error(error.error?.description || 'Razorpay order creation failed');
  }

  res.status(201).json({
    order,
    campaign,
    key: process.env.RAZORPAY_KEY_ID
  });
});

export const recordDonation = asyncHandler(async (req, res) => {
  const {
    campaignId,
    amount,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature
  } = req.body;

  if (!process.env.RAZORPAY_KEY_SECRET) {
    console.error('[donations] Missing Razorpay secret during payment verification');
    res.status(500);
    throw new Error(
      'Razorpay secret is missing. Please verify backend environment variables and restart the server.'
    );
  }

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  if (String(campaign.college) !== String(req.user.college._id)) {
    res.status(403);
    throw new Error('You can only donate to campaigns from your college');
  }

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  console.log('[donations] verifying payment', {
    userId: req.user?._id,
    campaignId,
    amount,
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signatureMatch: expected === razorpaySignature
  });

  if (expected !== razorpaySignature) {
    console.error('[donations] Payment verification failed', {
      expectedPrefix: expected.slice(0, 10),
      providedPrefix: razorpaySignature?.slice(0, 10)
    });
    res.status(400);
    throw new Error('Payment verification failed');
  }

  const donation = await Donation.create({
    userId: req.user._id,
    campaignId,
    college: req.user.college._id,
    amount,
    paymentId: razorpayPaymentId,
    orderId: razorpayOrderId,
    status: 'captured',
    donorName: req.user.name,
    donorEmail: req.user.email,
    donorRole: req.user.role,
    donorCollegeName: req.user.college.name
  });

  campaign.currentAmount += Number(amount);
  await campaign.save();
  console.log('[donations] donation recorded', {
    donationId: donation._id,
    campaignId,
    newCampaignAmount: campaign.currentAmount
  });

  res.status(201).json(donation);
});

export const getUserDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ userId: req.user._id })
    .populate('campaignId', 'title image deadline college')
    .sort({ createdAt: -1 });

  res.json(donations);
});

export const getAllDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ college: req.user.college._id })
    .populate('userId', 'name email role college')
    .populate('campaignId', 'title')
    .populate('college', 'name slug')
    .sort({ createdAt: -1 });

  res.json(donations);
});

export const getAdminStats = asyncHandler(async (req, res) => {
  const collegeId = req.user.college._id;
  const [fundsResult, donorCount, campaignCount, donationCount, userCount] =
    await Promise.all([
      Donation.aggregate([
        { $match: { college: collegeId } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Donation.distinct('userId', { college: collegeId }).then((ids) => ids.length),
      Campaign.countDocuments({ college: collegeId }),
      Donation.countDocuments({ college: collegeId }),
      User.countDocuments({ college: collegeId })
    ]);

  res.json({
    totalFunds: fundsResult[0]?.total || 0,
    totalDonors: donorCount,
    totalCampaigns: campaignCount,
    totalDonations: donationCount,
    totalUsers: userCount,
    collegeName: req.user.college.name
  });
});
