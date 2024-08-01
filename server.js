const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require("path")
const https = require('https');
const fs = require('fs');

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(cors());

const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/rstravel.in/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/rstravel.in/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/rstravel.in/chain.pem')
};


// SMTP transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rstravelsagra@gmail.com',
        pass: 'blen jaij atkv hqxg'
    }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Handle GET requests to serve the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// API endpoint to send emails
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;
    console.log(name)
    console.log(name)
    const fixedRecipient = 'info.rstravellsagra@gmail.com';
    const allRecipients = [email, fixedRecipient]; // Combine both email addresses

    const mailOptions = {
        from: 'rstravelsagra@gmail.com',
        to: allRecipients.join(', '), // Join recipients with comma and space
        subject: 'Travel Details',
        html: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send({ success: false, message: 'Error sending email' });
        } else {
            console.log('Email sent: ' + info.response);
            res.send({ success: true, message: 'Email sent successfully' });
        }
    });
});



https.createServer(options, app).listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
});