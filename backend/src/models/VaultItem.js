import mongoose from 'mongoose';

const vaultItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    tag: {
      type: String,
      default: 'Evidence',
      trim: true
    }
  },
  {
    timestamps: { createdAt: 'storedAt', updatedAt: false }
  }
);

export const VaultItem = mongoose.model('VaultItem', vaultItemSchema);
