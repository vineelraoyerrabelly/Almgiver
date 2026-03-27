import { College } from '../models/College.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getColleges = asyncHandler(async (req, res) => {
  const colleges = await College.find({}).sort({ name: 1 });
  res.json(colleges);
});

