require('dotenv').config();
const { sendPasswordResetEmail } = require('./src/utils/emailService');

const testEmail = async () => {
    console.log('Testing email sending...');
    console.log('Host:', process.env.EMAIL_HOST);
    console.log('User:', process.env.EMAIL_USER);

    try {
        await sendPasswordResetEmail(
            process.env.EMAIL_USER, // Send to self
            'http://test-link.com',
            'Test User'
        );
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Failed to send email:', error);
    }
};

testEmail();
