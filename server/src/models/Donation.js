import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    paymentId: {
      type: String,
      required: true
    },
    orderId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['created', 'captured', 'failed'],
      default: 'captured'
    },
    donorName: String,
    donorEmail: String
  },
  {
    timestamps: true
  }
);

export const Donation = mongoose.model('Donation', donationSchema);

