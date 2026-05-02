require('dotenv').config(); // Must be at the very top
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const cors = require('cors');

const Medicine = require('./src/models/medicine');
const medicineRoutes = require('./src/routes/medicineRoute');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGO_URI,{
  family: 4 // Forces the connection to use IPv4
})
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// Routes
app.use('/api/medicines', medicineRoutes);

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Automated Expiry Reminder (Runs every day at 00:00 server time)
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily expiry check...');
    try {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        // Find medicines expiring within the next 7 days that haven't been consumed
        const expiringSoon = await Medicine.find({
            expiryDate: { $lte: nextWeek, $gte: today },
            status: 'available'
        });

        if (expiringSoon.length === 0) {
            console.log('No medicines expiring soon.');
            return;
        }

        for (const med of expiringSoon) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: med.userEmail,
                subject: `MedVault Alert: ${med.name} Expiring Soon!`,
                text: `Hello,\n\nYour medicine "${med.name}" is set to expire on ${med.expiryDate.toDateString()}.\n\nPlease dispose of it safely if it is not consumed.\n\nStay Healthy,\nThe MedVault Team`
            };

            await transporter.sendMail(mailOptions);
            console.log(`Reminder sent for ${med.name} to ${med.userEmail}`);
        }
    } catch (error) {
        console.error("Error in cron job:", error);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});