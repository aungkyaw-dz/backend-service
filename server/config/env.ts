import dotenv from 'dotenv';
dotenv.config();

export default {
    RUNNING_PORT: parseInt(process.env.PORT || '3001'),
    NODE_ENV: process.env.NODE_ENV,
    MYSQLDB: {
      HOST: process.env.DB_HOST || 'localhost',
      DATABASE_NAME: process.env.DB_NAME || 'the_urban_tech',
      USERNAME: process.env.DB_USERNAME || 'root',
      PASSWORD: process.env.DB_PASSWORD || 'admin123',
    },
    IMAGEKIT: {
      PUBLIC: process.env.IMAGEKIT_PUBLIC ,
      PRIVATE: process.env.IMAGEKIT_PRIVATE ,
      ENDPOINT: process.env.IMAGEKIT_ENDPOINT ,
    },
    JWT: {
      ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
      ISSUER: process.env.JWT_ISSUER,
      REFRESH_TOKEN: process.env.JWT_REFRESH_SECRET,
      EXPIRES_IN: process.env.JWT_EXPIRES_IN
    }
  };
  