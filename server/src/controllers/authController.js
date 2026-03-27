import crypto from 'crypto';
import { College } from '../models/College.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  college: user.college,
  token: generateToken(user._id)
});

export const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    collegeName,
    adminRegistrationKey
  } = req.body;

  if (!name || !email || !password || !collegeName) {
    res.status(400);
    throw new Error('Please provide name, email, password, and college name');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const normalizedCollegeName = collegeName.trim();
  const slug = slugify(normalizedCollegeName);

  let college = await College.findOne({ slug });
  if (!college) {
    college = await College.create({
      name: normalizedCollegeName,
      slug
    });
  }

  if (
    role === 'admin' &&
    (!process.env.ADMIN_REGISTRATION_KEY ||
      adminRegistrationKey !== process.env.ADMIN_REGISTRATION_KEY)
  ) {
    res.status(403);
    throw new Error('Invalid admin registration key');
  }

  const user = await User.create({
    name,
    email,
    password,
    college: college._id,
    role: role === 'student' || role === 'admin' ? role : 'alumni'
  });

  const populatedUser = await User.findById(user._id)
    .select('-password')
    .populate('college', 'name slug');

  res.status(201).json(userResponse(populatedUser));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate('college', 'name slug');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  res.json(userResponse(user));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const user = await User.findOne({ email }).populate('college', 'name slug');

  if (!user) {
    res.status(404);
    throw new Error('No account found for this email');
  }

  const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase();
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  res.json({
    message: 'Reset code generated successfully',
    resetToken
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, resetToken, newPassword } = req.body;

  if (!email || !resetToken || !newPassword) {
    res.status(400);
    throw new Error('Email, reset code, and new password are required');
  }

  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const user = await User.findOne({
    email,
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() }
  }).populate('college', 'name slug');

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset code');
  }

  user.password = newPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  res.json({
    message: 'Password reset successful',
    user: userResponse(user)
  });
});
