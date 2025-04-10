const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, email, subject, message } = req.body;

        // Create a transporter object using your email service
        const transporter = nodemailer.createTransport({
            service: 'gmail',  // Use your email provider
            auth: {
                user: 'your_email@gmail.com',  // Replace with your email
                pass: 'your_email_password'     // Replace with your email password (or use app-specific password)
            }
        });

        const mailOptions = {
            from: email,
            to: 'your_email@example.com', // The email to receive form submissions
            subject: subject,
            text: `You have a new message from ${name} (${email})\n\n${message}`
        };

        try {
            // Send the email
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Message sent successfully!' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Failed to send message' });
        }
    } else {
        // Handle non-POST requests
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
