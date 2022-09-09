import nodemailer from "nodemailer";
import config from "../../config/config";

const transporter = nodemailer.createTransport({
  host: config.mailer.smtp,
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.mailer.email,
    pass: config.mailer.password,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

export const sendMail = async (to: string, subject: string, body: string) => {
  try {
    let info = await transporter.sendMail({
      from: '"Eval" <sample@gmail.com>', // sender address
      to,
      subject, // Subject line
      html: body,
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const sendVerifyMail = async (to: string, accessToken: string) => {
  const subject = "Verify yourself!";
  const body = `<b>Please click on the following link to verify yourself, link is valid for next 10 minutes only.</b>
                <a href="${config.baseUrl}/users/verify?token=${accessToken}">Click</a>`;
  await sendMail(to, subject, body);
};

export const sendForgetPasswordMail = async (
  to: string,
  accessToken: string
) => {
  const subject = "Forget password!";
  const body = `<b>Please click on following link to reset your password, link is valid for next 10 minutes only.</b>
                <a href="${config.baseUrl}/users/forget-password?token=${accessToken}">Click</a>`;
  await sendMail(to, subject, body);
};
