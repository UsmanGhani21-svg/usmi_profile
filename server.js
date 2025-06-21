const http = require('http');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const querystring = require('querystring');
require('dotenv').config(); // Load .env variables

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
        if (filePath.endsWith('/')) filePath += 'index.html';

        const extname = path.extname(filePath);
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
        };
        const contentType = mimeTypes[extname] || 'application/octet-stream';

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

    else if (req.method === 'POST' && req.url === '/api/contact') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const { name, email, subject, message } = querystring.parse(body);

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASS,
                },
            });

            const mailOptions = {
                from: email,
                to: process.env.GMAIL_USER, // Send to your own Gmail
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

    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

