const mongoose = require('mongoose');

// Define the schema for images
const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    
});

// Create the model from the schema
const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
