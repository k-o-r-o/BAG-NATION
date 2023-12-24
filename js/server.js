const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
//require('dotenv').config({ path: '/home/koro/Documents/code projects/pxls/bagsite/.env' });
const path = require('path');
const Image = require('../models/image'); // Update this path 
const app = express();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Provide the full absolute path to the uploads directory
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create a unique file name
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const createUploadsDir = require('../uploads');
createUploadsDir(); // Create the uploads directory if it doesn't already exist


mongoose.connect('mongodb+srv://@bag.fy4btjf.mongodb.net/myAppDatabase')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));



app.use(express.static(path.join(__dirname, '..'))); 

// Middleware to serve images from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/images/search', async (req, res) => {
  try {
    const searchTerm = req.query.term;
    const exactMatch = await Image.findOne({ name: searchTerm });
    const otherMatches = await Image.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' }, _id: { $ne: exactMatch?._id } },
        { tags: { $regex: searchTerm, $options: 'i' } }
      ]
    });
    const results = exactMatch ? [exactMatch, ...otherMatches] : otherMatches;
    res.json(results);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/api/images/upload', upload.single('image'), async (req, res) => {
  try {
    const { name, tags } = req.body;
    const imageUrl = req.file.filename; 

    const image = new Image({
      name,
      imageUrl, // Save just the filename
      tags: tags.split(',').map(tag => tag.trim())
    });

    await image.save();
    res.status(201).send('Image uploaded successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.get('/images/:imageId', async (req, res) => {
  try {
    const imageId = req.params.imageId;

    // Query MongoDB to find the image data by ID (you need to define this part)
    const imageData = await getImageDataById(imageId);

    if (!imageData) {
      return res.status(404).send('Image not found');
    }

    res.setHeader('Content-Type', 'image/png');

    res.send(imageData);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
