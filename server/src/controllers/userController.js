import { User } from '../models/User.js';
import { Donation } from '../models/Donation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';

export const getProfile = asyncHandler(async (req, res) => {
  const donationCount = await Donation.countDocuments({ userId: req.user._id });
  res.json({ ...req.user.toObject(), donationCount });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  const updated = await user.save();
  const populatedUser = await User.findById(updated._id)
    .select('-password')
    .populate('college', 'name slug');
  res.json({
    _id: populatedUser._id,
    name: populatedUser.name,
    email: populatedUser.email,
    role: populatedUser.role,
    college: populatedUser.college,
    token: generateToken(populatedUser._id)
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ college: req.user.college._id })
    .select('-password')
    .populate('college', 'name slug')
    .sort({ createdAt: -1 });
  res.json(users);
});
