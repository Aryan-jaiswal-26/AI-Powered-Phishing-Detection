import mongoose from 'mongoose';

const historyEntrySchema = new mongoose.Schema(
  {
    result: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const HistoryEntry = mongoose.model('HistoryEntry', historyEntrySchema);
