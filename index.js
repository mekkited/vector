// Filename: index.js
// This is the main server file.

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { vectorize } = require('@neplex/vectorizer');

// 1. Initialize Express App
const app = express();
const port = process.env.PORT || 3000;

// 2. Setup CORS (Cross-Origin Resource Sharing)
// This is CRITICAL. It allows your Blogger/GitHub page to communicate with this server.
app.use(cors());

// 3. Setup Multer for file uploads
// We'll store the uploaded image in memory to process it.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 4. Create the main page route (for testing)
app.get('/', (req, res) => {
    res.send('Image Vectorizer Backend is running! Ready to receive images on the /vectorize endpoint.');
});

// 5. Create the /vectorize endpoint
// This is where the magic happens.
app.post('/vectorize', upload.single('image'), async (req, res) => {
    // Check if an image was uploaded
    if (!req.file) {
        return res.status(400).send('No image file uploaded.');
    }

    try {
        console.log('Received image:', req.file.originalname);

        // Get the image data from the request
        const imageBuffer = req.file.buffer;

        // Use the vectorizer library to convert the image buffer to an SVG string
        // We can add more advanced options here later if needed.
        const svgString = await vectorize(imageBuffer);

        console.log('Successfully vectorized image.');

        // 6. Send the SVG back to the user
        // Set headers to tell the browser it's an SVG file and to prompt a download
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Content-Disposition', `attachment; filename="vectorized-image.svg"`);
        res.send(svgString);

    } catch (error) {
        console.error('Error vectorizing image:', error);
        res.status(500).send('An error occurred during vectorization.');
    }
});

// 7. Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
