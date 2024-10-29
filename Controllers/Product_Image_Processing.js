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
        throw error;
    };
};

const Product_Image_Processing = async ( req , res , next ) => {
    try {
        const files = req.files;
        const processedImages = [];
        for (let i = 0; i < files.length; i++) {
            const processedImage = await processImage(files[i].filename);
            processedImages.push(processedImage);
        };
        req.processedImages = processedImages;
        next();
    } catch (error) {
        async function deleteFiles(files) {
            for (let i = 1; i <= 7; i++) {
                let filename = files[`Image${i}`]?.[0]?.filename;
                if (filename) {
                    let ImgPath = path.join(__dirname, "../Uploaded_Product_Images", filename);
                    await fs.unlinkSync(ImgPath);
                };
            };
        };
        next(error);
    };
};

module.exports = Product_Image_Processing;
