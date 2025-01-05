import dotenv from 'dotenv';

dotenv.config();

export const getEnvVar = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};
