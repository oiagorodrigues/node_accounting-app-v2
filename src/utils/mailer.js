const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASSWORD,
  },
});

/**
 * @param {string} email
 * @param {string} subject
 * @param {string} html
 * @returns {Promise<import('nodemailer').SentMessageInfo>}
 */
const send = (email, subject, html) => {
  return transporter.sendMail({
    from: 'Auth API',
    to: email,
    subject,
    html,
  });
};

/**
 * @param {string} email
 * @param {string} activationToken
 * @returns {Promise<import('nodemailer').SentMessageInfo>}
 */
const sendActivationLink = (email, activationToken) => {
  const link = `${process.env.CLIENT_URL}/auth/activate/${email}/${activationToken}`;
  const html = `
    <h1>Activate your account</h1>
    <a href="${link}">${link}</a>
  `;

  return send(email, 'Account activation', html);
};

/**
 * @param {string} email
 * @returns {Promise<import('nodemailer').SentMessageInfo>}
 */
const sendAccountActivatedEmail = (email) => {
  const html = `
    <h1>Your account has been activated</h1>
    <p>You can login to your account now.</p>
  `;

  return send(email, 'Account activated', html);
};

module.exports = {
  send,
  sendActivationLink,
  sendAccountActivatedEmail,
};
