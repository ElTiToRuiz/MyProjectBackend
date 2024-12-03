import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const transporter = nodemailer.createTransport({
    host: "smpt.gmail.com",
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages');
    }
});

export const bugReportEmail = ({bugTitle, bugDescription}) => {
    return {
        from: process.env.EMAIL,
        to: 'ruiz.igor@opendeusto.es',
        subject: bugTitle,
        text: bugDescription
    }
}

export const sendPasswordToUser = ({email, password}) => {
    return {
        from: process.env.EMAIL,
        to: email,
        subject: 'Welcome to Our Service - Your Account Details',
        text: 
        `Hey,
        We're excited to welcome you to [Company Name]! Below are your account details:

        Email: ${email}
        Temporary Password: ${password}

        For your security, please make sure to change your password after logging in for the first time.

        If you have any questions or need assistance, feel free to contact our support team.

        We look forward to having you with us!

        Best regards,
        The Team`
    }
}

export const sendNewPasswordToUser = ({email, password}) => {
    return {
        from: process.env.EMAIL,
        to: email,
        subject: 'Password Reset - Your New Login Details',
        text: 
        `Hey,

        We've successfully reset your password. Below are your new login details:

        Email: ${email}
        New Password: ${password}

        For your security, we recommend that you change your password as soon as possible after logging in.

        If you did not request this reset, please contact our support team immediately.

        Best regards,
        The Team`
    }
}