import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  token: generateToken(user._id)
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, adminRegistrationKey } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role:
      role === 'admin' &&
      process.env.ADMIN_REGISTRATION_KEY &&
      adminRegistrationKey === process.env.ADMIN_REGISTRATION_KEY
        ? 'admin'
        : 'alumni'
  });

  res.status(201).json(userResponse(user));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  res.json(userResponse(user));
});
