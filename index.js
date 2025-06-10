// Filename: index.js
// This server now accepts advanced options for high-quality vectorization.

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const ImageTracer = require('imagetracerjs');
const Jimp = require('jimp');

// 1. Initialize Express App
const app = express();
const port = process.env.PORT || 3000;

// 2. Setup CORS and Multer
// We need to use express.json() to parse the incoming options
app.use(cors());
app.use(express.json()); 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 3. Main page route for testing
app.get('/', (req, res) => {
    res.send('Advanced Vectorizer Backend is running!');
});

// 4. Create the /vectorize endpoint
// It now uses upload.single() as middleware to handle both file and text fields
app.post('/vectorize', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No image file uploaded.');
    }

    try {
        // 5. Parse the options sent from the frontend
        let options = {};
        if (req.body.options) {
            try {
                options = JSON.parse(req.body.options);
                console.log('Received options:', options);
            } catch (e) {
                return res.status(400).send('Invalid options format.');
            }
        }

        const image = await Jimp.read(req.file.buffer);
        const imageData = {
            width: image.bitmap.width,
            height: image.bitmap.height,
            data: image.bitmap.data,
        };

        // 6. Use imagetracerjs with the user-provided options
        const svgString = ImageTracer.imagedataToSVG(imageData, options);

        console.log('Successfully vectorized image with custom options.');

        // 7. Send the SVG back to the user
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Content-Disposition', 'attachment; filename="vectorized-advanced.svg"');
        res.send(svgString);

    } catch (error) {
        console.error('Error during vectorization:', error);
        res.status(500).send('An error occurred during vectorization.');
    }
});

// 8. Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
