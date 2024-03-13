import { Options } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const config: { [key: string]: Options } = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.POSTGRES_URL,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    dialect: 'postgres',
    logging: false,
  },
};

export default config;
