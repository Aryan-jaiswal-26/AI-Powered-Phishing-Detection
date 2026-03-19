import mongoose from 'mongoose';

const DEFAULT_MONGO_URI = 'mongodb://127.0.0.1:27017/ics';

export async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI || DEFAULT_MONGO_URI;
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000
  });
  return mongoUri;
}
