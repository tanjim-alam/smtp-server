require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8081;

// ---------- Middleware ----------
app.use(cors({
    origin: "*",   // or "https://projects-launch.in" for stricter setup
    methods: ["GET", "POST"],
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ---------- Nodemailer Transport (Gmail SMTP) ----------
let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for 587
    auth: {
        user: "tanjim11alam@gmail.com", // your Gmail address
        pass: "heomrbwqxaaxhppj"  // 16-char Gmail App Password
    }
});

// ---------- Routes ----------
app.get("/", (req, res) => {
    res.status(200).json({ message: "SMTP server is running 🚀" });
});

app.post("/send-email", async (req, res) => {
    const { name, email, number, project_name, company_email, country_code } = req.body;

    if (!name || !email || !number) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        const result = await transporter.sendMail({
            from: `"${name}" <${process.env.SMTP_USER}>`,
            to: company_email || "info@mndigital.in",
            subject: `New Enquiry from ${project_name || "Website"}`,
            html: `
                <h4>
                    Name: ${name}<br>
                    Email: ${email}<br>
                    Mobile Number: ${number}<br>
                    Country Code: ${country_code || "N/A"}
                </h4>
            `,
            replyTo: email
        });

        res.status(200).json({
            success: true,
            message: "Email sent successfully ✅",
            data: result
        });
    } catch (error) {
        console.error("Email sending failed:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send email ❌",
            error: error.message
        });
    }
});

// ---------- Start Server ----------
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
