// eslint-disable-next-line
import dotenv from 'dotenv';

dotenv.config();

export const {
  MONGO_URI, PORT, MINIO_HOST, MINIO_ACCESS_KEY, MINIO_SECRET_KEY,
} = process.env;
