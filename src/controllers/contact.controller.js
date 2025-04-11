const Contact = require('../models/contact.model');
const asyncWrapper = require('../middlewares/asyncWrapper.middleware');
const AppError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
const transporter = require('../utils/emailTransporter');
require('dotenv').config();

const sendMessage = asyncWrapper(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  // Log incoming request data
  console.log('Received contact message request:', {
    name,
    email,
    subject,
    message,
  });

  // Input validation
  if (!name || !email || !message) {
    console.warn(
      'Validation failed: Missing required fields (name, email, message).'
    );
    return next(
      new AppError('Please fill all required fields.', 400, httpStatusText.FAIL)
    );
  }
  console.log('Input validation passed.');

  // Save the contact message to the database
  const newMessage = new Contact({ name, email, subject, message });
  try {
    console.log('Saving new message to the database...');
    await newMessage.save();
    console.log('Message saved successfully:', newMessage);
  } catch (err) {
    console.error('Database save error:', err);
    return next(
      new AppError(
        'Error saving message to database.',
        500,
        httpStatusText.ERROR
      )
    );
  }

  // Set up email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'kamiliaahmed01@gmail.com',
    subject: `New Contact Message: ${subject || 'No Subject'}`,
    text: `You have a new message from:
    
    Name: ${name}
    Email: ${email}
    
    Message:
    ${message}
    `,
  };

  // Send email
  console.log('Sending email...');
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return next(
        new AppError('Error sending email.', 500, httpStatusText.ERROR)
      );
    }
    console.log('Email sent successfully:', info.response);

    // Respond with success
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      message: 'Message sent successfully!',
    });
  });
});

module.exports = {
  sendMessage,
};
