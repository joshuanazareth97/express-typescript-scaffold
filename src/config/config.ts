import dotenv from "dotenv";
dotenv.config();

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  secret: process.env.SECRET,
  baseUrl: process.env.BASE_URL,
  mailer: {
    email: process.env.EMAIL_AUTH,
    password: process.env.EMAIL_PASSPHRASE,
    smtp: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
  },
};
