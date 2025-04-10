const http = require('http');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    // Serve static files (HTML, CSS, JS)
    if (req.method === 'GET') {
        let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
        if (filePath.endsWith('/')) filePath += 'index.html'; // Default to index.html for directories
        
        const extname = path.extname(filePath);
        let contentType = 'text/html';

        if (extname === '.js') contentType = 'application/javascript';
        if (extname === '.css') contentType = 'text/css';
        if (extname === '.json') contentType = 'application/json';
        if (extname === '.png') contentType = 'image/png';
        if (extname === '.jpg') contentType = 'image/jpeg';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end(`Error: ${err.code}`);
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
    }

    // Handle form submission (POST request to /api/contact)
    if (req.method === 'POST' && req.url === '/api/contact') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            const parsedData = querystring.parse(body); // Parse form data
            
            const { name, email, subject, message } = parsedData;

            // Create a transporter object using your email service (Gmail in this case)
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,  // Use environment variable
                    pass: process.env.GMAIL_PASS,  // Use environment variable (app password)
                },
            });

            const mailOptions = {
                from: email,
                to: 'your_email@example.com', // Replace with your email address
                subject: subject,
                text: `You have a new message from ${name} (${email})\n\n${message}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to send message' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Message sent successfully!' }));
                }
            });
        });
    }

    // Handle any unsupported routes
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
