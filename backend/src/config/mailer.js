import nodemailer from "nodemailer";

import env from "./env.js";

const transporter = nodemailer.createTransport({
  host: env.EMAIL.HOST,
  port: env.EMAIL.PORT,
  secure: env.EMAIL.SECURE,

  auth: {
    user: env.EMAIL.USER,
    pass: env.EMAIL.PASSWORD,
  },
});

export default transporter;
