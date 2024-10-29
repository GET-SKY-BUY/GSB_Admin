const fs = require('fs');
const path = require('path');
const sharp = require('sharp');


async function processImage(fileName) {
    try {
        const inputPath = path.join(__dirname, '../Uploaded_Product_Images', fileName);
        const outputFilePath = path.join(__dirname, '../Converted_Images', `${path.parse(fileName).name}_${Date.now()}_Save.webp`);
        
        let image = sharp(inputPath);
        const metadata = await image.metadata();
        const maxSize = Math.max(metadata.width, metadata.height, 800);
        image = image.resize({
            width: maxSize,
            height: maxSize,
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 1 }
        });
        image = image.flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } });
        await image.toFormat('webp', { quality: 95 }).toFile(outputFilePath);

        return path.basename(outputFilePath);
    } catch (error) {
        return null;
    };
};

// let a = processImage('My_Image-01-removebg-preview.png');

module.exports = processImage;
