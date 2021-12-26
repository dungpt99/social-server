import { config } from 'dotenv';
config();

export const databaseConfig = {
  host: process.env.DB_HOST,
  type: process.env.DB_TYPE,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  synchronize: process.env.DB_SYNCHRONIZE,
};

export const appConfig = {
  port: process.env.APP_PORT,
};
