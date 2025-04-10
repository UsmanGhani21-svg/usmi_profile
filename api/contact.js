// // const nodemailer = require('nodemailer');

// // export default async function handler(req, res) {
// //     if (req.method === 'POST') {
// //         const { name, email, subject, message } = req.body;

// //         // Create a transporter object using your email service
// //         const transporter = nodemailer.createTransport({
// //             service: 'gmail',  // Use your email provider
// //             auth: {
// //                 user: 'your_email@gmail.com',  // Replace with your email
// //                 pass: 'your_email_password'     // Replace with your email password (or use app-specific password)
// //             }
// //         });

// //         const mailOptions = {
// //             from: email,
// //             to: 'your_email@example.com', // The email to receive form submissions
// //             subject: subject,
// //             text: `You have a new message from ${name} (${email})\n\n${message}`
// //         };

// //         try {
// //             // Send the email
// //             await transporter.sendMail(mailOptions);
// //             res.status(200).json({ message: 'Message sent successfully!' });
// //         } catch (error) {
// //             console.error('Error sending email:', error);
// //             res.status(500).json({ error: 'Failed to send message' });
// //         }
// //     } else {
// //         // Handle non-POST requests
// //         res.status(405).json({ error: 'Method Not Allowed' });
// //     }
// // }
// import nodemailer from 'nodemailer';

// export default async function handler(req, res) {
//     if (req.method === 'POST') {
//         const { name, email, subject, message } = req.body;

//         // Create a transporter object using your email service
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: process.env.GMAIL_USER,  // Use environment variable
//                 pass: process.env.GMAIL_PASS,  // Use environment variable (app password)
//             },
//         });

//         const mailOptions = {
//             from: email,
//             to: 'your_email@example.com',  // Replace with your email
//             subject: subject,
//             text: `You have a new message from ${name} (${email})\n\n${message}`,
//         };

//         try {
//             // Send the email
//             await transporter.sendMail(mailOptions);
//             res.status(200).json({ message: 'Message sent successfully!' });
//         } catch (error) {
//             console.error('Error sending email:', error);
//             res.status(500).json({ error: 'Failed to send message' });
//         }
//     } else {
//         res.status(405).json({ error: 'Method Not Allowed' });
//     }
// }
document.getElementById('contact-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(this); // Collect form data
    const formObject = Object.fromEntries(formData.entries()); // Convert form data to an object

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Sending form data in URL encoded format
            },
            body: new URLSearchParams(formObject), // Send form data in URLSearchParams format
        });

        const result = await response.json(); // Parse JSON response
        
        if (response.ok) {
            // Success: Display success message on the page and reset form
            document.getElementById('form-feedback').innerHTML = `<p>Message sent successfully!</p>`;
            document.getElementById('contact-form').reset(); // Reset the form fields
        } else {
            // Failure: Display error message on the page
            document.getElementById('form-feedback').innerHTML = `<p>Error: ${result.message || 'Failed to send message'}</p>`;
        }
    } catch (error) {
        console.error('Error:', error); // Log errors
        // Display generic error message on the page
        document.getElementById('form-feedback').innerHTML = `<p>There was an issue sending your message. Please try again later.</p>`;
    }
});
