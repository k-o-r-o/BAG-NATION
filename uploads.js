const fs = require('fs');
const path = require('path');

// This function will create an 'uploads' directory if it doesn't already exist
function createUploadsDir() {
    const uploadsDir = path.join(__dirname, '..', 'uploads'); // Adjust the path as needed

    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('Uploads directory created');
    } else {
        console.log('Uploads directory already exists');
    }
}

// Export the function so it can be used in server.js
module.exports = createUploadsDir;
