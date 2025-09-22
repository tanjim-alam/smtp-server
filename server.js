require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require("cors");

const app = express();
const port = 8081;

// Middleware
const corsOptions = {
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "server.mpi.ktv.mybluehostin.me",
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT == 465,
    pool: true,
    maxConnections: 5,
    maxMessages: 10,
    auth: {
        user: process.env.SMTP_USER || "info@sumadhurafolium.co",
        pass: process.env.SMTP_PASS || "City@12345#"
    }
});

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Wow SMTP1"
    })
})

app.post('/send-email', async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.number) {
        res.status(400).json({
            success: false,
            message: "All fields are required"
        });
        return;
    }

    try {
        const result = await transporter.sendMail({
            from: `"${req.body.name}" <m2ndigitalagency@gmail.com>`,
            to: req.body.company_email || 'info@mndigital.in',
            subject: `New Enquiry from ${req.body.project_name}`,
            html: `
                <h4>
                    Name: ${req.body.name}<br>
                    Email: ${req.body.email}<br>
                    Mobile Number: ${req.body.number}<br>
                    Country Code: ${req.body.country_code}
                </h4>
            `,
            replyTo: req.body.email
        });

        res.status(200).json({
            success: true,
            message: "Processing your request, we will notify you shortly.",
            data: result
        });
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
