// Filename: index.js
// This is the main server file, now with high-quality settings.

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const ImageTracer = require('imagetracerjs');
const Jimp = require('jimp');

// 1. Initialize Express App
const app = express();
const port = process.env.PORT || 3000;

// 2. Setup CORS (Cross-Origin Resource Sharing)
app.use(cors());

// 3. Setup Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 4. Create the main page route (for testing)
app.get('/', (req, res) => {
    res.send('Image Vectorizer Backend is running! Using High-Quality Settings.');
});

// 5. Create the /vectorize endpoint
app.post('/vectorize', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No image file uploaded.');
    }

    try {
        console.log('Received image for high-quality vectorization:', req.file.originalname);

        const image = await Jimp.read(req.file.buffer);
        const imageData = {
            width: image.bitmap.width,
            height: image.bitmap.height,
            data: image.bitmap.data,
        };

        // 6. Use imagetracerjs with the 'posterized3' preset for high detail.
        // This provides a great balance of color and detail for complex images.
        const svgString = ImageTracer.imagedataToSVG(imageData, 'posterized3');

        console.log('Successfully vectorized image with high quality.');

        // 7. Send the SVG back to the user
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Content-Disposition', `attachment; filename="vectorized-image-hq.svg"`);
        res.send(svgString);

    } catch (error) {
        console.error('Error during high-quality vectorization:', error);
        res.status(500).send('An error occurred during vectorization.');
    }
});

// 8. Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
