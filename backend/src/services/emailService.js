import nodemailer from "nodemailer";
import env from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.EMAIL.HOST,
  port: env.EMAIL.PORT,
  secure: env.EMAIL.SECURE,

  auth: {
    user: env.EMAIL.USER,
    pass: env.EMAIL.PASSWORD,
  },
});

/**
 * Send a contact form notification.
 */
export const sendContactEmail = async ({ name, email, subject, message }) => {
  await transporter.sendMail({
    from: env.EMAIL.FROM,
    to: env.EMAIL.CONTACT_EMAIL,

    replyTo: email,

    subject: `Portfolio Contact: ${subject}`,

    text: `
New contact message

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
    `.trim(),

    html: `
      <h2>New Portfolio Contact Message</h2>

      <p>
        <strong>Name:</strong> ${name}
      </p>

      <p>
        <strong>Email:</strong> ${email}
      </p>

      <p>
        <strong>Subject:</strong> ${subject}
      </p>

      <hr />

      <p>
        <strong>Message:</strong>
      </p>

      <p>
        ${message.replace(/\n/g, "<br />")}
      </p>
    `,
  });
};
