const express = require('express');
const router = express.Router();
const multer = require('multer');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const Medicine = require('../models/medicine');

// Configure Multer for temporary image storage
const upload = multer({ dest: 'uploads/' });
router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: true }));

// POST: Upload Prescription and Extract Data via OCR
router.post('/upload', upload.array('prescriptions',5), async (req, res) => {
        let combinedText = "";
        let imageStrings = [];
    try {
        const { email } = req.body;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ error: "No image provided." });
        }

        // 1. Process each image for OCR and convert to Base64
        for (const file of files) {
            // Convert file to Base64 to save in DB
            const b64 = fs.readFileSync(file.path, { encoding: 'base64' });
            imageStrings.push(`data:${file.mimetype};base64,${b64}`);

            // Run OCR
            const { data: { text } } = await Tesseract.recognize(file.path, 'eng');
            combinedText += " " + text;

            // Cleanup local temp file
            fs.unlinkSync(file.path);
        }

        // 2. Extract Date using Regex (Looking for MM/YY or MM/YYYY or DD/MM/YYYY)
        const datePattern = /\b(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})\b/;
        const match = combinedText.match(datePattern);
        
        let expiry;
        if (match) {
            // Basic fallback logic for date parsing based on regex hit
            const parts = match[0].split('/');
            if (parts.length === 2) {
                const year = parts[1].length === 2 ? `20${parts[1]}` : parts[1];
                expiry = new Date(`${year}-${parts[0]}-01`); // Defaulting to 1st of the month
            } else {
                expiry = new Date(match[0]); 
            }
        } else {
            // Fallback if OCR fails to find a date
            expiry = new Date(); 
        }

        // 3. Save to Database
        const newMedicine = new Medicine({
            name: "Extracted Med (Review Needed)", // Placeholder name until user edits
            expiryDate: expiry,
            userEmail: email,
            images: imageStrings,
            isVerified: false
        });

        await newMedicine.save();

        // 4. Clean up the uploaded file from the server
        

        res.status(201).json({ 
            message: "Medicine logged successfully", 
            extractedText: combinedText, // Optional: return raw text for frontend debugging
            data: newMedicine 
        });

    } catch (error) {
        // Ensure file is deleted even if an error occurs
        if (req.files && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.log("--- ERROR DETECTED ---");
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// GET: Fetch all medicines for a user
router.get('/:email', async (req, res) => {
    try {
        const medicines = await Medicine.find({ userEmail: req.params.email }).sort({ expiryDate: 1 });
        res.status(200).json(medicines);
    } catch (error) {
        console.log("--- ERROR DETECTED ---");
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// PATCH: Mark a medicine as consumed
router.patch('/:id/consume', async (req, res) => {
    try {
        const med = await Medicine.findByIdAndUpdate(
            req.params.id, 
            { status: 'consumed' }, 
            { new: true }
        );

        if (!med) return res.status(404).json({ error: "Medicine not found" });

        res.status(200).json({ message: "Marked as consumed", data: med });
    } catch (error) {
        console.log("--- ERROR DETECTED ---");
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Update medicine details manually
router.put('/update/:id', async (req, res) => {
    try {
        const { name, expiryDate } = req.body;
        const updatedMed = await Medicine.findByIdAndUpdate(
            req.params.id,
            { 
                ...(expiryDate && { expiryDate: new Date(expiryDate) }),
                ...(name && { name }), // This looks for 'name' in req.body
                isVerified: true 
            },
            { new: true }
        );
        res.status(200).json({ message: "Updated successfully", data: updatedMed });
    } catch (error) {
        console.log("--- ERROR DETECTED ---");
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});
// PATCH: Correct the OCR data manually
router.patch('/verify-medicine/:id', async (req, res) => {
    try {
        const { expiryDate, name } = req.body;

        const updatedMed = await Medicine.findByIdAndUpdate(
            req.params.id,
            { 
                // Only these fields will be updated
                ...(expiryDate && { expiryDate: new Date(expiryDate) }),
                ...(name && { name }),
                isVerified: true 
            },
            { new: true } // Returns the corrected document
        );

        if (!updatedMed) return res.status(404).json({ error: "Medicine not found" });

        res.status(200).json({ 
            message: "Data overruled and verified!", 
            data: updatedMed 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;