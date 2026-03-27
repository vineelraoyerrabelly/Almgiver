import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    goalAmount: {
      type: Number,
      required: true,
      min: 1
    },
    currentAmount: {
      type: Number,
      default: 0
    },
    deadline: {
      type: Date,
      required: true
    },
    image: {
      type: String,
      default: ''
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

export const Campaign = mongoose.model('Campaign', campaignSchema);
