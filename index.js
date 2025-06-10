// Filename: index.js
// This is the main server file.

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
    res.send('Image Vectorizer Backend is running! Using ImageTracer.js.');
});

// 5. Create the /vectorize endpoint
app.post('/vectorize', upload.single('image'), async (req, res) => {
    // Check if an image was uploaded
    if (!req.file) {
        return res.status(400).send('No image file uploaded.');
    }

    try {
        console.log('Received image:', req.file.originalname);

        // Use the 'jimp' library to read the image buffer
        const image = await Jimp.read(req.file.buffer);

        // Create an ImageData-like object that imagetracerjs can understand
        const imageData = {
            width: image.bitmap.width,
            height: image.bitmap.height,
            data: image.bitmap.data,
        };

        // 6. Use imagetracerjs to convert the image data to an SVG string
        const svgString = ImageTracer.imagedataToSVG(imageData, {
            ltres: 1,
            qtres: 1,
            pathomit: 8,
            rightangleenhance: true
        });

        console.log('Successfully vectorized image.');

        // 7. Send the SVG back to the user
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Content-Disposition', `attachment; filename="vectorized-image.svg"`);
        res.send(svgString);

    } catch (error) {
        console.error('Error vectorizing image:', error);
        res.status(500).send('An error occurred during vectorization.');
    }
});

// 8. Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
