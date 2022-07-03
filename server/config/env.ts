import dotenv from 'dotenv';
dotenv.config();

export default {
    RUNNING_PORT: parseInt(process.env.PORT || '3001'),
    NODE_ENV: process.env.NODE_ENV,
    MYSQLDB: {
      HOST: process.env.DB_HOST || 'us-cdbr-east-05.cleardb.net',
      DATABASE_NAME: process.env.DB_NAME || 'heroku_12826af6ab28a33',
      USERNAME: process.env.DB_USERNAME || 'b5117301bb5162',
      PASSWORD: process.env.DB_PASSWORD || 'ee5cbe3f',
    },
    IMAGEKIT: {
      PUBLIC: process.env.IMAGEKIT_PUBLIC ||"public_Gy4558uOUfOf6C5emV6g81ahTOs=",
      PRIVATE: process.env.IMAGEKIT_PRIVATE || "private_pvoj09efencC74qpgXqHEQHWjwU=" ,
      ENDPOINT: process.env.IMAGEKIT_ENDPOINT || "https://ik.imagekit.io/kkventure" ,
    },
    JWT: {
      ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
      ISSUER: process.env.JWT_ISSUER,
      REFRESH_TOKEN: process.env.JWT_REFRESH_SECRET,
      EXPIRES_IN: process.env.JWT_EXPIRES_IN
    },
    PINATA: {
      KEY: process.env.PINATA_KEY || "9d70e2cf4d7c5c4d1186",
      SECRET: process.env.PINATA_SECRET|| "5906c9b14610e80c0b3adb8f3d65144ed77267797b8594bafcbb8146a5ca23ef",
      JWT: process.env.PINATA_JWT|| "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwOGFhMGQ0Zi05NzVkLTQyMzUtOGE5Ny0zMDFjYWRmYmVhNmQiLCJlbWFpbCI6ImF1bmdfa0Bra3ZlbnR1cmVnbG9iYWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZX0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjlkNzBlMmNmNGQ3YzVjNGQxMTg2Iiwic2NvcGVkS2V5U2VjcmV0IjoiNTkwNmM5YjE0NjEwZTgwYzBiM2FkYjhmM2Q2NTE0NGVkNzcyNjc3OTdiODU5NGJhZmNiYjgxNDZhNWNhMjNlZiIsImlhdCI6MTY1MDQ0Nzc1N30.RnZm-3CK1tuXf8djNew7mZ9vXUINM-IW7qRYKS3KSGo",
    }
  };
  