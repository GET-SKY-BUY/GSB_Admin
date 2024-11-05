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
        image = image.clone().resize({
            width: maxSize,
            height: maxSize,
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 1 }
        }).flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } });
        await image.toFormat('webp', { quality: 95 }).toFile(outputFilePath);

        return String(path.basename(outputFilePath));
    } catch (error) {
        throw error;
    };
};

const Product_Image_Processing = async ( req , res , next ) => {
    const processedImages = [];
    try {
        const files = Object.assign({}, req.files);
        for (let index = 1; index < 8; index++) {
            let Image = `Image${index}`;
            if (files[Image] && files[Image][0]) {
                
                const processedImage = await processImage(files[Image][0].filename);
                processedImages.push(processedImage);
                // const inputPath = path.join(__dirname, '../Uploaded_Product_Images', files[Image][0].filename);
                // setTimeout(async() => {
                //     await fs.promises.unlink(inputPath);
                // }, 100);
            };
        };

        req.processedImages = processedImages;    
        next();
    } catch (error) {
        req.Converted_Product_Images = processedImages;
        req.Delete_Product_Images = req.files;
        next(error);
    };
};

module.exports = Product_Image_Processing;
