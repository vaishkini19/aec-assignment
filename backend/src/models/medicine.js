const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    expiryDate: { 
        type: Date, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['available', 'consumed', 'expired'], 
        default: 'available' 
    },
    images: [{ type: String }],
    userEmail: { 
        type: String, 
        required: true 
    },
    extractedAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

module.exports = mongoose.models.Medicine || mongoose.model('Medicine', MedicineSchema);